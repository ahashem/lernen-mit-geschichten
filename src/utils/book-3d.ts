/**
 * 3D Book Physics and Animation Utilities
 * Provides realistic page flipping, shadow calculations, and gesture detection
 */

export interface Book3DConfig {
  enablePageCurl: boolean;
  enableShadows: boolean;
  enableDragFlip: boolean;
  theme: 'modern' | 'classic' | 'storybook' | 'comic' | 'vintage';
  pageTexture: boolean;
  autoFlipSpeed: number; // ms per page
  soundEffects: boolean;
  vibration: boolean;
  pageThickness: number; // px
  perspectiveDepth: number; // px
  flipDuration: number; // ms
}

export interface PageFlipState {
  currentPage: number;
  targetPage: number;
  isFlipping: boolean;
  flipProgress: number; // 0-1
  dragPosition: { x: number; y: number } | null;
  flipDirection: 'forward' | 'backward';
  isDragging: boolean;
  curlAmount: number; // 0-1
}

export interface Point {
  x: number;
  y: number;
}

export interface CurlParameters {
  angle: number; // curl angle in degrees
  radius: number; // curl radius
  origin: Point; // curl origin point
  progress: number; // 0-1
}

// Default configuration
export const DEFAULT_BOOK_CONFIG: Book3DConfig = {
  enablePageCurl: true,
  enableShadows: true,
  enableDragFlip: true,
  theme: 'modern',
  pageTexture: true,
  autoFlipSpeed: 3000,
  soundEffects: false,
  vibration: false,
  pageThickness: 3,
  perspectiveDepth: 1500,
  flipDuration: 800,
};

// Theme configurations
export const BOOK_THEMES = {
  modern: {
    pageColor: '#ffffff',
    backgroundColor: '#f5f5f5',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    textColor: '#333333',
    texture: 'none',
    fontFamily: 'Noto Sans, sans-serif',
  },
  classic: {
    pageColor: '#fef9e7',
    backgroundColor: '#8b4513',
    shadowColor: 'rgba(101, 67, 33, 0.4)',
    textColor: '#2c1810',
    texture: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.05\'/%3E%3C/svg%3E")',
    fontFamily: 'Georgia, serif',
  },
  storybook: {
    pageColor: '#fffef8',
    backgroundColor: '#ff9f40',
    shadowColor: 'rgba(255, 159, 64, 0.4)',
    textColor: '#4a3c28',
    texture: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpattern id=\'dots\' x=\'0\' y=\'0\' width=\'20\' height=\'20\' patternUnits=\'userSpaceOnUse\'%3E%3Ccircle cx=\'10\' cy=\'10\' r=\'1\' fill=\'%23ffd93d\' opacity=\'0.1\'/%3E%3C/pattern%3E%3Crect width=\'100\' height=\'100\' fill=\'url(%23dots)\'/%3E%3C/svg%3E")',
    fontFamily: 'Comic Sans MS, cursive',
  },
  comic: {
    pageColor: '#fff9c4',
    backgroundColor: '#2c2c2c',
    shadowColor: 'rgba(0, 0, 0, 0.6)',
    textColor: '#000000',
    texture: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
    fontFamily: 'Impact, sans-serif',
  },
  vintage: {
    pageColor: '#f4e8d0',
    backgroundColor: '#3e2723',
    shadowColor: 'rgba(62, 39, 35, 0.5)',
    textColor: '#3e2723',
    texture: 'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'paper\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.04\' numOctaves=\'5\' result=\'noise\'/%3E%3CfeDiffuseLighting in=\'noise\' lighting-color=\'%23f4e8d0\' surfaceScale=\'1\'%3E%3CfeDistantLight azimuth=\'45\' elevation=\'60\'/%3E%3C/feDiffuseLighting%3E%3C/filter%3E%3Crect width=\'200\' height=\'200\' filter=\'url(%23paper)\' opacity=\'0.3\'/%3E%3C/svg%3E")',
    fontFamily: 'Times New Roman, serif',
  },
};

/**
 * Easing functions for natural page flip animations
 */
export const Easing = {
  // Cubic ease-out for natural deceleration
  easeOutCubic: (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  },

  // Quartic ease-in-out for smooth flip
  easeInOutQuart: (t: number): number => {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
  },

  // Elastic ease-out for page settling
  easeOutElastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },

  // Back ease-out for slight overshoot
  easeOutBack: (t: number): number => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },

  // Sine ease-in-out for smooth curl
  easeInOutSine: (t: number): number => {
    return -(Math.cos(Math.PI * t) - 1) / 2;
  },
};

/**
 * Calculate page curl parameters based on drag position
 */
export function calculateCurlParameters(
  dragPosition: Point,
  pageWidth: number,
  pageHeight: number,
  corner: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left'
): CurlParameters {
  let origin: Point;

  // Determine curl origin based on corner
  switch (corner) {
    case 'top-right':
      origin = { x: pageWidth, y: 0 };
      break;
    case 'bottom-right':
      origin = { x: pageWidth, y: pageHeight };
      break;
    case 'top-left':
      origin = { x: 0, y: 0 };
      break;
    case 'bottom-left':
      origin = { x: 0, y: pageHeight };
      break;
  }

  // Calculate distance from origin
  const dx = dragPosition.x - origin.x;
  const dy = dragPosition.y - origin.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Calculate angle
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  // Calculate curl radius (proportional to distance)
  const maxRadius = Math.sqrt(pageWidth * pageWidth + pageHeight * pageHeight);
  const radius = Math.min(distance, maxRadius);

  // Calculate progress (0-1)
  const progress = Math.min(distance / maxRadius, 1);

  return {
    angle,
    radius,
    origin,
    progress,
  };
}

/**
 * Calculate shadow gradient based on flip progress
 */
export function calculateShadowGradient(
  progress: number,
  direction: 'forward' | 'backward',
  theme: keyof typeof BOOK_THEMES = 'modern'
): string {
  const themeConfig = BOOK_THEMES[theme];
  const baseColor = themeConfig.shadowColor;

  // Shadow intensity increases as page flips
  const intensity = Easing.easeInOutSine(progress);

  if (direction === 'forward') {
    // Shadow on left page (receiving shadow)
    return `linear-gradient(to right,
      ${baseColor.replace('0.3', String(0.1 + intensity * 0.2))} 0%,
      transparent 20%
    )`;
  } else {
    // Shadow on right page (receiving shadow)
    return `linear-gradient(to left,
      ${baseColor.replace('0.3', String(0.1 + intensity * 0.2))} 0%,
      transparent 20%
    )`;
  }
}

/**
 * Calculate spine shadow based on current page
 */
export function calculateSpineShadow(
  currentPage: number,
  totalPages: number,
  theme: keyof typeof BOOK_THEMES = 'modern'
): string {
  const themeConfig = BOOK_THEMES[theme];
  const baseColor = themeConfig.shadowColor;

  // Shadow is stronger in the middle of the book
  const centerDistance = Math.abs((currentPage / totalPages) - 0.5);
  const intensity = 1 - (centerDistance * 2);

  return `inset 0 0 20px ${baseColor.replace('0.3', String(intensity * 0.15))}`;
}

/**
 * Generate bezier curve points for page curl edge
 */
export function generateCurlBezier(
  curlParams: CurlParameters,
  pageWidth: number,
  pageHeight: number
): string {
  const { angle, radius, origin, progress } = curlParams;

  // Calculate control points for smooth bezier curve
  const angleRad = (angle * Math.PI) / 180;
  const curlAmount = radius * progress;

  // Main curl curve
  const cp1x = origin.x - Math.cos(angleRad) * curlAmount * 0.33;
  const cp1y = origin.y - Math.sin(angleRad) * curlAmount * 0.33;
  const cp2x = origin.x - Math.cos(angleRad) * curlAmount * 0.66;
  const cp2y = origin.y - Math.sin(angleRad) * curlAmount * 0.66;
  const endX = origin.x - Math.cos(angleRad) * curlAmount;
  const endY = origin.y - Math.sin(angleRad) * curlAmount;

  return `M ${origin.x},${origin.y} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${endY}`;
}

/**
 * Detect which corner was grabbed based on touch position
 */
export function detectGrabbedCorner(
  touchPoint: Point,
  pageWidth: number,
  pageHeight: number,
  threshold: number = 100
): 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left' | null {
  // Check each corner
  const corners = [
    { name: 'top-right' as const, x: pageWidth, y: 0 },
    { name: 'bottom-right' as const, x: pageWidth, y: pageHeight },
    { name: 'top-left' as const, x: 0, y: 0 },
    { name: 'bottom-left' as const, x: 0, y: pageHeight },
  ];

  for (const corner of corners) {
    const dx = touchPoint.x - corner.x;
    const dy = touchPoint.y - corner.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= threshold) {
      return corner.name;
    }
  }

  return null;
}

/**
 * Calculate swipe velocity for gesture detection
 */
export function calculateSwipeVelocity(
  startPoint: Point,
  endPoint: Point,
  startTime: number,
  endTime: number
): { velocity: number; direction: 'left' | 'right' | 'up' | 'down' } {
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  const dt = endTime - startTime;

  const velocity = Math.sqrt(dx * dx + dy * dy) / dt;

  // Determine primary direction
  let direction: 'left' | 'right' | 'up' | 'down';
  if (Math.abs(dx) > Math.abs(dy)) {
    direction = dx > 0 ? 'right' : 'left';
  } else {
    direction = dy > 0 ? 'down' : 'up';
  }

  return { velocity, direction };
}

/**
 * Trigger haptic feedback (mobile)
 */
export function triggerHapticFeedback(type: 'light' | 'medium' | 'heavy' = 'light') {
  if ('vibrate' in navigator) {
    const duration = type === 'light' ? 10 : type === 'medium' ? 20 : 50;
    navigator.vibrate(duration);
  }
}

/**
 * Play page flip sound effect
 */
export function playFlipSound(direction: 'forward' | 'backward' = 'forward') {
  // Create audio context for page flip sound
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Page flip sound: quick frequency sweep
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(
    direction === 'forward' ? 400 : 300,
    audioContext.currentTime
  );
  oscillator.frequency.exponentialRampToValueAtTime(
    direction === 'forward' ? 200 : 150,
    audioContext.currentTime + 0.15
  );

  // Volume envelope
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.15);
}

/**
 * Calculate 3D transform for page flip
 */
export function calculatePageTransform(
  progress: number,
  direction: 'forward' | 'backward',
  config: Book3DConfig
): string {
  const rotationAngle = Easing.easeInOutQuart(progress) * 180;
  const rotation = direction === 'forward' ? rotationAngle : -rotationAngle;

  // Add slight translation for depth effect
  const translateZ = Math.sin((progress * Math.PI) / 2) * -50;
  const translateX = direction === 'forward' ? progress * -10 : progress * 10;

  return `
    perspective(${config.perspectiveDepth}px)
    rotateY(${rotation}deg)
    translateZ(${translateZ}px)
    translateX(${translateX}px)
  `;
}

/**
 * Calculate page stack offset for visible thickness
 */
export function calculateStackOffset(
  pageIndex: number,
  totalPages: number,
  thickness: number
): number {
  // Pages stack with slight offset for depth
  return pageIndex * thickness;
}

/**
 * Create bookmark ribbon element
 */
export function createBookmarkRibbon(color: string = '#e74c3c'): HTMLElement {
  const ribbon = document.createElement('div');
  ribbon.className = 'bookmark-ribbon';
  ribbon.style.cssText = `
    position: absolute;
    top: 0;
    right: 20%;
    width: 30px;
    height: 150%;
    background: ${color};
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 95%, 0 100%);
    z-index: 1;
    opacity: 0.8;
    transition: opacity 0.3s ease;
  `;

  return ribbon;
}

/**
 * Optimize performance: check if page should be rendered
 */
export function shouldRenderPage(
  pageIndex: number,
  currentPage: number,
  renderRange: number = 2
): boolean {
  // Only render pages within range of current page
  return Math.abs(pageIndex - currentPage) <= renderRange;
}

/**
 * Request animation frame with fallback
 */
export function requestAnimFrame(callback: FrameRequestCallback): number {
  return (
    window.requestAnimationFrame ||
    (window as any).webkitRequestAnimationFrame ||
    (window as any).mozRequestAnimationFrame ||
    function (callback: FrameRequestCallback) {
      return window.setTimeout(callback, 1000 / 60);
    }
  )(callback);
}

/**
 * Cancel animation frame with fallback
 */
export function cancelAnimFrame(id: number): void {
  (
    window.cancelAnimationFrame ||
    (window as any).webkitCancelAnimationFrame ||
    (window as any).mozCancelAnimationFrame ||
    window.clearTimeout
  )(id);
}

/**
 * Detect if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get simplified flip animation for reduced motion
 */
export function getReducedMotionTransform(progress: number, direction: 'forward' | 'backward'): string {
  // Simple fade and slide for reduced motion
  const translateX = direction === 'forward' ? progress * -100 : progress * 100;
  return `translateX(${translateX}%) scale(${1 - progress * 0.1})`;
}
