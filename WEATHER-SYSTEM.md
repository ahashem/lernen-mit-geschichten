# Weather & Seasons System Documentation

## Overview

The Weather & Seasons System creates an immersive, dynamic atmosphere for the stories website. It features:

- **10 Weather Types**: Sunny, Cloudy, Rainy, Stormy, Snowy, Foggy, Windy, Rainbow, Clear Night, Cloudy Night
- **4 Seasons**: Spring, Summer, Autumn, Winter (automatically change based on real dates)
- **Visual Effects**: Canvas-based particle systems (rain, snow, fog, wind, stars)
- **Weather Sounds**: Ambient audio using Web Audio API (rain, thunder, wind, crickets)
- **Seasonal Themes**: Dynamic color schemes and decorations
- **Story Integration**: Weather-appropriate story recommendations
- **Performance Controls**: Adjustable particle density and reduced motion support
- **Accessibility**: Epilepsy-safe effects, sound toggles, always sunny mode

## Files Created

### Core Utilities
- `src/utils/weather-system.ts` - Main weather logic and state management
- `src/utils/weather-sounds.ts` - Weather sound effects engine

### Components
- `src/components/WeatherOverlay.astro` - Canvas-based weather effects overlay
- `src/components/WeatherWidget.astro` - Compact weather control widget
- `src/components/SeasonalTheme.astro` - Season-based styling and decorations

### Pages
- `src/pages/weather-settings.astro` - Full weather control panel

## Features

### 1. Weather Types

**Daytime Weather:**
- ☀️ **Sunny** - Clear skies, bright atmosphere
- ☁️ **Cloudy** - Overcast, soft lighting
- 🌧️ **Rainy** - Animated falling rain drops
- ⛈️ **Stormy** - Heavy rain, lightning flashes, thunder sounds
- 🌨️ **Snowy** - Falling snowflakes with accumulation effect
- 🌫️ **Foggy** - Layered fog clouds moving horizontally
- 🌬️ **Windy** - Debris/leaves blowing across screen
- 🌈 **Rainbow** - After-rain colorful atmosphere

**Nighttime Weather:**
- 🌙 **Clear Night** - Twinkling stars, moon phases
- ⭐ **Cloudy Night** - Partial stars, atmospheric clouds

### 2. Seasonal System

**Automatic Season Changes:**
- 🌸 **Spring** (March-May): Pastel colors, flower decorations, fresh themes
- ☀️ **Summer** (June-August): Bright colors, sun motifs, warm atmosphere
- 🍂 **Autumn** (September-November): Orange/red colors, falling leaves
- ❄️ **Winter** (December-February): Cool blues, snowflakes, icicles

**Season Features:**
- Gradual 3-day transitions between seasons
- Dynamic background color schemes
- Seasonal decorations that update automatically
- Special event detection (Christmas, Easter, Halloween, New Year)
- Season progress tracking (days into season)

### 3. Visual Weather Effects

**Particle System (Canvas API):**
- Rain: Animated drops with splash effects
- Snow: Various sizes, gentle sway, accumulation
- Fog: Semi-transparent layered clouds
- Wind: Leaves/debris with horizontal motion
- Stars: Twinkling effect with opacity variation
- Lightning: Safe, subtle white flashes (epilepsy-friendly)

**Performance:**
- Maximum 100 particles for optimal performance
- Adjustable particle density (0-100%)
- Pause animations when tab inactive
- Reduced motion support (completely disables animations)
- Low-power mode option

### 4. Weather Sounds

**Ambient Audio (Web Audio API):**
- Rain: Procedural rain patter with varying intensity
- Thunder: Deep rumble with fade-out
- Wind: Continuous whoosh with LFO variation
- Crickets: Night ambience with chirping

**Sound Controls:**
- Volume adjustment (0-100%)
- Toggle on/off
- Automatic fade in/out
- Syncs with weather changes

### 5. Story Integration

**Weather-Based Story Recommendations:**
- Rainy → Indoor, cozy, reading, family stories
- Sunny → Outdoor, adventure, playground, nature stories
- Snowy → Winter, cold, ice, holiday stories
- Stormy → Brave, courage, safety, home stories
- Cloudy → Thinking, creative, imagination stories
- Windy → Flying, leaves, autumn, kite stories
- Foggy → Mystery, discovery, exploration stories
- Rainbow → Hope, joy, colors, happiness stories
- Night → Dreams, sleep, stars, bedtime stories

**Seasonal Story Themes:**
- Spring → Growth, new beginnings, flowers, Easter, rain
- Summer → Beach, vacation, sun, hot, swimming
- Autumn → Harvest, school, leaves, change, Halloween
- Winter → Snow, Christmas, cold, holidays, warm

### 6. Weather Controls

**Weather Widget (Floating):**
- Current weather display with emoji and temperature
- Quick access panel
- Weather type buttons
- Intensity selector (Light/Medium/Heavy)
- Auto-weather toggle
- Sound toggle
- Always sunny mode

**Weather Settings Page:**
- Full weather control grid
- Season information display
- 3-day forecast
- Particle density slider
- Sound volume control
- Reduced motion toggle
- Performance settings
- Special events display

### 7. Auto Weather System

**Automatic Changes:**
- Weather changes every 4 hours when enabled
- Season-appropriate weather selection
- Time-based day/night cycle
- Realistic weather probabilities per season

**Manual Override:**
- Set any weather type manually
- Override auto-weather temporarily
- Always sunny mode for sensitive children

### 8. Accessibility Features

**Inclusive Design:**
- ♿ **Reduced Motion**: Completely disables animations
- 🔇 **Sound Toggle**: Turn off all weather sounds
- ☀️ **Always Sunny**: No storms/thunder for sensitive kids
- ⚡ **Epilepsy-Safe**: No flashing lightning effects
- 📱 **Performance**: Adjustable particle density
- 🎯 **Screen Readers**: All effects marked as aria-hidden

### 9. Moon Phases

**Night Sky Feature:**
- 8 moon phases tracked (New → Full → New)
- Displayed during night weather types
- Calculated based on actual dates
- Visual moon emoji representation

### 10. Special Events

**Seasonal Events:**
- 🎄 Christmas (Dec 20-26): Christmas decorations
- 🐰 Easter (April 10-20): Easter egg decorations
- 🎃 Halloween (Oct 31): Spooky decorations
- 🎊 New Year (Jan 1): Celebration decorations

## Usage

### Basic Setup

The weather system is automatically integrated into the BaseLayout:

```astro
import WeatherOverlay from '@components/WeatherOverlay.astro';
import WeatherWidget from '@components/WeatherWidget.astro';
import SeasonalTheme from '@components/SeasonalTheme.astro';

<!-- In body -->
<WeatherOverlay />
<WeatherWidget locale={locale} />
<SeasonalTheme />
```

### Manual Weather Control (JavaScript)

```javascript
import { weatherSystem } from '@utils/weather-system';

// Set weather
weatherSystem.setWeather('rainy', 'heavy');

// Toggle auto weather
weatherSystem.toggleAutoChange();

// Get current state
const state = weatherSystem.getState();
console.log(state.current.type); // 'rainy'
console.log(state.seasonal.season); // 'spring'

// Get weather-appropriate stories
const themes = weatherSystem.getWeatherStoryThemes();
console.log(themes); // ['indoor', 'cozy', 'reading', 'family']

// Get forecast
const forecast = weatherSystem.getForecast();
```

### Weather Sounds Control

```javascript
import { weatherSounds } from '@utils/weather-sounds';

// Play weather sounds
weatherSounds.playWeather('rainy', 'medium');

// Set volume
weatherSounds.setVolume(0.5); // 50%

// Stop all sounds
weatherSounds.stopAll();

// Toggle on/off
weatherSounds.toggle();
```

### Custom Event Listening

```javascript
// Listen for weather changes
window.addEventListener('weather-changed', (event) => {
  const { type, intensity } = event.detail;
  console.log(`Weather changed to ${type} (${intensity})`);
});
```

## Translations

All weather UI text is fully translated in 5 languages:
- German (de)
- English (en)
- Arabic (ar)
- Turkish (tr)
- Urdu (ur)

Translation keys added:
- `weatherWidget`
- `weatherSettings`
- `weatherSunny`, `weatherCloudy`, `weatherRainy`, etc.
- `weatherIntensity`
- `light`, `medium`, `heavy`
- `seasonControl`
- `spring`, `summer`, `autumn`, `winter`
- And many more...

## Performance Considerations

**Optimization Techniques:**
- Canvas rendering (GPU-accelerated)
- Particle limit (max 100)
- Animation pauses when tab inactive
- Adjustable particle density
- Reduced motion support
- Low-power mode available

**Browser Compatibility:**
- Modern browsers with Canvas API support
- Web Audio API for sounds
- LocalStorage for state persistence
- Graceful degradation for older browsers

## LocalStorage Keys

The system stores state in localStorage:
- `weather-state` - Weather and season configuration
- `weather-sounds-enabled` - Sound toggle state

## Future Enhancements

Potential additions:
- Real weather API integration (optional)
- More particle effects (butterflies, fireflies, petals)
- Seasonal music tracks
- Weather mini-games
- Daily weather challenges
- Weather journal/diary

## Credits

- **Canvas Particle System**: Custom implementation
- **Web Audio API**: Procedural sound generation
- **Seasonal Colors**: Child-friendly pastel palette
- **Icons**: Native emoji support

---

**Version**: 1.0.0
**Last Updated**: 2025-11-06
**Maintained by**: Lernen mit Geschichten Team
