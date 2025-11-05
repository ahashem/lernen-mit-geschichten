/**
 * Story Animations Library
 * Pre-built CSS animation presets for interactive story elements
 */

import type { AnimationType } from '../utils/story-interactions';

export interface AnimationConfig {
  name: string;
  duration: string;
  timingFunction: string;
  iterationCount: number | 'infinite';
  fillMode: 'none' | 'forwards' | 'backwards' | 'both';
}

export const AnimationPresets: Record<AnimationType, AnimationConfig> = {
  bounce: {
    name: 'bounce',
    duration: '0.6s',
    timingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    iterationCount: 1,
    fillMode: 'both',
  },
  wiggle: {
    name: 'wiggle',
    duration: '0.5s',
    timingFunction: 'ease-in-out',
    iterationCount: 2,
    fillMode: 'both',
  },
  shake: {
    name: 'shake',
    duration: '0.4s',
    timingFunction: 'ease-in-out',
    iterationCount: 1,
    fillMode: 'both',
  },
  spin: {
    name: 'spin',
    duration: '0.8s',
    timingFunction: 'ease-in-out',
    iterationCount: 1,
    fillMode: 'both',
  },
  float: {
    name: 'float',
    duration: '3s',
    timingFunction: 'ease-in-out',
    iterationCount: 'infinite',
    fillMode: 'both',
  },
  drift: {
    name: 'drift',
    duration: '5s',
    timingFunction: 'linear',
    iterationCount: 'infinite',
    fillMode: 'both',
  },
  sway: {
    name: 'sway',
    duration: '2s',
    timingFunction: 'ease-in-out',
    iterationCount: 'infinite',
    fillMode: 'both',
  },
  pulse: {
    name: 'pulse',
    duration: '1.5s',
    timingFunction: 'ease-in-out',
    iterationCount: 'infinite',
    fillMode: 'both',
  },
  glow: {
    name: 'glow',
    duration: '2s',
    timingFunction: 'ease-in-out',
    iterationCount: 'infinite',
    fillMode: 'both',
  },
  shimmer: {
    name: 'shimmer',
    duration: '2s',
    timingFunction: 'linear',
    iterationCount: 'infinite',
    fillMode: 'both',
  },
  'fade-in': {
    name: 'fade-in',
    duration: '0.6s',
    timingFunction: 'ease-in',
    iterationCount: 1,
    fillMode: 'both',
  },
  'fade-out': {
    name: 'fade-out',
    duration: '0.6s',
    timingFunction: 'ease-out',
    iterationCount: 1,
    fillMode: 'both',
  },
  slide: {
    name: 'slide',
    duration: '0.8s',
    timingFunction: 'ease-out',
    iterationCount: 1,
    fillMode: 'both',
  },
  zoom: {
    name: 'zoom',
    duration: '0.5s',
    timingFunction: 'ease-out',
    iterationCount: 1,
    fillMode: 'both',
  },
  flutter: {
    name: 'flutter',
    duration: '0.8s',
    timingFunction: 'ease-in-out',
    iterationCount: 3,
    fillMode: 'both',
  },
  path: {
    name: 'path',
    duration: '3s',
    timingFunction: 'ease-in-out',
    iterationCount: 1,
    fillMode: 'both',
  },
};

/**
 * Apply animation to an element
 */
export function applyAnimation(
  element: HTMLElement,
  animationType: AnimationType,
  customDuration?: string
): Promise<void> {
  return new Promise(resolve => {
    const config = AnimationPresets[animationType];
    const className = `animate-${config.name}`;

    element.classList.add(className);

    if (customDuration) {
      element.style.animationDuration = customDuration;
    }

    const handleAnimationEnd = () => {
      if (config.iterationCount !== 'infinite') {
        element.classList.remove(className);
        element.style.animationDuration = '';
      }
      element.removeEventListener('animationend', handleAnimationEnd);
      resolve();
    };

    if (config.iterationCount === 'infinite') {
      resolve(); // Don't wait for infinite animations
    } else {
      element.addEventListener('animationend', handleAnimationEnd);
    }
  });
}

/**
 * Remove animation from element
 */
export function stopAnimation(element: HTMLElement, animationType: AnimationType) {
  const config = AnimationPresets[animationType];
  const className = `animate-${config.name}`;
  element.classList.remove(className);
  element.style.animationDuration = '';
}

/**
 * Generate CSS keyframes for all animations
 */
export function generateAnimationCSS(): string {
  return `
/* Bounce Animation */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

/* Wiggle Animation */
@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}

/* Shake Animation */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

/* Spin Animation */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Float Animation */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
}

/* Drift Animation */
@keyframes drift {
  0% { transform: translateX(-100vw); }
  100% { transform: translateX(100vw); }
}

/* Sway Animation */
@keyframes sway {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(3deg); }
}

/* Pulse Animation */
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.9; }
}

/* Glow Animation */
@keyframes glow {
  0%, 100% {
    filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5));
  }
  50% {
    filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.9));
  }
}

/* Shimmer Animation */
@keyframes shimmer {
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Fade In Animation */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Fade Out Animation */
@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* Slide Animation */
@keyframes slide {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Zoom Animation */
@keyframes zoom {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Flutter Animation */
@keyframes flutter {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-10px) rotate(-5deg); }
  50% { transform: translateY(0) rotate(0deg); }
  75% { transform: translateY(-10px) rotate(5deg); }
}

/* Path Animation (Bezier curve example) */
@keyframes path {
  0% {
    offset-distance: 0%;
  }
  100% {
    offset-distance: 100%;
  }
}

/* Animation Classes */
.animate-bounce { animation: bounce var(--duration, 0.6s) cubic-bezier(0.68, -0.55, 0.265, 1.55); }
.animate-wiggle { animation: wiggle var(--duration, 0.5s) ease-in-out 2; }
.animate-shake { animation: shake var(--duration, 0.4s) ease-in-out; }
.animate-spin { animation: spin var(--duration, 0.8s) ease-in-out; }
.animate-float { animation: float var(--duration, 3s) ease-in-out infinite; }
.animate-drift { animation: drift var(--duration, 5s) linear infinite; }
.animate-sway { animation: sway var(--duration, 2s) ease-in-out infinite; }
.animate-pulse { animation: pulse var(--duration, 1.5s) ease-in-out infinite; }
.animate-glow { animation: glow var(--duration, 2s) ease-in-out infinite; }
.animate-shimmer { animation: shimmer var(--duration, 2s) linear infinite; }
.animate-fade-in { animation: fade-in var(--duration, 0.6s) ease-in forwards; }
.animate-fade-out { animation: fade-out var(--duration, 0.6s) ease-out forwards; }
.animate-slide { animation: slide var(--duration, 0.8s) ease-out forwards; }
.animate-zoom { animation: zoom var(--duration, 0.5s) ease-out forwards; }
.animate-flutter { animation: flutter var(--duration, 0.8s) ease-in-out 3; }
.animate-path { animation: path var(--duration, 3s) ease-in-out forwards; }

/* Interaction Feedback */
.interactive-element {
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.interactive-element:hover {
  transform: scale(1.05);
  filter: brightness(1.1);
}

.interactive-element:active {
  transform: scale(0.95);
}

.interactive-element.clicked {
  animation: bounce 0.4s ease;
}

/* Glow effect for interactive elements */
.interactive-glow {
  position: relative;
}

.interactive-glow::after {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border-radius: inherit;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.interactive-glow:hover::after {
  opacity: 1;
}

/* Shimmer overlay for collectibles */
.shimmer-overlay {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.5) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
}

/* Easter egg hidden state */
.easter-egg {
  opacity: 0.1;
  transition: opacity 0.3s ease;
}

.easter-egg:hover {
  opacity: 0.3;
}

.easter-egg.discovered {
  opacity: 1;
  animation: zoom 0.5s ease-out, glow 2s ease-in-out infinite;
}

/* Confetti animation for discoveries */
@keyframes confetti-fall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

.confetti {
  position: fixed;
  width: 10px;
  height: 10px;
  background: var(--confetti-color, #FFD700);
  animation: confetti-fall 3s linear forwards;
  pointer-events: none;
  z-index: 9999;
}
`;
}

/**
 * Path-based animation using SVG or offset-path
 */
export function animateAlongPath(
  element: HTMLElement,
  pathData: string,
  duration: number = 3000
): Promise<void> {
  return new Promise(resolve => {
    // Use CSS offset-path for path-based animation
    element.style.offsetPath = `path('${pathData}')`;
    element.style.offsetRotate = 'auto';

    applyAnimation(element, 'path', `${duration}ms`).then(() => {
      element.style.offsetPath = '';
      element.style.offsetRotate = '';
      resolve();
    });
  });
}

/**
 * Create confetti effect
 */
export function createConfetti(targetElement: HTMLElement, count: number = 30) {
  const colors = ['#FFD700', '#FF9F40', '#FFD93D', '#6BCF7F', '#4169E1', '#E57373'];
  const rect = targetElement.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = `${centerX}px`;
    confetti.style.top = `${centerY}px`;
    confetti.style.setProperty('--confetti-color', colors[Math.floor(Math.random() * colors.length)]);
    confetti.style.animationDelay = `${Math.random() * 0.3}s`;
    confetti.style.transform = `translateX(${(Math.random() - 0.5) * 200}px)`;

    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 3000);
  }
}

/**
 * Haptic feedback (mobile)
 */
export function triggerHaptic(type: 'light' | 'medium' | 'heavy' = 'light') {
  if ('vibrate' in navigator) {
    const duration = type === 'light' ? 10 : type === 'medium' ? 20 : 50;
    navigator.vibrate(duration);
  }
}
