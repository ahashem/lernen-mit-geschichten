/**
 * Character Companion System
 * Adorable animated companions that follow the cursor and interact with the page
 */

export type CompanionState = 'idle' | 'walking' | 'running' | 'jumping' | 'celebrating' | 'sleeping' | 'curious';
export type CompanionEmotion = 'happy' | 'excited' | 'curious' | 'surprised';
export type CompanionDirection = 'left' | 'right';
export type CompanionType = 'bruno' | 'mila' | 'fritz' | 'butterfly' | 'star' | 'cloud' | 'rainbow';
export type TrailEffect = 'sparkle' | 'rainbow' | 'hearts' | 'stardust' | 'none';

interface Position {
  x: number;
  y: number;
}

interface Velocity {
  x: number;
  y: number;
}

interface CompanionSettings {
  enabled: boolean;
  type: CompanionType;
  size: 'small' | 'medium' | 'large';
  speed: 'slow' | 'normal' | 'fast';
  trail: TrailEffect;
  volume: number;
  showDialogue: boolean;
  trailDensity: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  shape: string;
}

export class CharacterCompanion {
  private container: HTMLDivElement;
  private character: HTMLDivElement;
  private dialogue: HTMLDivElement | null = null;
  private position: Position = { x: 0, y: 0 };
  private targetPosition: Position = { x: 0, y: 0 };
  private velocity: Velocity = { x: 0, y: 0 };
  private state: CompanionState = 'idle';
  private emotion: CompanionEmotion = 'happy';
  private direction: CompanionDirection = 'right';
  private lastActivityTime: number = Date.now();
  private isGrounded: boolean = false;
  private settings: CompanionSettings;
  private animationFrame: number | null = null;
  private particles: Particle[] = [];
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private language: string = 'de';

  constructor(settings: Partial<CompanionSettings> = {}) {
    this.settings = {
      enabled: true,
      type: 'bruno',
      size: 'medium',
      speed: 'normal',
      trail: 'sparkle',
      volume: 0.5,
      showDialogue: true,
      trailDensity: 3,
      ...settings
    };

    // Create canvas for particle effects
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '9998';
    this.ctx = this.canvas.getContext('2d')!;

    // Create container
    this.container = document.createElement('div');
    this.container.className = 'character-companion-container';
    this.container.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 9999;
      transition: opacity 0.3s ease;
    `;

    // Create character element
    this.character = document.createElement('div');
    this.character.className = 'character-companion';
    this.character.style.cssText = `
      position: absolute;
      pointer-events: auto;
      cursor: pointer;
      transition: transform 0.2s ease;
    `;

    this.container.appendChild(this.character);
    this.loadSettings();
    this.setupEventListeners();
    this.renderCharacter();
  }

  private loadSettings() {
    const saved = localStorage.getItem('companion-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.settings = { ...this.settings, ...parsed };
      } catch (e) {
        console.error('Failed to load companion settings', e);
      }
    }

    const savedLang = localStorage.getItem('language') || 'de';
    this.language = savedLang;
  }

  private saveSettings() {
    localStorage.setItem('companion-settings', JSON.stringify(this.settings));
  }

  private setupEventListeners() {
    // Follow mouse
    document.addEventListener('mousemove', (e) => {
      this.targetPosition = { x: e.clientX, y: e.clientY };
      this.lastActivityTime = Date.now();

      if (this.state === 'sleeping') {
        this.setState('idle');
      }
    });

    // Click companion
    this.character.addEventListener('click', (e) => {
      e.stopPropagation();
      this.onClick();
    });

    // Double click for flip
    this.character.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      this.doFlip();
    });

    // Hover over interactive elements
    document.addEventListener('mouseover', (e) => {
      const target = e.target as HTMLElement;
      if (target.matches('button, a, input, .quiz-question')) {
        this.setEmotion('excited');
        if (this.state === 'idle') {
          this.setState('curious');
        }
      }
    });

    // Scroll events
    let scrollTimeout: NodeJS.Timeout;
    window.addEventListener('scroll', () => {
      this.setState('running');
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (this.state === 'running') {
          this.setState('idle');
        }
      }, 500);
    });

    // Resize canvas
    window.addEventListener('resize', () => {
      this.resizeCanvas();
    });
  }

  private resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private renderCharacter() {
    const size = this.getSize();
    const svg = this.getCharacterSVG();

    this.character.innerHTML = svg;
    this.character.style.width = `${size}px`;
    this.character.style.height = `${size}px`;
  }

  private getSize(): number {
    const sizes = { small: 60, medium: 80, large: 100 };
    return sizes[this.settings.size];
  }

  private getCharacterSVG(): string {
    const svgs: Record<CompanionType, string> = {
      bruno: `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g class="companion-body">
            <!-- Bear body -->
            <ellipse cx="50" cy="60" rx="30" ry="35" fill="#8B6D47" />
            <!-- Bear head -->
            <circle cx="50" cy="35" r="25" fill="#A0826D" />
            <!-- Ears -->
            <circle cx="35" cy="20" r="12" fill="#8B6D47" />
            <circle cx="65" cy="20" r="12" fill="#8B6D47" />
            <!-- Eyes -->
            <circle cx="42" cy="32" r="4" fill="#000" class="companion-eye" />
            <circle cx="58" cy="32" r="4" fill="#000" class="companion-eye" />
            <!-- Nose -->
            <ellipse cx="50" cy="42" rx="6" ry="4" fill="#000" />
            <!-- Mouth -->
            <path d="M 50 42 Q 45 48 50 50 Q 55 48 50 42" fill="none" stroke="#000" stroke-width="2" class="companion-mouth"/>
          </g>
        </svg>
      `,
      mila: `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g class="companion-body">
            <!-- Owl body -->
            <ellipse cx="50" cy="60" rx="28" ry="32" fill="#D4A574" />
            <!-- Owl head -->
            <circle cx="50" cy="35" r="28" fill="#E8C4A0" />
            <!-- Eyes (large) -->
            <circle cx="40" cy="35" r="12" fill="#FFF" />
            <circle cx="60" cy="35" r="12" fill="#FFF" />
            <circle cx="40" cy="35" r="6" fill="#000" class="companion-eye" />
            <circle cx="60" cy="35" r="6" fill="#000" class="companion-eye" />
            <!-- Beak -->
            <path d="M 50 40 L 45 48 L 55 48 Z" fill="#FF8C42" />
            <!-- Wings -->
            <ellipse cx="30" cy="65" rx="12" ry="20" fill="#C4945A" class="companion-wing" />
            <ellipse cx="70" cy="65" rx="12" ry="20" fill="#C4945A" class="companion-wing" />
          </g>
        </svg>
      `,
      fritz: `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g class="companion-body">
            <!-- Fox body -->
            <ellipse cx="50" cy="65" rx="25" ry="30" fill="#FF6B35" />
            <!-- Fox head -->
            <circle cx="50" cy="38" r="22" fill="#FF8C5A" />
            <!-- Ears (pointy) -->
            <path d="M 32 30 L 28 10 L 38 28 Z" fill="#FF6B35" />
            <path d="M 68 30 L 72 10 L 62 28 Z" fill="#FF6B35" />
            <!-- Eyes -->
            <circle cx="43" cy="36" r="4" fill="#000" class="companion-eye" />
            <circle cx="57" cy="36" r="4" fill="#000" class="companion-eye" />
            <!-- Nose -->
            <circle cx="50" cy="44" r="3" fill="#000" />
            <!-- Tail -->
            <ellipse cx="30" cy="80" rx="15" ry="25" fill="#FF6B35" class="companion-tail"
                     transform="rotate(-30 30 80)" />
            <ellipse cx="30" cy="85" rx="8" ry="12" fill="#FFF" transform="rotate(-30 30 85)" />
          </g>
        </svg>
      `,
      butterfly: `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g class="companion-body">
            <!-- Body -->
            <ellipse cx="50" cy="50" rx="5" ry="20" fill="#4A4A4A" />
            <!-- Antennae -->
            <path d="M 50 32 Q 45 25 42 20" stroke="#4A4A4A" stroke-width="2" fill="none" />
            <path d="M 50 32 Q 55 25 58 20" stroke="#4A4A4A" stroke-width="2" fill="none" />
            <circle cx="42" cy="20" r="3" fill="#FF6B9D" />
            <circle cx="58" cy="20" r="3" fill="#FF6B9D" />
            <!-- Wings -->
            <ellipse cx="35" cy="40" rx="18" ry="22" fill="#FFB7CE" class="companion-wing" />
            <ellipse cx="65" cy="40" rx="18" ry="22" fill="#FFB7CE" class="companion-wing" />
            <ellipse cx="35" cy="62" rx="15" ry="18" fill="#C77DFF" class="companion-wing" />
            <ellipse cx="65" cy="62" rx="15" ry="18" fill="#C77DFF" class="companion-wing" />
            <!-- Wing patterns -->
            <circle cx="35" cy="40" r="5" fill="#FF6B9D" opacity="0.7" />
            <circle cx="65" cy="40" r="5" fill="#FF6B9D" opacity="0.7" />
          </g>
        </svg>
      `,
      star: `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g class="companion-body">
            <!-- Star shape -->
            <path d="M 50 15 L 58 40 L 85 40 L 63 56 L 72 82 L 50 65 L 28 82 L 37 56 L 15 40 L 42 40 Z"
                  fill="#FFD93D" stroke="#FFA500" stroke-width="2" />
            <!-- Face -->
            <circle cx="45" cy="45" r="3" fill="#000" class="companion-eye" />
            <circle cx="55" cy="45" r="3" fill="#000" class="companion-eye" />
            <path d="M 45 52 Q 50 56 55 52" stroke="#000" stroke-width="2" fill="none" class="companion-mouth" />
            <!-- Sparkles -->
            <circle cx="25" cy="25" r="2" fill="#FFF" class="sparkle" />
            <circle cx="75" cy="30" r="2" fill="#FFF" class="sparkle" />
            <circle cx="70" cy="70" r="2" fill="#FFF" class="sparkle" />
          </g>
        </svg>
      `,
      cloud: `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g class="companion-body">
            <!-- Cloud -->
            <circle cx="35" cy="50" r="20" fill="#E8F4FF" />
            <circle cx="50" cy="45" r="22" fill="#E8F4FF" />
            <circle cx="65" cy="50" r="18" fill="#E8F4FF" />
            <rect x="20" y="50" width="60" height="20" fill="#E8F4FF" />
            <!-- Face -->
            <circle cx="42" cy="52" r="4" fill="#5A7C9F" class="companion-eye" />
            <circle cx="58" cy="52" r="4" fill="#5A7C9F" class="companion-eye" />
            <path d="M 45 60 Q 50 64 55 60" stroke="#5A7C9F" stroke-width="2" fill="none" class="companion-mouth" />
            <!-- Rosy cheeks -->
            <circle cx="36" cy="58" r="5" fill="#FFB7CE" opacity="0.5" />
            <circle cx="64" cy="58" r="5" fill="#FFB7CE" opacity="0.5" />
          </g>
        </svg>
      `,
      rainbow: `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g class="companion-body">
            <!-- Rainbow arcs -->
            <path d="M 20 70 Q 50 20 80 70" fill="none" stroke="#FF6B6B" stroke-width="6" />
            <path d="M 20 75 Q 50 28 80 75" fill="none" stroke="#FFA500" stroke-width="6" />
            <path d="M 20 80 Q 50 36 80 80" fill="none" stroke="#FFD93D" stroke-width="6" />
            <path d="M 20 85 Q 50 44 80 85" fill="none" stroke="#6BCF7F" stroke-width="6" />
            <path d="M 20 90 Q 50 52 80 90" fill="none" stroke="#4ECDC4" stroke-width="6" />
            <path d="M 20 95 Q 50 60 80 95" fill="none" stroke="#C77DFF" stroke-width="6" />
            <!-- Face on cloud -->
            <ellipse cx="50" cy="35" rx="18" ry="15" fill="#FFF" />
            <circle cx="45" cy="34" r="3" fill="#000" class="companion-eye" />
            <circle cx="55" cy="34" r="3" fill="#000" class="companion-eye" />
            <path d="M 45 38 Q 50 41 55 38" stroke="#000" stroke-width="2" fill="none" class="companion-mouth" />
          </g>
        </svg>
      `
    };

    return svgs[this.settings.type];
  }

  private lerp(start: number, end: number, factor: number): number {
    return start + (end - start) * factor;
  }

  private getSpeedMultiplier(): number {
    const speeds = { slow: 0.03, normal: 0.05, fast: 0.08 };
    return speeds[this.settings.speed];
  }

  private update() {
    // Check for sleep
    if (Date.now() - this.lastActivityTime > 30000 && this.state !== 'sleeping') {
      this.setState('sleeping');
    }

    // Update position with lerp for smooth following
    const speed = this.getSpeedMultiplier();
    this.position.x = this.lerp(this.position.x, this.targetPosition.x, speed);
    this.position.y = this.lerp(this.position.y, this.targetPosition.y, speed);

    // Update direction based on velocity
    const dx = this.targetPosition.x - this.position.x;
    if (Math.abs(dx) > 5) {
      this.direction = dx > 0 ? 'right' : 'left';
    }

    // Update velocity
    this.velocity.x = this.targetPosition.x - this.position.x;
    this.velocity.y = this.targetPosition.y - this.position.y;

    // Update state based on velocity
    const speed_magnitude = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
    if (this.state !== 'sleeping' && this.state !== 'jumping' && this.state !== 'celebrating') {
      if (speed_magnitude > 50) {
        this.setState('running');
      } else if (speed_magnitude > 10) {
        this.setState('walking');
      } else {
        this.setState('idle');
      }
    }

    // Update DOM position
    const size = this.getSize();
    this.container.style.left = `${this.position.x - size / 2}px`;
    this.container.style.top = `${this.position.y - size / 2}px`;

    // Flip character based on direction
    this.character.style.transform = this.direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)';

    // Update particles
    this.updateParticles();

    // Create trail particles
    if (this.settings.trail !== 'none' && speed_magnitude > 5) {
      this.createTrailParticles();
    }
  }

  private createTrailParticles() {
    const colors = this.getTrailColors();
    const density = this.settings.trailDensity;

    for (let i = 0; i < density; i++) {
      const particle: Particle = {
        x: this.position.x + (Math.random() - 0.5) * 20,
        y: this.position.y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 1,
        maxLife: 60,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 2,
        shape: this.settings.trail
      };
      this.particles.push(particle);
    }
  }

  private getTrailColors(): string[] {
    const trails: Record<TrailEffect, string[]> = {
      sparkle: ['#FFD700', '#FFA500', '#FFFF00', '#FFF'],
      rainbow: ['#FF6B6B', '#FFA500', '#FFD93D', '#6BCF7F', '#4ECDC4', '#C77DFF'],
      hearts: ['#FF6B9D', '#FFB7CE', '#FF1493'],
      stardust: ['#9D4EDD', '#C77DFF', '#E0AAFF', '#FFF'],
      none: []
    };
    return trails[this.settings.trail];
  }

  private updateParticles() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life++;

      if (p.life > p.maxLife) return false;

      const alpha = 1 - p.life / p.maxLife;
      this.ctx.globalAlpha = alpha;
      this.ctx.fillStyle = p.color;

      if (p.shape === 'hearts') {
        this.drawHeart(p.x, p.y, p.size);
      } else if (p.shape === 'sparkle' || p.shape === 'stardust') {
        this.drawStar(p.x, p.y, p.size);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      }

      return true;
    });
  }

  private drawHeart(x: number, y: number, size: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y + size / 4);
    this.ctx.bezierCurveTo(x, y, x - size / 2, y - size / 2, x - size, y + size / 4);
    this.ctx.bezierCurveTo(x - size, y + size, x, y + size * 1.5, x, y + size * 1.5);
    this.ctx.bezierCurveTo(x, y + size * 1.5, x + size, y + size, x + size, y + size / 4);
    this.ctx.bezierCurveTo(x + size / 2, y - size / 2, x, y, x, y + size / 4);
    this.ctx.fill();
  }

  private drawStar(x: number, y: number, size: number) {
    const spikes = 5;
    const outerRadius = size;
    const innerRadius = size / 2;

    this.ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes - Math.PI / 2;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      if (i === 0) this.ctx.moveTo(px, py);
      else this.ctx.lineTo(px, py);
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

  private setState(newState: CompanionState) {
    if (this.state === newState) return;

    this.state = newState;
    this.character.setAttribute('data-state', newState);

    // Apply CSS animations based on state
    this.character.style.animation = this.getStateAnimation();
  }

  private setEmotion(newEmotion: CompanionEmotion) {
    this.emotion = newEmotion;
    this.character.setAttribute('data-emotion', newEmotion);
  }

  private getStateAnimation(): string {
    const animations: Record<CompanionState, string> = {
      idle: 'companion-idle 2s ease-in-out infinite',
      walking: 'companion-walk 0.6s steps(2) infinite',
      running: 'companion-run 0.4s steps(2) infinite',
      jumping: 'companion-jump 0.8s ease-out',
      celebrating: 'companion-celebrate 1s ease-in-out',
      sleeping: 'companion-sleep 3s ease-in-out infinite',
      curious: 'companion-curious 1s ease-in-out infinite'
    };
    return animations[this.state];
  }

  private onClick() {
    this.lastActivityTime = Date.now();
    const phrases = this.getPhrases();
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    this.say(phrase);

    // Mini celebrate animation
    this.character.style.transform += ' scale(1.2)';
    setTimeout(() => {
      this.character.style.transform = this.direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)';
    }, 200);
  }

  private doFlip() {
    this.setState('jumping');
    this.character.style.animation = 'companion-flip 0.6s ease-in-out';
    setTimeout(() => {
      this.setState('idle');
    }, 600);
  }

  private getPhrases(): string[] {
    const phrases: Record<string, string[]> = {
      de: ['Hallo!', 'Super!', 'Weiter so!', 'Toll gemacht!', 'Du schaffst das!', 'Juhu!'],
      ar: ['مرحبا!', 'رائع!', 'استمر!', 'أحسنت!', 'يمكنك فعلها!', 'يا هلا!'],
      en: ['Hello!', 'Great!', 'Keep going!', 'Well done!', 'You can do it!', 'Yay!'],
      tr: ['Merhaba!', 'Harika!', 'Devam et!', 'Aferin!', 'Başarabilirsin!', 'Yaşa!'],
      ur: ['ہیلو!', 'شاندار!', 'جاری رکھو!', 'بہت اچھا!', 'تم کر سکتے ہو!', 'واہ!']
    };
    return phrases[this.language] || phrases.de;
  }

  say(text: string, duration: number = 2000) {
    if (!this.settings.showDialogue) return;

    // Create or update dialogue bubble
    if (!this.dialogue) {
      this.dialogue = document.createElement('div');
      this.dialogue.className = 'companion-dialogue';
      this.dialogue.style.cssText = `
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%) translateY(-10px);
        background: white;
        padding: 8px 12px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        font-size: 14px;
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
      `;

      // Add speech bubble arrow
      const arrow = document.createElement('div');
      arrow.style.cssText = `
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 8px solid white;
      `;
      this.dialogue.appendChild(arrow);

      this.container.appendChild(this.dialogue);
    }

    // Update text (excluding arrow)
    const textNode = this.dialogue.childNodes[0] || document.createTextNode('');
    textNode.textContent = text;
    if (this.dialogue.childNodes.length === 0) {
      this.dialogue.insertBefore(textNode, this.dialogue.firstChild);
    }

    // Show dialogue
    setTimeout(() => {
      if (this.dialogue) {
        this.dialogue.style.opacity = '1';
        this.dialogue.style.transform = 'translateX(-50%) translateY(0)';
      }
    }, 10);

    // Hide after duration
    setTimeout(() => {
      if (this.dialogue) {
        this.dialogue.style.opacity = '0';
        this.dialogue.style.transform = 'translateX(-50%) translateY(-10px)';
      }
    }, duration);
  }

  celebrate() {
    this.setState('celebrating');
    this.setEmotion('excited');

    // Create celebration particles
    for (let i = 0; i < 30; i++) {
      const angle = (Math.PI * 2 * i) / 30;
      const velocity = 5 + Math.random() * 3;
      const particle: Particle = {
        x: this.position.x,
        y: this.position.y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 3,
        life: 0,
        maxLife: 80,
        color: ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4'][Math.floor(Math.random() * 4)],
        size: Math.random() * 8 + 4,
        shape: 'sparkle'
      };
      this.particles.push(particle);
    }

    setTimeout(() => {
      if (this.state === 'celebrating') {
        this.setState('idle');
        this.setEmotion('happy');
      }
    }, 1000);
  }

  moveTo(position: Position) {
    this.targetPosition = position;
  }

  start() {
    if (!this.settings.enabled) return;

    // Initialize position
    this.position = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.targetPosition = { ...this.position };

    // Add to DOM
    document.body.appendChild(this.canvas);
    document.body.appendChild(this.container);

    // Resize canvas
    this.resizeCanvas();

    // Start animation loop
    const animate = () => {
      this.update();
      this.animationFrame = requestAnimationFrame(animate);
    };
    animate();
  }

  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    if (this.container.parentNode) {
      document.body.removeChild(this.container);
    }
    if (this.canvas.parentNode) {
      document.body.removeChild(this.canvas);
    }
  }

  updateSettings(newSettings: Partial<CompanionSettings>) {
    const wasEnabled = this.settings.enabled;
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();

    if (newSettings.type) {
      this.renderCharacter();
    }

    if (newSettings.enabled !== undefined) {
      if (newSettings.enabled && !wasEnabled) {
        this.start();
      } else if (!newSettings.enabled && wasEnabled) {
        this.stop();
      }
    }
  }

  getSettings(): CompanionSettings {
    return { ...this.settings };
  }
}

// Global instance
let globalCompanion: CharacterCompanion | null = null;

export function getCompanion(): CharacterCompanion {
  if (!globalCompanion) {
    globalCompanion = new CharacterCompanion();
  }
  return globalCompanion;
}

export function initCompanion(settings?: Partial<CompanionSettings>) {
  const companion = new CharacterCompanion(settings);
  companion.start();
  globalCompanion = companion;
  return companion;
}
