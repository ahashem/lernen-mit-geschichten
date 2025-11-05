/**
 * Speech Recognition Utility for Voice Input
 * Wrapper around Web Speech API with multilingual support
 */

export interface RecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
  onResult?: (transcript: string, confidence: number, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export interface RecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  alternatives?: string[];
}

export class SpeechRecognizer {
  private recognition: any;
  private isListening: boolean = false;
  private locale: string;

  constructor(locale: string = 'de-DE') {
    this.locale = locale;
    this.initRecognition();
  }

  private initRecognition() {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = this.locale;
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 3;
  }

  /**
   * Check if speech recognition is supported
   */
  static isSupported(): boolean {
    return !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }

  /**
   * Start listening for voice input
   */
  listen(options: RecognitionOptions = {}): Promise<RecognitionResult> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech Recognition not supported'));
        return;
      }

      if (this.isListening) {
        this.stop();
      }

      // Configure recognition
      this.recognition.lang = options.language || this.locale;
      this.recognition.continuous = options.continuous ?? false;
      this.recognition.interimResults = options.interimResults ?? true;
      this.recognition.maxAlternatives = options.maxAlternatives ?? 3;

      // Event handlers
      this.recognition.onresult = (event: any) => {
        const result = event.results[event.results.length - 1];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence;
        const isFinal = result.isFinal;

        // Get alternatives
        const alternatives: string[] = [];
        for (let i = 1; i < result.length && i < 3; i++) {
          alternatives.push(result[i].transcript);
        }

        // Call callback if provided
        if (options.onResult) {
          options.onResult(transcript, confidence, isFinal);
        }

        // Resolve on final result
        if (isFinal) {
          resolve({
            transcript: transcript.trim(),
            confidence,
            isFinal: true,
            alternatives
          });
        }
      };

      this.recognition.onerror = (event: any) => {
        const errorMessage = this.getErrorMessage(event.error);
        if (options.onError) {
          options.onError(errorMessage);
        }
        reject(new Error(errorMessage));
        this.isListening = false;
      };

      this.recognition.onstart = () => {
        this.isListening = true;
        if (options.onStart) {
          options.onStart();
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (options.onEnd) {
          options.onEnd();
        }
      };

      // Start recognition
      try {
        this.recognition.start();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Stop listening
   */
  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  /**
   * Check if currently listening
   */
  isActive(): boolean {
    return this.isListening;
  }

  /**
   * Get user-friendly error messages
   */
  private getErrorMessage(error: string): string {
    const messages: Record<string, Record<string, string>> = {
      'no-speech': {
        de: 'Keine Sprache erkannt. Bitte versuchen Sie es erneut.',
        ar: 'لم يتم اكتشاف الصوت. الرجاء المحاولة مرة أخرى.',
        en: 'No speech detected. Please try again.',
        tr: 'Ses algılanmadı. Lütfen tekrar deneyin.',
        ur: 'آواز کا پتہ نہیں چلا۔ براہ کرم دوبارہ کوشش کریں۔'
      },
      'audio-capture': {
        de: 'Mikrofon konnte nicht gestartet werden.',
        ar: 'تعذر تشغيل الميكروفون.',
        en: 'Microphone could not be started.',
        tr: 'Mikrofon başlatılamadı.',
        ur: 'مائیکروفون شروع نہیں کیا جا سکا۔'
      },
      'not-allowed': {
        de: 'Mikrofonzugriff verweigert. Bitte Berechtigungen erteilen.',
        ar: 'تم رفض الوصول إلى الميكروفون. يرجى منح الأذونات.',
        en: 'Microphone access denied. Please grant permissions.',
        tr: 'Mikrofon erişimi reddedildi. Lütfen izinleri verin.',
        ur: 'مائیکروفون تک رسائی مسترد۔ براہ کرم اجازت دیں۔'
      },
      'network': {
        de: 'Netzwerkfehler. Bitte Verbindung prüfen.',
        ar: 'خطأ في الشبكة. يرجى التحقق من الاتصال.',
        en: 'Network error. Please check connection.',
        tr: 'Ağ hatası. Lütfen bağlantıyı kontrol edin.',
        ur: 'نیٹ ورک کی خرابی۔ براہ کرم کنکشن چیک کریں۔'
      }
    };

    const locale = this.locale.split('-')[0];
    return messages[error]?.[locale] || messages[error]?.['en'] || 'Speech recognition error';
  }

  /**
   * Set language for recognition
   */
  setLanguage(locale: string) {
    this.locale = locale;
    if (this.recognition) {
      this.recognition.lang = locale;
    }
  }
}

/**
 * Helper to map locale codes to Web Speech API language codes
 */
export function getSpeechLocale(locale: string): string {
  const localeMap: Record<string, string> = {
    de: 'de-DE',
    ar: 'ar-SA',
    en: 'en-US',
    tr: 'tr-TR',
    ur: 'ur-PK'
  };
  return localeMap[locale] || 'de-DE';
}

/**
 * Helper to normalize and match answers
 */
export interface AnswerMatchOptions {
  correctAnswer: string | string[];
  userInput: string;
  language: string;
  questionType: 'truefalse' | 'multiplechoice' | 'fillinblank';
  options?: string[];
}

export function matchAnswer(options: AnswerMatchOptions): {
  isMatch: boolean;
  matchedValue: string | null;
  confidence: number;
} {
  const { correctAnswer, userInput, language, questionType, options: mcOptions } = options;

  const normalizedInput = userInput.toLowerCase().trim();
  const correctAnswers = Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer];

  // True/False matching
  if (questionType === 'truefalse') {
    const trueFalseMap: Record<string, { true: string[]; false: string[] }> = {
      de: {
        true: ['richtig', 'wahr', 'ja', 'stimmt', 'korrekt', 'true', 'yes'],
        false: ['falsch', 'nein', 'unwahr', 'inkorrekt', 'false', 'no']
      },
      ar: {
        true: ['صح', 'صحيح', 'نعم', 'صواب'],
        false: ['خطأ', 'غلط', 'لا', 'خاطئ']
      },
      en: {
        true: ['true', 'correct', 'yes', 'right', 'yeah', 'yep'],
        false: ['false', 'incorrect', 'no', 'wrong', 'nope']
      },
      tr: {
        true: ['doğru', 'evet', 'dogru'],
        false: ['yanlış', 'hayır', 'yanlis']
      },
      ur: {
        true: ['صحیح', 'ہاں', 'ٹھیک'],
        false: ['غلط', 'نہیں']
      }
    };

    const langMap = trueFalseMap[language] || trueFalseMap.en;
    const correctValue = correctAnswers[0];

    if (correctValue === 'true') {
      const isMatch = langMap.true.some(word => normalizedInput.includes(word));
      return { isMatch, matchedValue: isMatch ? 'true' : null, confidence: isMatch ? 0.9 : 0 };
    } else {
      const isMatch = langMap.false.some(word => normalizedInput.includes(word));
      return { isMatch, matchedValue: isMatch ? 'false' : null, confidence: isMatch ? 0.9 : 0 };
    }
  }

  // Multiple Choice matching
  if (questionType === 'multiplechoice' && mcOptions) {
    // Check for letter answers (A, B, C, etc.)
    const letterMatch = normalizedInput.match(/^([a-z])\b/i);
    if (letterMatch) {
      const letterIndex = letterMatch[1].toLowerCase().charCodeAt(0) - 97; // 'a' = 0
      if (letterIndex >= 0 && letterIndex < mcOptions.length) {
        const selectedOption = mcOptions[letterIndex];
        const isMatch = correctAnswers.some(ans =>
          ans.toLowerCase() === selectedOption.toLowerCase()
        );
        return {
          isMatch,
          matchedValue: isMatch ? selectedOption : null,
          confidence: 1.0
        };
      }
    }

    // Check for full text match
    for (const option of mcOptions) {
      const normalizedOption = option.toLowerCase().trim();
      if (normalizedInput.includes(normalizedOption) || normalizedOption.includes(normalizedInput)) {
        const isMatch = correctAnswers.some(ans =>
          ans.toLowerCase() === option.toLowerCase()
        );
        return {
          isMatch,
          matchedValue: isMatch ? option : null,
          confidence: 0.8
        };
      }
    }
  }

  // Fill-in-blank matching
  if (questionType === 'fillinblank') {
    for (const answer of correctAnswers) {
      const normalizedAnswer = answer.toLowerCase().trim();

      // Exact match
      if (normalizedInput === normalizedAnswer) {
        return { isMatch: true, matchedValue: answer, confidence: 1.0 };
      }

      // Partial match (contains)
      if (normalizedInput.includes(normalizedAnswer) || normalizedAnswer.includes(normalizedInput)) {
        return { isMatch: true, matchedValue: answer, confidence: 0.7 };
      }

      // Fuzzy match (Levenshtein distance)
      const similarity = calculateSimilarity(normalizedInput, normalizedAnswer);
      if (similarity > 0.7) {
        return { isMatch: true, matchedValue: answer, confidence: similarity };
      }
    }
  }

  return { isMatch: false, matchedValue: null, confidence: 0 };
}

/**
 * Calculate string similarity (simplified Levenshtein)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Create sparkle effect for voice recognition
 */
export function createSparkleEffect(x: number, y: number) {
  const sparkles = 12;
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = `${x}px`;
  container.style.top = `${y}px`;
  container.style.pointerEvents = 'none';
  container.style.zIndex = '10000';

  for (let i = 0; i < sparkles; i++) {
    const sparkle = document.createElement('div');
    sparkle.innerHTML = '✨';
    sparkle.style.position = 'absolute';
    sparkle.style.fontSize = '20px';
    sparkle.style.animation = `sparkle-float 1s ease-out forwards`;

    const angle = (i / sparkles) * Math.PI * 2;
    const distance = 50 + Math.random() * 30;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    sparkle.style.setProperty('--tx', `${tx}px`);
    sparkle.style.setProperty('--ty', `${ty}px`);

    container.appendChild(sparkle);
  }

  document.body.appendChild(container);

  setTimeout(() => {
    document.body.removeChild(container);
  }, 1000);
}

// Add sparkle animation styles to document
if (typeof document !== 'undefined' && !document.getElementById('sparkle-styles')) {
  const style = document.createElement('style');
  style.id = 'sparkle-styles';
  style.textContent = `
    @keyframes sparkle-float {
      0% {
        opacity: 1;
        transform: translate(0, 0) scale(0);
      }
      50% {
        opacity: 1;
        transform: translate(calc(var(--tx) * 0.5), calc(var(--ty) * 0.5)) scale(1);
      }
      100% {
        opacity: 0;
        transform: translate(var(--tx), var(--ty)) scale(0.5);
      }
    }
  `;
  document.head.appendChild(style);
}
