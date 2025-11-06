/**
 * Dynamic Weather & Seasons System
 * Creates atmospheric weather effects and seasonal changes throughout the year
 */

export type WeatherType =
  | 'sunny'
  | 'cloudy'
  | 'rainy'
  | 'stormy'
  | 'snowy'
  | 'foggy'
  | 'windy'
  | 'rainbow'
  | 'night-clear'
  | 'night-cloudy';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export type TimeOfDay = 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night';

export type WeatherIntensity = 'light' | 'medium' | 'heavy';

export interface WeatherConfig {
  type: WeatherType;
  intensity: WeatherIntensity;
  windSpeed: number; // 0-100
  temperature: number; // Celsius
  humidity: number; // 0-100
  visibility: number; // 0-100
}

export interface SeasonalConfig {
  season: Season;
  transitionProgress: number; // 0-1 (for gradual transitions)
  dateInSeason: number; // Days into the season
  specialEvent?: string; // e.g., "christmas", "easter"
}

export interface WeatherState {
  current: WeatherConfig;
  seasonal: SeasonalConfig;
  timeOfDay: TimeOfDay;
  autoChange: boolean;
  soundEnabled: boolean;
  particleDensity: number; // 0-100 (performance)
  reducedMotion: boolean;
  alwaysSunny: boolean;
}

/**
 * Weather emoji icons
 */
export const WEATHER_ICONS: Record<WeatherType, string> = {
  'sunny': '☀️',
  'cloudy': '☁️',
  'rainy': '🌧️',
  'stormy': '⛈️',
  'snowy': '🌨️',
  'foggy': '🌫️',
  'windy': '🌬️',
  'rainbow': '🌈',
  'night-clear': '🌙',
  'night-cloudy': '⭐'
};

/**
 * Season emoji icons
 */
export const SEASON_ICONS: Record<Season, string> = {
  'spring': '🌸',
  'summer': '☀️',
  'autumn': '🍂',
  'winter': '❄️'
};

/**
 * Seasonal weather probabilities
 */
const SEASONAL_WEATHER_WEIGHTS: Record<Season, Partial<Record<WeatherType, number>>> = {
  spring: {
    'sunny': 30,
    'cloudy': 25,
    'rainy': 30,
    'windy': 10,
    'foggy': 5
  },
  summer: {
    'sunny': 60,
    'cloudy': 20,
    'rainy': 10,
    'stormy': 5,
    'windy': 5
  },
  autumn: {
    'cloudy': 35,
    'rainy': 25,
    'windy': 20,
    'foggy': 10,
    'sunny': 10
  },
  winter: {
    'snowy': 40,
    'cloudy': 30,
    'foggy': 15,
    'windy': 10,
    'sunny': 5
  }
};

/**
 * Weather affects which stories to feature
 */
export const WEATHER_STORY_THEMES: Record<WeatherType, string[]> = {
  'rainy': ['indoor', 'cozy', 'reading', 'family'],
  'sunny': ['outdoor', 'adventure', 'playground', 'nature'],
  'snowy': ['winter', 'cold', 'ice', 'holidays'],
  'stormy': ['brave', 'courage', 'safety', 'home'],
  'cloudy': ['thinking', 'creative', 'imagination'],
  'windy': ['flying', 'leaves', 'autumn', 'kite'],
  'foggy': ['mystery', 'discovery', 'exploration'],
  'rainbow': ['hope', 'joy', 'colors', 'happiness'],
  'night-clear': ['dreams', 'sleep', 'stars', 'bedtime'],
  'night-cloudy': ['bedtime', 'calm', 'quiet']
};

/**
 * Seasonal story themes
 */
export const SEASONAL_STORY_THEMES: Record<Season, string[]> = {
  spring: ['growth', 'new-beginnings', 'flowers', 'easter', 'rain'],
  summer: ['beach', 'vacation', 'sun', 'hot', 'swimming'],
  autumn: ['harvest', 'school', 'leaves', 'change', 'halloween'],
  winter: ['snow', 'christmas', 'cold', 'holidays', 'warm']
};

/**
 * Weather System Manager
 */
export class WeatherSystem {
  private state: WeatherState;
  private autoChangeInterval: number | null = null;
  private moonPhase: number = 0; // 0-7 (new to full to new)

  constructor() {
    this.state = this.loadState();
    this.moonPhase = this.calculateMoonPhase();

    // Start auto-change if enabled
    if (this.state.autoChange) {
      this.startAutoChange();
    }
  }

  /**
   * Get current date-based season
   */
  private getDateBasedSeason(): Season {
    const now = new Date();
    const month = now.getMonth(); // 0-11

    if (month >= 2 && month <= 4) return 'spring'; // March-May
    if (month >= 5 && month <= 7) return 'summer'; // June-August
    if (month >= 8 && month <= 10) return 'autumn'; // September-November
    return 'winter'; // December-February
  }

  /**
   * Calculate days into current season
   */
  private getDaysIntoSeason(): number {
    const now = new Date();
    const month = now.getMonth();
    const day = now.getDate();

    const seasonStarts = [
      { month: 2, day: 1 },   // Spring: March 1
      { month: 5, day: 1 },   // Summer: June 1
      { month: 8, day: 1 },   // Autumn: September 1
      { month: 11, day: 1 }   // Winter: December 1
    ];

    const season = this.getDateBasedSeason();
    let startMonth: number;

    switch (season) {
      case 'spring': startMonth = 2; break;
      case 'summer': startMonth = 5; break;
      case 'autumn': startMonth = 8; break;
      case 'winter': startMonth = 11; break;
    }

    let days = 0;
    if (month >= startMonth) {
      days = (month - startMonth) * 30 + day;
    } else {
      // Winter wraps around year
      days = (12 - startMonth + month) * 30 + day;
    }

    return days;
  }

  /**
   * Check if we're in a season transition period (first/last 3 days)
   */
  private getSeasonTransitionProgress(): number {
    const daysIntoSeason = this.getDaysIntoSeason();

    if (daysIntoSeason <= 3) {
      // Transitioning in (0 to 1)
      return daysIntoSeason / 3;
    } else if (daysIntoSeason >= 87) {
      // Transitioning out (1 to 0)
      return (90 - daysIntoSeason) / 3;
    }

    return 1; // Fully in season
  }

  /**
   * Calculate current moon phase (0-7)
   */
  private calculateMoonPhase(): number {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    // Simplified moon phase calculation
    const c = Math.floor((year - 1900) / 100);
    const e = c - Math.floor(c / 4) - 2;
    const jd = Math.floor(365.25 * (year + 4716)) +
              Math.floor(30.6001 * (month + 1)) + day - 1524.5;
    const daysSinceNew = (jd - 2451550.1 + e) % 29.53059;

    return Math.floor((daysSinceNew / 29.53059) * 8);
  }

  /**
   * Get time of day based on current hour
   */
  private getTimeOfDay(): TimeOfDay {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 7) return 'dawn';
    if (hour >= 7 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 20) return 'evening';
    return 'night';
  }

  /**
   * Generate random weather based on season
   */
  private generateRandomWeather(season: Season): WeatherType {
    if (this.state.alwaysSunny) {
      return 'sunny';
    }

    const timeOfDay = this.getTimeOfDay();

    // Override with night weather
    if (timeOfDay === 'night') {
      return Math.random() > 0.5 ? 'night-clear' : 'night-cloudy';
    }

    const weights = SEASONAL_WEATHER_WEIGHTS[season];
    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;

    for (const [weather, weight] of Object.entries(weights)) {
      random -= weight;
      if (random <= 0) {
        return weather as WeatherType;
      }
    }

    return 'sunny'; // Fallback
  }

  /**
   * Generate weather config
   */
  private generateWeatherConfig(type: WeatherType, intensity: WeatherIntensity): WeatherConfig {
    const intensityMultiplier = intensity === 'light' ? 0.5 : intensity === 'medium' ? 1 : 1.5;

    const baseConfigs: Record<WeatherType, Partial<WeatherConfig>> = {
      'sunny': { windSpeed: 5, temperature: 24, humidity: 40, visibility: 100 },
      'cloudy': { windSpeed: 10, temperature: 18, humidity: 60, visibility: 80 },
      'rainy': { windSpeed: 15, temperature: 15, humidity: 90, visibility: 60 },
      'stormy': { windSpeed: 40, temperature: 14, humidity: 95, visibility: 40 },
      'snowy': { windSpeed: 10, temperature: -2, humidity: 80, visibility: 50 },
      'foggy': { windSpeed: 3, temperature: 10, humidity: 95, visibility: 20 },
      'windy': { windSpeed: 35, temperature: 16, humidity: 50, visibility: 90 },
      'rainbow': { windSpeed: 8, temperature: 20, humidity: 70, visibility: 100 },
      'night-clear': { windSpeed: 5, temperature: 12, humidity: 60, visibility: 100 },
      'night-cloudy': { windSpeed: 10, temperature: 12, humidity: 70, visibility: 70 }
    };

    const base = baseConfigs[type];

    return {
      type,
      intensity,
      windSpeed: Math.min(100, (base.windSpeed || 0) * intensityMultiplier),
      temperature: base.temperature || 20,
      humidity: Math.min(100, (base.humidity || 50) * intensityMultiplier),
      visibility: Math.max(0, (base.visibility || 100) / intensityMultiplier)
    };
  }

  /**
   * Set weather manually
   */
  setWeather(type: WeatherType, intensity: WeatherIntensity = 'medium') {
    this.state.current = this.generateWeatherConfig(type, intensity);
    this.saveState();
  }

  /**
   * Change weather automatically (called by interval)
   */
  changeWeather() {
    const season = this.state.seasonal.season;
    const newWeather = this.generateRandomWeather(season);
    const intensity: WeatherIntensity =
      Math.random() > 0.7 ? 'heavy' : Math.random() > 0.4 ? 'medium' : 'light';

    this.setWeather(newWeather, intensity);
  }

  /**
   * Update season based on current date
   */
  updateSeason() {
    const season = this.getDateBasedSeason();
    const daysIntoSeason = this.getDaysIntoSeason();
    const transitionProgress = this.getSeasonTransitionProgress();

    this.state.seasonal = {
      season,
      transitionProgress,
      dateInSeason: daysIntoSeason,
      specialEvent: this.detectSpecialEvent()
    };

    this.saveState();
  }

  /**
   * Detect special seasonal events
   */
  private detectSpecialEvent(): string | undefined {
    const now = new Date();
    const month = now.getMonth();
    const day = now.getDate();

    // Christmas season (Dec 20-26)
    if (month === 11 && day >= 20 && day <= 26) return 'christmas';

    // Easter (approximate - early April)
    if (month === 3 && day >= 10 && day <= 20) return 'easter';

    // Halloween
    if (month === 9 && day === 31) return 'halloween';

    // New Year
    if (month === 0 && day === 1) return 'new-year';

    return undefined;
  }

  /**
   * Start auto weather changes every 4 hours
   */
  startAutoChange() {
    this.state.autoChange = true;
    this.saveState();

    // Change weather every 4 hours (14400000ms)
    if (typeof window !== 'undefined') {
      this.autoChangeInterval = window.setInterval(() => {
        this.changeWeather();
      }, 14400000);
    }
  }

  /**
   * Stop auto weather changes
   */
  stopAutoChange() {
    this.state.autoChange = false;
    this.saveState();

    if (this.autoChangeInterval !== null) {
      clearInterval(this.autoChangeInterval);
      this.autoChangeInterval = null;
    }
  }

  /**
   * Toggle auto change
   */
  toggleAutoChange(): boolean {
    if (this.state.autoChange) {
      this.stopAutoChange();
    } else {
      this.startAutoChange();
    }
    return this.state.autoChange;
  }

  /**
   * Get weather forecast for next 3 days
   */
  getForecast(): { day: string; weather: WeatherType; temperature: number }[] {
    const forecast: { day: string; weather: WeatherType; temperature: number }[] = [];
    const season = this.state.seasonal.season;
    const days = ['Today', 'Tomorrow', 'Day After'];

    for (let i = 0; i < 3; i++) {
      const weather = this.generateRandomWeather(season);
      const config = this.generateWeatherConfig(weather, 'medium');

      forecast.push({
        day: days[i],
        weather,
        temperature: config.temperature
      });
    }

    return forecast;
  }

  /**
   * Get appropriate stories for current weather
   */
  getWeatherStoryThemes(): string[] {
    return WEATHER_STORY_THEMES[this.state.current.type] || [];
  }

  /**
   * Get appropriate stories for current season
   */
  getSeasonalStoryThemes(): string[] {
    return SEASONAL_STORY_THEMES[this.state.seasonal.season] || [];
  }

  /**
   * Get current moon phase
   */
  getMoonPhase(): { phase: number; name: string; emoji: string } {
    const names = ['New', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
                   'Full', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
    const emojis = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];

    return {
      phase: this.moonPhase,
      name: names[this.moonPhase],
      emoji: emojis[this.moonPhase]
    };
  }

  /**
   * Set particle density (performance)
   */
  setParticleDensity(density: number) {
    this.state.particleDensity = Math.max(0, Math.min(100, density));
    this.saveState();
  }

  /**
   * Toggle reduced motion
   */
  toggleReducedMotion(): boolean {
    this.state.reducedMotion = !this.state.reducedMotion;
    this.saveState();
    return this.state.reducedMotion;
  }

  /**
   * Toggle always sunny mode
   */
  toggleAlwaysSunny(): boolean {
    this.state.alwaysSunny = !this.state.alwaysSunny;
    if (this.state.alwaysSunny) {
      this.setWeather('sunny', 'medium');
    }
    this.saveState();
    return this.state.alwaysSunny;
  }

  /**
   * Toggle weather sounds
   */
  toggleSound(): boolean {
    this.state.soundEnabled = !this.state.soundEnabled;
    this.saveState();
    return this.state.soundEnabled;
  }

  /**
   * Get current state
   */
  getState(): WeatherState {
    return { ...this.state };
  }

  /**
   * Save state to localStorage
   */
  private saveState() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('weather-state', JSON.stringify(this.state));
    }
  }

  /**
   * Load state from localStorage
   */
  private loadState(): WeatherState {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('weather-state');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // Invalid state, use default
        }
      }
    }

    // Default state
    const season = this.getDateBasedSeason();
    const timeOfDay = this.getTimeOfDay();
    const weatherType = this.generateRandomWeather(season);

    return {
      current: this.generateWeatherConfig(weatherType, 'medium'),
      seasonal: {
        season,
        transitionProgress: this.getSeasonTransitionProgress(),
        dateInSeason: this.getDaysIntoSeason(),
        specialEvent: this.detectSpecialEvent()
      },
      timeOfDay,
      autoChange: false, // Default off
      soundEnabled: true,
      particleDensity: 70, // Medium performance
      reducedMotion: false,
      alwaysSunny: false
    };
  }
}

// Global instance
export const weatherSystem = new WeatherSystem();
