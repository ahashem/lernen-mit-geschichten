/**
 * XP Particle Effects System
 * Creates floating XP numbers and particle effects when gaining XP
 */

export interface ParticleOptions {
  x: number;
  y: number;
  amount: number;
  color?: string;
  icon?: string;
}

export class XPParticleSystem {
  private container: HTMLElement | null = null;

  constructor(containerId: string = 'xp-particles-container') {
    // Create container if it doesn't exist
    if (typeof window !== 'undefined') {
      this.container = document.getElementById(containerId);
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.id = containerId;
        this.container.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9998;
        `;
        document.body.appendChild(this.container);
      }
    }
  }

  /**
   * Show floating XP gain
   */
  showXPGain(options: ParticleOptions): void {
    if (!this.container) return;

    const particle = document.createElement('div');
    particle.className = 'xp-particle';
    particle.innerHTML = `
      <span class="xp-icon">${options.icon || '✨'}</span>
      <span class="xp-amount">+${options.amount} XP</span>
    `;

    // Position
    particle.style.left = `${options.x}px`;
    particle.style.top = `${options.y}px`;
    particle.style.color = options.color || '#FFD700';

    // Styles
    Object.assign(particle.style, {
      position: 'absolute',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      animation: 'xpFloat 2s ease-out forwards',
      zIndex: '9999',
    });

    this.container.appendChild(particle);

    // Remove after animation
    setTimeout(() => {
      if (this.container && particle.parentNode === this.container) {
        this.container.removeChild(particle);
      }
    }, 2000);

    // Create smaller particles
    this.createBurstParticles(options.x, options.y, options.color);
  }

  /**
   * Create burst particles around the XP gain
   */
  private createBurstParticles(x: number, y: number, color: string = '#FFD700'): void {
    if (!this.container) return;

    const particleCount = 8;

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = 30 + Math.random() * 20;
      const targetX = x + Math.cos(angle) * distance;
      const targetY = y + Math.sin(angle) * distance;

      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: 8px;
        height: 8px;
        background: ${color};
        border-radius: 50%;
        box-shadow: 0 0 10px ${color};
        animation: burst 0.8s ease-out forwards;
        --target-x: ${targetX - x}px;
        --target-y: ${targetY - y}px;
      `;

      this.container.appendChild(particle);

      setTimeout(() => {
        if (this.container && particle.parentNode === this.container) {
          this.container.removeChild(particle);
        }
      }, 800);
    }
  }

  /**
   * Show level up effect
   */
  showLevelUp(x: number, y: number): void {
    if (!this.container) return;

    const effect = document.createElement('div');
    effect.innerHTML = '⭐ LEVEL UP! ⭐';

    Object.assign(effect.style, {
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#FFD700',
      textShadow: '0 0 20px #FFD700',
      animation: 'levelUpPulse 1.5s ease-out forwards',
      zIndex: '9999',
    });

    this.container.appendChild(effect);

    // Create ring effect
    this.createRingEffect(x, y);

    setTimeout(() => {
      if (this.container && effect.parentNode === this.container) {
        this.container.removeChild(effect);
      }
    }, 1500);
  }

  /**
   * Create expanding ring effect
   */
  private createRingEffect(x: number, y: number): void {
    if (!this.container) return;

    const ring = document.createElement('div');
    Object.assign(ring.style, {
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      width: '0px',
      height: '0px',
      border: '4px solid #FFD700',
      borderRadius: '50%',
      animation: 'ringExpand 1s ease-out forwards',
      transform: 'translate(-50%, -50%)',
    });

    this.container.appendChild(ring);

    setTimeout(() => {
      if (this.container && ring.parentNode === this.container) {
        this.container.removeChild(ring);
      }
    }, 1000);
  }

  /**
   * Show skill unlock effect
   */
  showSkillUnlock(x: number, y: number, skillName: string): void {
    if (!this.container) return;

    const effect = document.createElement('div');
    effect.innerHTML = `
      <div style="font-size: 2rem; margin-bottom: 0.5rem;">🌟</div>
      <div style="font-size: 1.2rem;">Skill Unlocked!</div>
      <div style="font-size: 1rem; opacity: 0.9;">${skillName}</div>
    `;

    Object.assign(effect.style, {
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      color: '#667eea',
      textShadow: '0 0 15px #667eea',
      textAlign: 'center',
      animation: 'skillUnlock 2s ease-out forwards',
      zIndex: '9999',
      fontWeight: 'bold',
    });

    this.container.appendChild(effect);

    setTimeout(() => {
      if (this.container && effect.parentNode === this.container) {
        this.container.removeChild(effect);
      }
    }, 2000);
  }

  /**
   * Inject CSS animations
   */
  injectStyles(): void {
    if (typeof document === 'undefined') return;

    const styleId = 'xp-particles-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes xpFloat {
        from {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
        to {
          transform: translateY(-100px) scale(1.3);
          opacity: 0;
        }
      }

      @keyframes burst {
        from {
          transform: translate(0, 0) scale(1);
          opacity: 1;
        }
        to {
          transform: translate(var(--target-x), var(--target-y)) scale(0);
          opacity: 0;
        }
      }

      @keyframes levelUpPulse {
        0% {
          transform: translate(-50%, -50%) scale(0.5);
          opacity: 0;
        }
        50% {
          transform: translate(-50%, -50%) scale(1.2);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -100px) scale(1);
          opacity: 0;
        }
      }

      @keyframes ringExpand {
        from {
          width: 0px;
          height: 0px;
          opacity: 1;
        }
        to {
          width: 200px;
          height: 200px;
          opacity: 0;
        }
      }

      @keyframes skillUnlock {
        0% {
          transform: translate(-50%, -50%) scale(0.5);
          opacity: 0;
        }
        30% {
          transform: translate(-50%, -50%) scale(1.1);
          opacity: 1;
        }
        70% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -80px) scale(0.9);
          opacity: 0;
        }
      }
    `;

    document.head.appendChild(style);
  }
}

// Create global instance
export const xpParticles = typeof window !== 'undefined' ? new XPParticleSystem() : null;

// Inject styles on load
if (typeof window !== 'undefined') {
  xpParticles?.injectStyles();
}
