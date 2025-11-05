/**
 * Accessibility Preference Manager
 * Handles saving, loading, and applying accessibility preferences
 */

export interface AccessibilityPreferences {
  // Font options
  dyslexiaFont: boolean;
  fontSize: number;
  letterSpacing: number;
  wordSpacing: number;
  lineHeight: number;

  // Color & contrast
  colorTheme:
    | 'default'
    | 'high-contrast-black'
    | 'high-contrast-yellow'
    | 'blue-friendly'
    | 'warm-tones'
    | 'pastel'
    | 'dark-mode';
  colorblindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';

  // Reading aids
  readingRuler: boolean;
  focusMode: boolean;
  textHighlight: boolean;
  removeDistractions: boolean;

  // Motion & animations
  reduceMotion: boolean;

  // Audio (inherited from TTS controls)
  ttsSpeed: number;
  ttsVolume: number;
}

export const defaultPreferences: AccessibilityPreferences = {
  dyslexiaFont: false,
  fontSize: 18,
  letterSpacing: 0,
  wordSpacing: 0,
  lineHeight: 1.6,
  colorTheme: 'default',
  colorblindMode: 'none',
  readingRuler: false,
  focusMode: false,
  textHighlight: false,
  removeDistractions: false,
  reduceMotion: false,
  ttsSpeed: 1.0,
  ttsVolume: 80,
};

const STORAGE_KEY = 'accessibility-preferences';

/**
 * Load preferences from localStorage
 */
export function loadPreferences(): AccessibilityPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultPreferences, ...parsed };
    }
  } catch (error) {
    console.error('Failed to load accessibility preferences:', error);
  }
  return defaultPreferences;
}

/**
 * Save preferences to localStorage
 */
export function savePreferences(preferences: AccessibilityPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save accessibility preferences:', error);
  }
}

/**
 * Reset to default preferences
 */
export function resetPreferences(): AccessibilityPreferences {
  localStorage.removeItem(STORAGE_KEY);
  return defaultPreferences;
}

/**
 * Apply preferences to the document
 */
export function applyPreferences(preferences: AccessibilityPreferences): void {
  const { body } = document;
  const root = document.documentElement;

  // Remove all theme classes first
  body.className = body.className
    .split(' ')
    .filter(c => !c.startsWith('theme-') && !c.includes('contrast') && !c.includes('mode'))
    .join(' ');

  // Font options
  if (preferences.dyslexiaFont) {
    body.classList.add('dyslexia-mode');
  } else {
    body.classList.remove('dyslexia-mode');
  }

  // Font size
  root.style.setProperty('font-size', `${preferences.fontSize}px`);

  // Letter spacing
  if (preferences.letterSpacing > 0) {
    root.style.setProperty('--a11y-letter-spacing', `${preferences.letterSpacing}em`);
    body.classList.add('increased-letter-spacing');
  } else {
    root.style.setProperty('--a11y-letter-spacing', 'normal');
    body.classList.remove('increased-letter-spacing');
  }

  // Word spacing
  if (preferences.wordSpacing > 0) {
    root.style.setProperty('--a11y-word-spacing', `${preferences.wordSpacing}em`);
    body.classList.add('increased-word-spacing');
  } else {
    root.style.setProperty('--a11y-word-spacing', 'normal');
    body.classList.remove('increased-word-spacing');
  }

  // Line height
  root.style.setProperty('--a11y-line-height', preferences.lineHeight.toString());
  if (preferences.lineHeight !== 1.6) {
    body.classList.add('increased-line-height');
  } else {
    body.classList.remove('increased-line-height');
  }

  // Color theme
  if (preferences.colorTheme !== 'default') {
    body.classList.add(preferences.colorTheme);
  }

  // Colorblind mode
  body.className = body.className.replace(/colorblind-\w+/g, '');
  if (preferences.colorblindMode !== 'none') {
    body.classList.add(`colorblind-${preferences.colorblindMode}`);
  }

  // Reading aids
  toggleClass(body, 'reading-ruler-enabled', preferences.readingRuler);
  toggleClass(body, 'focus-mode', preferences.focusMode);
  toggleClass(body, 'text-highlight-enabled', preferences.textHighlight);
  toggleClass(body, 'remove-distractions', preferences.removeDistractions);

  // Motion
  toggleClass(body, 'reduce-motion', preferences.reduceMotion);

  // Sync with TTS controls if they exist
  syncTTSControls(preferences);
}

/**
 * Toggle a class on an element
 */
function toggleClass(element: HTMLElement, className: string, condition: boolean): void {
  if (condition) {
    element.classList.add(className);
  } else {
    element.classList.remove(className);
  }
}

/**
 * Sync TTS controls with accessibility preferences
 */
function syncTTSControls(preferences: AccessibilityPreferences): void {
  const volumeSlider = document.querySelector('.volume-slider') as HTMLInputElement;
  const speedSelect = document.querySelector('.speed-select') as HTMLSelectElement;

  if (volumeSlider) {
    volumeSlider.value = preferences.ttsVolume.toString();
    const volumeDisplay = volumeSlider.nextElementSibling;
    if (volumeDisplay) {
      volumeDisplay.textContent = `${preferences.ttsVolume}%`;
    }
  }

  if (speedSelect) {
    speedSelect.value = preferences.ttsSpeed.toString();
  }
}

/**
 * Get preset configurations
 */
export const presets = {
  'dyslexia-friendly': {
    ...defaultPreferences,
    dyslexiaFont: true,
    letterSpacing: 0.15,
    wordSpacing: 0.2,
    lineHeight: 2,
    fontSize: 20,
    textHighlight: true,
  } as AccessibilityPreferences,

  'adhd-friendly': {
    ...defaultPreferences,
    focusMode: true,
    removeDistractions: true,
    fontSize: 20,
    lineHeight: 1.8,
    colorTheme: 'blue-friendly',
    reduceMotion: true,
  } as AccessibilityPreferences,

  'visual-impairment': {
    ...defaultPreferences,
    fontSize: 24,
    lineHeight: 2.2,
    letterSpacing: 0.1,
    colorTheme: 'high-contrast-black',
    textHighlight: true,
    readingRuler: true,
  } as AccessibilityPreferences,
};

/**
 * Apply a preset configuration
 */
export function applyPreset(presetName: keyof typeof presets): AccessibilityPreferences {
  const preferences = presets[presetName];
  savePreferences(preferences);
  applyPreferences(preferences);
  return preferences;
}

/**
 * Initialize reading ruler (follows mouse)
 */
export function initializeReadingRuler(): void {
  let ruler = document.querySelector('.reading-ruler') as HTMLElement;

  if (!ruler) {
    ruler = document.createElement('div');
    ruler.className = 'reading-ruler';
    document.body.appendChild(ruler);
  }

  document.addEventListener('mousemove', (e: MouseEvent) => {
    if (document.body.classList.contains('reading-ruler-enabled')) {
      ruler.style.top = `${e.clientY}px`;
    }
  });
}

/**
 * Initialize focus mode (paragraph highlighting)
 */
export function initializeFocusMode(): void {
  const storyContent = document.querySelector('.story-content');
  if (!storyContent) return;

  const paragraphs = storyContent.querySelectorAll('p, li, h1, h2, h3');

  paragraphs.forEach(p => {
    p.addEventListener('mouseenter', () => {
      if (document.body.classList.contains('focus-mode')) {
        paragraphs.forEach(other => other.classList.remove('focused'));
        p.classList.add('focused');
      }
    });
  });
}
