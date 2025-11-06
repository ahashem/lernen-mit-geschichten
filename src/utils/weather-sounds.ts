/**
 * Weather Sound Effects using Web Audio API
 * Creates ambient weather sounds
 */

import type { WeatherType, WeatherIntensity } from './weather-system';

class WeatherSoundEngine {
  private audioContext: AudioContext | null = null;
  private currentNodes: (AudioNode | OscillatorNode | AudioBufferSourceNode)[] = [];
  private gainNode: GainNode | null = null;
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.enabled = localStorage.getItem('weather-sounds-enabled') !== 'false';
    }
  }

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  private getGainNode(): GainNode {
    if (!this.gainNode) {
      const ctx = this.getContext();
      this.gainNode = ctx.createGain();
      this.gainNode.connect(ctx.destination);
      this.gainNode.gain.value = 0.3; // Default volume
    }
    return this.gainNode;
  }

  /**
   * Generate rain sound
   */
  private playRainSound(intensity: WeatherIntensity, duration: number) {
    const ctx = this.getContext();
    const gain = this.getGainNode();
    const startTime = ctx.currentTime;

    const dropCount = intensity === 'light' ? 50 : intensity === 'medium' ? 100 : 200;
    const volumeMultiplier = intensity === 'light' ? 0.3 : intensity === 'medium' ? 0.5 : 0.8;

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

      const dropGain = ctx.createGain();
      const dropStart = startTime + (i / dropCount) * duration;

      dropGain.gain.setValueAtTime(0.05 * volumeMultiplier, dropStart);

      noise.connect(filter);
      filter.connect(dropGain);
      dropGain.connect(gain);

      noise.start(dropStart);

      this.currentNodes.push(noise);
    }
  }

  /**
   * Generate thunder sound
   */
  playThunder() {
    if (!this.enabled) return;

    const ctx = this.getContext();
    const gain = this.getGainNode();
    const now = ctx.currentTime;

    // Thunder rumble using noise
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(50, now + 2);

    const thunderGain = ctx.createGain();
    thunderGain.gain.setValueAtTime(0, now);
    thunderGain.gain.linearRampToValueAtTime(0.6, now + 0.1);
    thunderGain.gain.exponentialRampToValueAtTime(0.01, now + 2);

    noise.connect(filter);
    filter.connect(thunderGain);
    thunderGain.connect(gain);

    noise.start(now);

    this.currentNodes.push(noise);
  }

  /**
   * Generate wind sound
   */
  private playWindSound(intensity: WeatherIntensity, duration: number) {
    const ctx = this.getContext();
    const gain = this.getGainNode();
    const startTime = ctx.currentTime;

    const volumeMultiplier = intensity === 'light' ? 0.2 : intensity === 'medium' ? 0.4 : 0.6;

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

    // LFO for wind variation
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.3;
    lfoGain.gain.value = 100;

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0, startTime);
    windGain.gain.linearRampToValueAtTime(0.15 * volumeMultiplier, startTime + 2);
    windGain.gain.setValueAtTime(0.15 * volumeMultiplier, startTime + duration - 2);
    windGain.gain.linearRampToValueAtTime(0, startTime + duration);

    noise.connect(filter);
    filter.connect(windGain);
    windGain.connect(gain);

    noise.start(startTime);
    lfo.start(startTime);

    this.currentNodes.push(noise, lfo);
  }

  /**
   * Generate night ambience (crickets)
   */
  private playNightAmbience(duration: number) {
    const ctx = this.getContext();
    const gain = this.getGainNode();
    const startTime = ctx.currentTime;

    // Crickets chirping
    for (let i = 0; i < 10; i++) {
      const chirpStart = startTime + Math.random() * duration;

      const osc = ctx.createOscillator();
      const chirpGain = ctx.createGain();

      osc.connect(chirpGain);
      chirpGain.connect(gain);

      osc.type = 'sine';
      osc.frequency.value = 4000 + Math.random() * 2000;

      chirpGain.gain.setValueAtTime(0, chirpStart);
      chirpGain.gain.linearRampToValueAtTime(0.05, chirpStart + 0.01);
      chirpGain.gain.exponentialRampToValueAtTime(0.01, chirpStart + 0.2);

      osc.start(chirpStart);
      osc.stop(chirpStart + 0.2);

      this.currentNodes.push(osc);
    }
  }

  /**
   * Play weather sound for specific type
   */
  playWeather(type: WeatherType, intensity: WeatherIntensity = 'medium', duration: number = 10) {
    if (!this.enabled) return;

    this.stopAll();

    const loopDuration = duration;

    const playLoop = () => {
      switch (type) {
        case 'rainy':
          this.playRainSound(intensity, loopDuration);
          break;

        case 'stormy':
          this.playRainSound('heavy', loopDuration);
          this.playWindSound('heavy', loopDuration);
          // Random thunder
          setTimeout(() => this.playThunder(), Math.random() * 5000);
          setTimeout(() => this.playThunder(), 5000 + Math.random() * 5000);
          break;

        case 'windy':
          this.playWindSound(intensity, loopDuration);
          break;

        case 'snowy':
          // Snowy wind (quieter)
          this.playWindSound('light', loopDuration);
          break;

        case 'night-clear':
        case 'night-cloudy':
          this.playNightAmbience(loopDuration);
          break;

        default:
          // No ambient sound for sunny, cloudy, foggy, rainbow
          break;
      }

      // Schedule next loop
      if (this.enabled && this.currentNodes.length > 0) {
        setTimeout(playLoop, loopDuration * 1000);
      }
    };

    playLoop();
  }

  /**
   * Stop all weather sounds
   */
  stopAll(fadeTime: number = 1) {
    const ctx = this.getContext();
    const now = ctx.currentTime;

    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
      this.gainNode.gain.linearRampToValueAtTime(0, now + fadeTime);
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

      // Reset gain
      if (this.gainNode) {
        this.gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      }
    }, fadeTime * 1000 + 100);
  }

  /**
   * Set volume
   */
  setVolume(volume: number, fadeTime: number = 0.5) {
    const ctx = this.getContext();
    const gain = this.getGainNode();

    const clampedVolume = Math.max(0, Math.min(1, volume));

    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(clampedVolume, ctx.currentTime + fadeTime);
  }

  /**
   * Toggle sounds on/off
   */
  toggle(): boolean {
    this.enabled = !this.enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('weather-sounds-enabled', String(this.enabled));
    }

    if (!this.enabled) {
      this.stopAll();
    }

    return this.enabled;
  }

  /**
   * Check if enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }
}

// Global instance
export const weatherSounds = new WeatherSoundEngine();
