/**
 * Confetti Celebration System
 * Creates colorful confetti animations for quiz completions and achievements
 */

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  size: number;
  shape: 'circle' | 'square' | 'triangle' | 'star';
  opacity: number;
}

export class ConfettiCelebration {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: ConfettiParticle[] = [];
  private animationFrame: number | null = null;
  private colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#FFD93D', '#6BCF7F', '#C77DFF', '#FF9F40'];

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '9999';

    this.ctx = this.canvas.getContext('2d')!;
    this.resize();

    window.addEventListener('resize', () => this.resize());
  }

  private resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private createParticle(x: number, y: number): ConfettiParticle {
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 10 + 5;
    const shapes: Array<'circle' | 'square' | 'triangle' | 'star'> = ['circle', 'square', 'triangle', 'star'];

    return {
      x,
      y,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity - Math.random() * 5,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      size: Math.random() * 8 + 4,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      opacity: 1
    };
  }

  private drawParticle(particle: ConfettiParticle) {
    this.ctx.save();
    this.ctx.translate(particle.x, particle.y);
    this.ctx.rotate(particle.rotation);
    this.ctx.globalAlpha = particle.opacity;
    this.ctx.fillStyle = particle.color;

    switch (particle.shape) {
      case 'circle':
        this.ctx.beginPath();
        this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
        break;

      case 'square':
        this.ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        break;

      case 'triangle':
        this.ctx.beginPath();
        this.ctx.moveTo(0, -particle.size);
        this.ctx.lineTo(particle.size, particle.size);
        this.ctx.lineTo(-particle.size, particle.size);
        this.ctx.closePath();
        this.ctx.fill();
        break;

      case 'star':
        this.drawStar(0, 0, 5, particle.size, particle.size / 2);
        this.ctx.fill();
        break;
    }

    this.ctx.restore();
  }

  private drawStar(cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      this.ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      this.ctx.lineTo(x, y);
      rot += step;
    }

    this.ctx.lineTo(cx, cy - outerRadius);
    this.ctx.closePath();
  }

  private updateParticles() {
    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.3; // gravity
      particle.vx *= 0.99; // air resistance
      particle.rotation += particle.rotationSpeed;
      particle.opacity -= 0.01;
    });

    // Remove dead particles
    this.particles = this.particles.filter(p => p.opacity > 0 && p.y < this.canvas.height + 50);
  }

  private animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.updateParticles();
    this.particles.forEach(particle => this.drawParticle(particle));

    if (this.particles.length > 0) {
      this.animationFrame = requestAnimationFrame(() => this.animate());
    } else {
      this.stop();
    }
  }

  /**
   * Burst confetti from a specific position (e.g., button click)
   */
  burst(x: number, y: number, count: number = 50) {
    if (!document.body.contains(this.canvas)) {
      document.body.appendChild(this.canvas);
    }

    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle(x, y));
    }

    if (!this.animationFrame) {
      this.animate();
    }
  }

  /**
   * Rain confetti from the top of the screen
   */
  rain(duration: number = 3000, particlesPerFrame: number = 3) {
    if (!document.body.contains(this.canvas)) {
      document.body.appendChild(this.canvas);
    }

    const startTime = Date.now();
    const rainInterval = setInterval(() => {
      if (Date.now() - startTime > duration) {
        clearInterval(rainInterval);
        return;
      }

      for (let i = 0; i < particlesPerFrame; i++) {
        const x = Math.random() * this.canvas.width;
        this.particles.push(this.createParticle(x, -20));
      }
    }, 100);

    if (!this.animationFrame) {
      this.animate();
    }
  }

  /**
   * Firework explosion at random positions
   */
  fireworks(count: number = 5, interval: number = 500) {
    if (!document.body.contains(this.canvas)) {
      document.body.appendChild(this.canvas);
    }

    let fired = 0;
    const fireworkInterval = setInterval(() => {
      if (fired >= count) {
        clearInterval(fireworkInterval);
        return;
      }

      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height * 0.5; // Upper half
      this.burst(x, y, 40);
      fired++;
    }, interval);

    if (!this.animationFrame) {
      this.animate();
    }
  }

  /**
   * Stop animation and clean up
   */
  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.particles = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (document.body.contains(this.canvas)) {
      document.body.removeChild(this.canvas);
    }
  }
}

// Global instance for easy access (only in browser)
export const confetti = typeof document !== 'undefined' ? new ConfettiCelebration() : null as any;
