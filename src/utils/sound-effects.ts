/**
 * Sound Effects System using Web Audio API
 * Creates fun, kid-friendly sound effects for interactions
 */

class SoundEffectsEngine {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    // Initialize on first user interaction (browser requirement)
    if (typeof window !== 'undefined') {
      this.enabled = localStorage.getItem('sound-effects-enabled') !== 'false';
    }
  }

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  /**
   * Play a correct answer sound (happy chime)
   */
  playCorrect() {
    if (!this.enabled) return;

    const ctx = this.getContext();
    const now = ctx.currentTime;

    // Create a cheerful ascending arpeggio
    const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      const startTime = now + (i * 0.1);
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.2);
    });
  }

  /**
   * Play an incorrect answer sound (gentle low tone)
   */
  playIncorrect() {
    if (!this.enabled) return;

    const ctx = this.getContext();
    const now = ctx.currentTime;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(200, now);
    oscillator.frequency.exponentialRampToValueAtTime(150, now + 0.3);
    oscillator.type = 'triangle';

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    oscillator.start(now);
    oscillator.stop(now + 0.3);
  }

  /**
   * Play quiz completion celebration sound
   */
  playCompletion() {
    if (!this.enabled) return;

    const ctx = this.getContext();
    const now = ctx.currentTime;

    // Victory fanfare: C-E-G-C progression with harmony
    const chords = [
      [261.63, 329.63, 392.00], // C major
      [329.63, 415.30, 493.88], // E major
      [392.00, 493.88, 587.33], // G major
      [523.25, 659.25, 783.99]  // C major (octave up)
    ];

    chords.forEach((chord, i) => {
      chord.forEach(freq => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'sine';

        const startTime = now + (i * 0.15);
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.3);
      });
    });
  }

  /**
   * Play a page turn sound
   */
  playPageTurn() {
    if (!this.enabled) return;

    const ctx = this.getContext();
    const now = ctx.currentTime;

    // Whoosh sound using filtered white noise
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.1, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.3);
  }

  /**
   * Play a click/tap sound
   */
  playClick() {
    if (!this.enabled) return;

    const ctx = this.getContext();
    const now = ctx.currentTime;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    oscillator.start(now);
    oscillator.stop(now + 0.05);
  }

  /**
   * Play voice recognition success sound (magical sparkle)
   */
  playVoiceSuccess() {
    if (!this.enabled) return;

    const ctx = this.getContext();
    const now = ctx.currentTime;

    // Magical ascending chime
    const frequencies = [600, 800, 1000, 1200, 1400];

    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      const startTime = now + (i * 0.05);
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.25, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.15);
    });
  }

  /**
   * Play achievement unlock sound
   */
  playAchievement() {
    if (!this.enabled) return;

    const ctx = this.getContext();
    const now = ctx.currentTime;

    // Sparkle sound: ascending frequencies with vibrato
    const frequencies = [800, 1000, 1200, 1600];

    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const gainNode = ctx.createGain();

      lfo.frequency.value = 10; // Vibrato speed
      lfoGain.gain.value = 10; // Vibrato depth

      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      const startTime = now + (i * 0.08);
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

      lfo.start(startTime);
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.4);
      lfo.stop(startTime + 0.4);
    });
  }

  /**
   * Toggle sound effects on/off
   */
  toggle() {
    this.enabled = !this.enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sound-effects-enabled', String(this.enabled));
    }
    return this.enabled;
  }

  /**
   * Check if sound effects are enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Play bounce sound (character/object bounce)
   */
  playBounce() {
    if (!this.enabled) return;

    const ctx = this.getContext();
    const now = ctx.currentTime;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(400, now);
    oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.2);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    oscillator.start(now);
    oscillator.stop(now + 0.2);
  }

  /**
   * Play pop sound (object appears)
   */
  playPop() {
    if (!this.enabled) return;

    const ctx = this.getContext();
    const now = ctx.currentTime;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(800, now);
    oscillator.frequency.exponentialRampToValueAtTime(300, now + 0.1);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.25, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    oscillator.start(now);
    oscillator.stop(now + 0.1);
  }

  /**
   * Play whoosh sound (fast movement)
   */
  playWhoosh() {
    if (!this.enabled) return;

    const ctx = this.getContext();
    const now = ctx.currentTime;

    // Whoosh using white noise
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2000, now);
    filter.frequency.exponentialRampToValueAtTime(500, now + 0.4);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.4);
  }

  /**
   * Play character wave sound (friendly greeting)
   */
  playCharacterWave() {
    if (!this.enabled) return;

    const ctx = this.getContext();
    const now = ctx.currentTime;

    // Friendly two-note chime
    [600, 800].forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      const startTime = now + (i * 0.1);
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.25);
    });
  }

  /**
   * Play character jump sound
   */
  playCharacterJump() {
    if (!this.enabled) return;

    const ctx = this.getContext();
    const now = ctx.currentTime;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(300, now);
    oscillator.frequency.linearRampToValueAtTime(600, now + 0.15);
    oscillator.type = 'square';

    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    oscillator.start(now);
    oscillator.stop(now + 0.15);
  }

  /**
   * Play character dance sound
   */
  playCharacterDance() {
    if (!this.enabled) return;

    const ctx = this.getContext();
    const now = ctx.currentTime;

    // Playful melody
    const melody = [400, 500, 600, 500];

    melody.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      const startTime = now + (i * 0.15);
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.14);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.14);
    });
  }

  /**
   * Play bird chirp sound
   */
  playBirdChirp() {
    if (!this.enabled) return;

    const ctx = this.getContext();
    const now = ctx.currentTime;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(2000, now);
    oscillator.frequency.exponentialRampToValueAtTime(3000, now + 0.05);
    oscillator.frequency.exponentialRampToValueAtTime(2500, now + 0.1);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    oscillator.start(now);
    oscillator.stop(now + 0.1);
  }

  /**
   * Play owl hoot sound
   */
  playOwlHoot() {
    if (!this.enabled) return;

    const ctx = this.getContext();
    const now = ctx.currentTime;

    // Two-hoot pattern
    [0, 0.3].forEach(delay => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = 400;
      oscillator.type = 'sine';

      const startTime = now + delay;
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.25, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.2);
    });
  }

  /**
   * Play magic sparkle sound
   */
  playMagicSparkle() {
    if (!this.enabled) return;

    const ctx = this.getContext();
    const now = ctx.currentTime;

    // Ascending sparkle
    const frequencies = [800, 1000, 1200, 1400, 1600];

    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      const startTime = now + (i * 0.04);
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.12);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.12);
    });
  }

  /**
   * Play discovery sound (found something!)
   */
  playDiscovery() {
    if (!this.enabled) return;

    const ctx = this.getContext();
    const now = ctx.currentTime;

    // Ascending fanfare
    const notes = [523.25, 659.25, 783.99]; // C-E-G

    notes.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      const startTime = now + (i * 0.12);
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.25, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.3);
    });
  }

  /**
   * Play by name (for dynamic sound triggering)
   */
  play(soundName: string) {
    const soundMap: Record<string, () => void> = {
      'bounce': () => this.playBounce(),
      'pop': () => this.playPop(),
      'whoosh': () => this.playWhoosh(),
      'character-wave': () => this.playCharacterWave(),
      'character-jump': () => this.playCharacterJump(),
      'character-dance': () => this.playCharacterDance(),
      'bird-chirp': () => this.playBirdChirp(),
      'owl-hoot': () => this.playOwlHoot(),
      'magic-sparkle': () => this.playMagicSparkle(),
      'discovery': () => this.playDiscovery(),
      'click': () => this.playClick(),
      'correct': () => this.playCorrect(),
      'incorrect': () => this.playIncorrect(),
      'achievement': () => this.playAchievement(),
    };

    const soundFn = soundMap[soundName];
    if (soundFn) {
      soundFn();
    }
  }
}

// Global instance
export const soundEffects = new SoundEffectsEngine();
