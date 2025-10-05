export interface NarrationOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  onWordHighlight?: (word: string, charIndex: number) => void;
  onEnd?: () => void;
  onStart?: () => void;
}

export class StoryNarrator {
  private synth: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isPaused: boolean = false;

  constructor(private locale: string = 'de-DE') {
    if (typeof window !== 'undefined') {
      this.synth = window.speechSynthesis;
    }
  }

  speak(text: string, options: NarrationOptions = {}) {
    if (!this.synth) return;

    this.stop();

    this.currentUtterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance.lang = this.locale;
    this.currentUtterance.rate = options.rate ?? 0.85; // Slower for children
    this.currentUtterance.pitch = options.pitch ?? 1.1; // Slightly higher
    this.currentUtterance.volume = options.volume ?? 0.8;

    // Word boundary event for highlighting
    if (options.onWordHighlight) {
      this.currentUtterance.addEventListener('boundary', event => {
        if (event.name === 'word') {
          const word = text.slice(event.charIndex, event.charIndex + (event.charLength || 0));
          options.onWordHighlight?.(word, event.charIndex);
        }
      });
    }

    if (options.onEnd) {
      this.currentUtterance.addEventListener('end', () => {
        options.onEnd?.();
      });
    }

    if (options.onStart) {
      this.currentUtterance.addEventListener('start', () => {
        options.onStart?.();
      });
    }

    this.isPaused = false;
    this.synth.speak(this.currentUtterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
      this.isPaused = false;
    }
  }

  pause() {
    if (this.synth && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
    }
  }

  resume() {
    if (this.synth && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
    }
  }

  togglePlayPause() {
    if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  isPlaying(): boolean {
    return this.synth?.speaking && !this.isPaused;
  }

  isSpeaking(): boolean {
    return this.synth?.speaking || false;
  }

  getVoices(language?: string): SpeechSynthesisVoice[] {
    if (!this.synth) return [];

    const voices = this.synth.getVoices();
    if (language) {
      return voices.filter(voice => voice.lang.startsWith(language));
    }
    return voices;
  }

  setVoice(voiceName: string) {
    if (!this.currentUtterance) return;

    const voices = this.getVoices();
    const voice = voices.find(v => v.name === voiceName);
    if (voice) {
      this.currentUtterance.voice = voice;
    }
  }
}

// Helper to get locale code for TTS
export function getTTSLocale(locale: string): string {
  const localeMap: Record<string, string> = {
    de: 'de-DE',
    ar: 'ar-SA',
    en: 'en-US',
    tr: 'tr-TR',
    ur: 'ur-PK',
  };
  return localeMap[locale] || 'de-DE';
}

// Helper to split text into sentences for better pacing
export function splitIntoSentences(text: string): string[] {
  return text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

// Helper to estimate reading time based on word count
export function estimateReadingTime(text: string, wordsPerMinute: number = 150): number {
  const words = text.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
