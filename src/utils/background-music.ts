/**
 * Background Music and Ambient Sound System
 * Procedurally generates copyright-free music and ambient sounds using Web Audio API
 */

export type MoodType = 'happy' | 'sad' | 'adventurous' | 'calm' | 'mysterious' | 'exciting';
export type AmbientType = 'forest' | 'ocean' | 'city' | 'night' | 'rain' | 'home' | 'none';
export type MusicIntensity = 'low' | 'medium' | 'high';

interface MusicConfig {
  mood: MoodType;
  tempo: number; // BPM (60-180)
  key: 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
  mode: 'major' | 'minor';
  intensity: MusicIntensity;
  layers: ('melody' | 'harmony' | 'bass' | 'percussion')[];
}

interface AmbientConfig {
  type: AmbientType;
  intensity: number; // 0-1
  variation: number; // 0-1 (randomness factor)
}

interface MusicState {
  musicEnabled: boolean;
  ambientEnabled: boolean;
  musicVolume: number; // 0-1
  ambientVolume: number; // 0-1
  currentMood: MoodType | null;
  currentAmbient: AmbientType | null;
}

/**
 * Musical note frequencies (MIDI note to Hz)
 */
const NOTE_FREQUENCIES = {
  C: [130.81, 261.63, 523.25, 1046.50],
  D: [146.83, 293.66, 587.33, 1174.66],
  E: [164.81, 329.63, 659.25, 1318.51],
  F: [174.61, 349.23, 698.46, 1396.91],
  G: [196.00, 392.00, 783.99, 1567.98],
  A: [220.00, 440.00, 880.00, 1760.00],
  B: [246.94, 493.88, 987.77, 1975.53],
};

/**
 * Scale patterns (intervals from root)
 */
const SCALES = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  pentatonicMajor: [0, 2, 4, 7, 9],
  pentatonicMinor: [0, 3, 5, 7, 10],
};

/**
 * Chord progressions
 */
const CHORD_PROGRESSIONS = {
  happy: [
    [0, 4, 7], // I (C major)
    [5, 9, 12], // IV (F major)
    [7, 11, 14], // V (G major)
    [0, 4, 7], // I
  ],
  sad: [
    [0, 3, 7], // i (C minor)
    [7, 10, 14], // v (G minor)
    [5, 8, 12], // iv (F minor)
    [0, 3, 7], // i
  ],
  adventurous: [
    [0, 4, 7], // I
    [2, 5, 9], // ii
    [7, 11, 14], // V
    [4, 7, 11], // iii
  ],
};

/**
 * Procedural Music Generator
 */
export class ProceduralMusicGenerator {
  private audioContext: AudioContext | null = null;
  private musicGainNode: GainNode | null = null;
  private ambientGainNode: GainNode | null = null;
  private currentNodes: AudioNode[] = [];
  private ambientNodes: AudioNode[] = [];
  private state: MusicState;

  constructor() {
    this.state = this.loadState();
  }

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  private getMusicGain(): GainNode {
    if (!this.musicGainNode) {
      const ctx = this.getContext();
      this.musicGainNode = ctx.createGain();
      this.musicGainNode.connect(ctx.destination);
      this.musicGainNode.gain.value = this.state.musicVolume;
    }
    return this.musicGainNode;
  }

  private getAmbientGain(): GainNode {
    if (!this.ambientGainNode) {
      const ctx = this.getContext();
      this.ambientGainNode = ctx.createGain();
      this.ambientGainNode.connect(ctx.destination);
      this.ambientGainNode.gain.value = this.state.ambientVolume;
    }
    return this.ambientGainNode;
  }

  /**
   * Get mood configuration
   */
  private getMoodConfig(mood: MoodType, intensity: MusicIntensity = 'medium'): MusicConfig {
    const configs: Record<MoodType, MusicConfig> = {
      happy: {
        mood: 'happy',
        tempo: 120,
        key: 'C',
        mode: 'major',
        intensity,
        layers: ['melody', 'harmony', 'bass'],
      },
      sad: {
        mood: 'sad',
        tempo: 60,
        key: 'A',
        mode: 'minor',
        intensity,
        layers: ['melody', 'harmony'],
      },
      adventurous: {
        mood: 'adventurous',
        tempo: 140,
        key: 'D',
        mode: 'major',
        intensity,
        layers: ['melody', 'harmony', 'bass', 'percussion'],
      },
      calm: {
        mood: 'calm',
        tempo: 70,
        key: 'F',
        mode: 'major',
        intensity,
        layers: ['melody', 'harmony'],
      },
      mysterious: {
        mood: 'mysterious',
        tempo: 90,
        key: 'E',
        mode: 'minor',
        intensity,
        layers: ['melody', 'bass'],
      },
      exciting: {
        mood: 'exciting',
        tempo: 160,
        key: 'G',
        mode: 'major',
        intensity,
        layers: ['melody', 'harmony', 'bass', 'percussion'],
      },
    };
    return configs[mood];
  }

  /**
   * Generate melody notes
   */
  private generateMelody(config: MusicConfig, duration: number = 8): number[] {
    const scale = config.mode === 'major' ? SCALES.pentatonicMajor : SCALES.pentatonicMinor;
    const baseFreq = NOTE_FREQUENCIES[config.key][2]; // Use middle octave
    const notes: number[] = [];
    const beatsPerBar = 4;
    const beatDuration = 60 / config.tempo;
    const totalBeats = Math.floor(duration / beatDuration);

    for (let i = 0; i < totalBeats; i++) {
      // Create a melodic contour (mostly stepwise motion)
      const lastInterval = i > 0 ? notes[notes.length - 1] : 0;
      let interval: number;

      if (Math.random() < 0.7) {
        // Stepwise motion (70%)
        interval = scale[Math.min(Math.floor(Math.random() * scale.length), scale.length - 1)];
      } else {
        // Leaps (30%)
        interval = scale[Math.floor(Math.random() * scale.length)];
      }

      const semitones = interval;
      const frequency = baseFreq * Math.pow(2, semitones / 12);
      notes.push(frequency);
    }

    return notes;
  }

  /**
   * Generate chord progression
   */
  private generateChords(config: MusicConfig): number[][] {
    const progression = CHORD_PROGRESSIONS[config.mood === 'happy' ? 'happy' : config.mood === 'sad' ? 'sad' : 'adventurous'];
    const baseFreq = NOTE_FREQUENCIES[config.key][1]; // Use lower octave for chords

    return progression.map(chord =>
      chord.map(interval => baseFreq * Math.pow(2, interval / 12))
    );
  }

  /**
   * Play melody layer
   */
  private playMelody(config: MusicConfig, startTime: number, duration: number) {
    const ctx = this.getContext();
    const notes = this.generateMelody(config, duration);
    const beatDuration = 60 / config.tempo;
    const gainMultiplier = config.intensity === 'low' ? 0.4 : config.intensity === 'medium' ? 0.6 : 0.8;

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Add some brightness
      filter.type = 'lowpass';
      filter.frequency.value = 2000;
      filter.Q.value = 1;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.getMusicGain());

      osc.type = config.mood === 'mysterious' ? 'triangle' : 'sine';
      osc.frequency.value = freq;

      const noteStart = startTime + (i * beatDuration);
      const noteEnd = noteStart + beatDuration * 0.8; // 80% note length (staccato)

      gain.gain.setValueAtTime(0, noteStart);
      gain.gain.linearRampToValueAtTime(0.15 * gainMultiplier, noteStart + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, noteEnd);

      osc.start(noteStart);
      osc.stop(noteEnd);

      this.currentNodes.push(osc);
    });
  }

  /**
   * Play harmony/chord layer
   */
  private playHarmony(config: MusicConfig, startTime: number, duration: number) {
    const ctx = this.getContext();
    const chords = this.generateChords(config);
    const barDuration = (60 / config.tempo) * 4; // 4 beats per bar
    const gainMultiplier = config.intensity === 'low' ? 0.3 : config.intensity === 'medium' ? 0.5 : 0.7;

    chords.forEach((chord, i) => {
      const chordStart = startTime + (i * barDuration);
      const chordEnd = chordStart + barDuration;

      chord.forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(this.getMusicGain());

        osc.type = 'triangle';
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0, chordStart);
        gain.gain.linearRampToValueAtTime(0.08 * gainMultiplier, chordStart + 0.1);
        gain.gain.setValueAtTime(0.08 * gainMultiplier, chordEnd - 0.2);
        gain.gain.exponentialRampToValueAtTime(0.01, chordEnd);

        osc.start(chordStart);
        osc.stop(chordEnd);

        this.currentNodes.push(osc);
      });
    });
  }

  /**
   * Play bass layer
   */
  private playBass(config: MusicConfig, startTime: number, duration: number) {
    const ctx = this.getContext();
    const bassFreq = NOTE_FREQUENCIES[config.key][0]; // Lowest octave
    const beatDuration = 60 / config.tempo;
    const totalBeats = Math.floor(duration / beatDuration);
    const gainMultiplier = config.intensity === 'low' ? 0.4 : config.intensity === 'medium' ? 0.6 : 0.8;

    for (let i = 0; i < totalBeats; i += 2) {
      // Play on every other beat
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(this.getMusicGain());

      osc.type = 'sawtooth';
      osc.frequency.value = bassFreq;

      const beatStart = startTime + (i * beatDuration);
      const beatEnd = beatStart + beatDuration * 0.5;

      gain.gain.setValueAtTime(0, beatStart);
      gain.gain.linearRampToValueAtTime(0.12 * gainMultiplier, beatStart + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, beatEnd);

      osc.start(beatStart);
      osc.stop(beatEnd);

      this.currentNodes.push(osc);
    }
  }

  /**
   * Play percussion layer (simple kick and hi-hat)
   */
  private playPercussion(config: MusicConfig, startTime: number, duration: number) {
    const ctx = this.getContext();
    const beatDuration = 60 / config.tempo;
    const totalBeats = Math.floor(duration / beatDuration);

    for (let i = 0; i < totalBeats; i++) {
      // Kick drum on beat 1 and 3
      if (i % 4 === 0 || i % 4 === 2) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(this.getMusicGain());

        const beatStart = startTime + (i * beatDuration);
        osc.frequency.setValueAtTime(150, beatStart);
        osc.frequency.exponentialRampToValueAtTime(40, beatStart + 0.1);
        osc.type = 'sine';

        gain.gain.setValueAtTime(0.3, beatStart);
        gain.gain.exponentialRampToValueAtTime(0.01, beatStart + 0.1);

        osc.start(beatStart);
        osc.stop(beatStart + 0.1);

        this.currentNodes.push(osc);
      }

      // Hi-hat on every beat
      if (config.intensity !== 'low') {
        const noise = ctx.createBufferSource();
        const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);

        for (let j = 0; j < data.length; j++) {
          data[j] = Math.random() * 2 - 1;
        }

        noise.buffer = noiseBuffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 7000;

        const gain = ctx.createGain();
        const beatStart = startTime + (i * beatDuration);

        gain.gain.setValueAtTime(0.08, beatStart);
        gain.gain.exponentialRampToValueAtTime(0.01, beatStart + 0.05);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.getMusicGain());

        noise.start(beatStart);

        this.currentNodes.push(noise);
      }
    }
  }

  /**
   * Start playing background music
   */
  playMusic(mood: MoodType, intensity: MusicIntensity = 'medium', loopDuration: number = 16) {
    if (!this.state.musicEnabled) return;

    const ctx = this.getContext();
    const config = this.getMoodConfig(mood, intensity);

    this.stopMusic();
    this.state.currentMood = mood;
    this.saveState();

    const playLoop = () => {
      const startTime = ctx.currentTime + 0.1;

      // Play each layer
      if (config.layers.includes('melody')) {
        this.playMelody(config, startTime, loopDuration);
      }
      if (config.layers.includes('harmony')) {
        this.playHarmony(config, startTime, loopDuration);
      }
      if (config.layers.includes('bass')) {
        this.playBass(config, startTime, loopDuration);
      }
      if (config.layers.includes('percussion')) {
        this.playPercussion(config, startTime, loopDuration);
      }

      // Schedule next loop
      if (this.state.musicEnabled && this.state.currentMood === mood) {
        setTimeout(playLoop, loopDuration * 1000 - 100); // Start next loop slightly early
      }
    };

    playLoop();
  }

  /**
   * Stop music with fade out
   */
  stopMusic(fadeTime: number = 1) {
    const ctx = this.getContext();
    const now = ctx.currentTime;

    if (this.musicGainNode) {
      this.musicGainNode.gain.setValueAtTime(this.musicGainNode.gain.value, now);
      this.musicGainNode.gain.linearRampToValueAtTime(0, now + fadeTime);
    }

    setTimeout(() => {
      this.currentNodes.forEach(node => {
        try {
          if ('stop' in node) {
            (node as OscillatorNode | AudioBufferSourceNode).stop();
          }
          node.disconnect();
        } catch (e) {
          // Node might already be stopped
        }
      });
      this.currentNodes = [];
    }, fadeTime * 1000 + 100);

    this.state.currentMood = null;
    this.saveState();
  }

  /**
   * Set music volume (with fade)
   */
  setMusicVolume(volume: number, fadeTime: number = 0.5) {
    const ctx = this.getContext();
    const gain = this.getMusicGain();

    this.state.musicVolume = Math.max(0, Math.min(1, volume));
    this.saveState();

    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(this.state.musicVolume, ctx.currentTime + fadeTime);
  }

  /**
   * Toggle music on/off
   */
  toggleMusic(): boolean {
    this.state.musicEnabled = !this.state.musicEnabled;
    this.saveState();

    if (!this.state.musicEnabled) {
      this.stopMusic();
    }

    return this.state.musicEnabled;
  }

  /**
   * Get current music state
   */
  getState(): MusicState {
    return { ...this.state };
  }

  /**
   * Save state to localStorage
   */
  private saveState() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('music-state', JSON.stringify(this.state));
    }
  }

  /**
   * Load state from localStorage
   */
  private loadState(): MusicState {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('music-state');
      if (saved) {
        return JSON.parse(saved);
      }
    }

    return {
      musicEnabled: false, // Default to off (respect user preference)
      ambientEnabled: false,
      musicVolume: 0.3, // Start quieter
      ambientVolume: 0.4,
      currentMood: null,
      currentAmbient: null,
    };
  }
}

/**
 * Ambient Sound Generator
 */
export class AmbientSoundGenerator {
  private audioContext: AudioContext | null = null;
  private ambientGainNode: GainNode | null = null;
  private currentNodes: AudioNode[] = [];
  private state: MusicState;
  private musicGenerator: ProceduralMusicGenerator;

  constructor(musicGenerator: ProceduralMusicGenerator) {
    this.musicGenerator = musicGenerator;
    this.state = musicGenerator.getState();
  }

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  private getAmbientGain(): GainNode {
    if (!this.ambientGainNode) {
      const ctx = this.getContext();
      this.ambientGainNode = ctx.createGain();
      this.ambientGainNode.connect(ctx.destination);
      this.ambientGainNode.gain.value = this.state.ambientVolume;
    }
    return this.ambientGainNode;
  }

  /**
   * Generate birdsong
   */
  private generateBirdsong(startTime: number, duration: number, intensity: number) {
    const ctx = this.getContext();
    const birdCount = Math.floor(intensity * 5) + 1;

    for (let i = 0; i < birdCount; i++) {
      const birdStart = startTime + Math.random() * duration;
      const frequencies = [800 + Math.random() * 800, 1200 + Math.random() * 800];

      frequencies.forEach((freq, j) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(this.getAmbientGain());

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, birdStart + j * 0.1);
        osc.frequency.linearRampToValueAtTime(freq * 1.2, birdStart + j * 0.1 + 0.05);

        gain.gain.setValueAtTime(0, birdStart + j * 0.1);
        gain.gain.linearRampToValueAtTime(0.1 * intensity, birdStart + j * 0.1 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.01, birdStart + j * 0.1 + 0.15);

        osc.start(birdStart + j * 0.1);
        osc.stop(birdStart + j * 0.1 + 0.15);

        this.currentNodes.push(osc);
      });
    }
  }

  /**
   * Generate rain
   */
  private generateRain(startTime: number, duration: number, intensity: number) {
    const ctx = this.getContext();
    const dropCount = Math.floor(intensity * 100);

    for (let i = 0; i < dropCount; i++) {
      const noise = ctx.createBufferSource();
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let j = 0; j < data.length; j++) {
        data[j] = (Math.random() * 2 - 1) * 0.3;
      }

      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2000 + Math.random() * 2000;
      filter.Q.value = 0.5;

      const gain = ctx.createGain();
      const dropStart = startTime + (i / dropCount) * duration;

      gain.gain.setValueAtTime(0.05 * intensity, dropStart);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.getAmbientGain());

      noise.start(dropStart);

      this.currentNodes.push(noise);
    }
  }

  /**
   * Generate wind
   */
  private generateWind(startTime: number, duration: number, intensity: number) {
    const ctx = this.getContext();

    const noise = ctx.createBufferSource();
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.2;
    }

    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 300;
    filter.Q.value = 1;

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.2;
    lfoGain.gain.value = 100;

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.15 * intensity, startTime + 2);
    gain.gain.setValueAtTime(0.15 * intensity, startTime + duration - 2);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.getAmbientGain());

    noise.start(startTime);
    lfo.start(startTime);

    this.currentNodes.push(noise, lfo);
  }

  /**
   * Generate ocean waves
   */
  private generateWaves(startTime: number, duration: number, intensity: number) {
    const ctx = this.getContext();

    // Continuous wave sound
    const noise = ctx.createBufferSource();
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }

    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.15; // Slow wave rhythm
    lfoGain.gain.value = 150;

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.2 * intensity, startTime + 3);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.getAmbientGain());

    noise.start(startTime);
    lfo.start(startTime);

    this.currentNodes.push(noise, lfo);
  }

  /**
   * Play ambient sound
   */
  playAmbient(type: AmbientType, config: AmbientConfig) {
    if (!this.state.ambientEnabled || type === 'none') return;

    const ctx = this.getContext();
    this.stopAmbient();

    const loopDuration = 10;

    const playLoop = () => {
      const startTime = ctx.currentTime + 0.1;

      switch (type) {
        case 'forest':
          this.generateBirdsong(startTime, loopDuration, config.intensity);
          this.generateWind(startTime, loopDuration, config.intensity * 0.5);
          break;
        case 'rain':
          this.generateRain(startTime, loopDuration, config.intensity);
          this.generateWind(startTime, loopDuration, config.intensity * 0.3);
          break;
        case 'ocean':
          this.generateWaves(startTime, loopDuration, config.intensity);
          break;
        case 'night':
          this.generateWind(startTime, loopDuration, config.intensity * 0.4);
          // Could add crickets, owl hoots
          break;
        case 'city':
          // Low rumble
          this.generateWind(startTime, loopDuration, config.intensity * 0.6);
          break;
        case 'home':
          // Quiet ambient
          this.generateWind(startTime, loopDuration, config.intensity * 0.2);
          break;
      }

      if (this.state.ambientEnabled && this.state.currentAmbient === type) {
        setTimeout(playLoop, loopDuration * 1000 - 100);
      }
    };

    this.state.currentAmbient = type;
    playLoop();
  }

  /**
   * Stop ambient sounds
   */
  stopAmbient(fadeTime: number = 1) {
    const ctx = this.getContext();
    const now = ctx.currentTime;

    if (this.ambientGainNode) {
      this.ambientGainNode.gain.setValueAtTime(this.ambientGainNode.gain.value, now);
      this.ambientGainNode.gain.linearRampToValueAtTime(0, now + fadeTime);
    }

    setTimeout(() => {
      this.currentNodes.forEach(node => {
        try {
          if ('stop' in node) {
            (node as OscillatorNode | AudioBufferSourceNode).stop();
          }
          node.disconnect();
        } catch (e) {
          // Node might already be stopped
        }
      });
      this.currentNodes = [];
    }, fadeTime * 1000 + 100);

    this.state.currentAmbient = null;
  }

  /**
   * Set ambient volume
   */
  setAmbientVolume(volume: number, fadeTime: number = 0.5) {
    const ctx = this.getContext();
    const gain = this.getAmbientGain();

    this.state.ambientVolume = Math.max(0, Math.min(1, volume));

    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(this.state.ambientVolume, ctx.currentTime + fadeTime);
  }

  /**
   * Toggle ambient sounds
   */
  toggleAmbient(): boolean {
    this.state.ambientEnabled = !this.state.ambientEnabled;

    if (!this.state.ambientEnabled) {
      this.stopAmbient();
    }

    return this.state.ambientEnabled;
  }
}

// Global instances
export const backgroundMusic = new ProceduralMusicGenerator();
export const ambientSounds = new AmbientSoundGenerator(backgroundMusic);
