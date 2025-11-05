# Character Companion Feature

## Overview

The Character Companion system provides adorable animated characters that follow the mouse cursor and interact with the page. Kids will love having a friendly companion guide them through their learning journey!

## Features

### 7 Adorable Characters
- **Bruno the Bear** (🐻) - Friendly and encouraging
- **Mila the Owl** (🦉) - Wise and curious
- **Fritz the Fox** (🦊) - Playful and clever
- **Butterfly** (🦋) - Graceful and colorful
- **Star** (⭐) - Bright and cheerful
- **Cloud** (☁️) - Calm and gentle
- **Rainbow** (🌈) - Colorful and joyful

### Interactive Behaviors
- **Following**: Smoothly follows the mouse cursor with slight delay
- **Idle**: Gentle bobbing/breathing animation when stationary
- **Walking/Running**: Animated movement based on cursor speed
- **Jumping**: Special animation on double-click
- **Celebrating**: Spins and sparkles on quiz achievements
- **Sleeping**: Closes eyes if inactive for 30 seconds
- **Curious**: Reacts to hovering over interactive elements

### Customization Options
- **Size**: Small, Medium, Large
- **Speed**: Slow, Normal, Fast
- **Trail Effects**: Sparkle, Rainbow, Hearts, Stardust, or None
- **Trail Density**: Adjustable particle count
- **Dialogue Bubbles**: Show/hide encouraging messages

### Companion Actions
- **Click**: Says a random encouraging phrase
- **Double-Click**: Does a flip animation
- **Hover over Quiz**: Gets excited with bounce animation
- **Correct Answer**: Celebrates with confetti and sparkles
- **Story Start**: Sits and listens attentively
- **Idle Timeout**: Falls asleep after 30 seconds

### Multilingual Support
Companions speak in all 5 languages:
- German: "Hallo!", "Super!", "Weiter so!"
- Arabic: "مرحبا!", "رائع!", "استمر!"
- English: "Hello!", "Great!", "Keep going!"
- Turkish: "Merhaba!", "Harika!", "Devam et!"
- Urdu: "ہیلو!", "شاندار!", "جاری رکھو!"

## Usage

### Adding to a Page

Include the companion component in your Astro layout:

```astro
---
import CharacterCompanion from '../components/CharacterCompanion.astro';
import type { Locale } from '../utils/i18n';

const language: Locale = 'de'; // or from Astro.props
---

<CharacterCompanion language={language} />
```

### Programmatic Control

```typescript
import { getCompanion } from '../utils/character-companion';

const companion = getCompanion();

// Trigger celebration
companion.celebrate();

// Say something
companion.say('Toll gemacht!', 2000);

// Move to specific position
companion.moveTo({ x: 500, y: 300 });

// Update settings
companion.updateSettings({
  type: 'mila',
  size: 'large',
  speed: 'fast',
  trail: 'rainbow'
});
```

### Custom Events

The companion automatically reacts to these events:

```typescript
// On correct quiz answer
document.dispatchEvent(new CustomEvent('quiz-correct-answer'));

// On story start
document.dispatchEvent(new CustomEvent('story-started'));
```

## Implementation Details

### File Structure
- `/src/utils/character-companion.ts` - Main companion logic
- `/src/components/CharacterCompanion.astro` - UI component
- Locale files updated with companion translations

### SVG Characters
All characters are rendered as inline SVG for:
- Scalability (crisp at any size)
- Animation with CSS
- Small file size
- No external dependencies

### Performance
- Uses `requestAnimationFrame` for smooth 60fps
- Canvas-based particle system for trail effects
- Automatic cleanup when disabled
- Respects `prefers-reduced-motion`
- Particle count limits for low-end devices

### Accessibility
- Keyboard accessible (toggle panel)
- Screen reader labels
- Reduce motion mode support
- High contrast compatible
- Can be completely disabled

### Local Storage
Settings are saved to `localStorage`:
- Enabled/disabled state
- Selected character type
- Size preference
- Speed preference
- Trail effect
- Dialogue preferences

## CSS Animations

Characters include multiple animation states:
- `companion-idle`: Gentle bobbing
- `companion-walk`: Walking cycle
- `companion-run`: Running cycle
- `companion-jump`: Jump animation
- `companion-celebrate`: Celebration spin
- `companion-sleep`: Sleeping animation
- `companion-flip`: Double-click flip
- Plus: eye blinking, wing flapping, tail wagging

## Browser Support

- Modern browsers with Canvas API
- SVG support required
- Optional: Speech Recognition API for voice features
- Graceful degradation on older browsers

## Future Enhancements

Potential additions:
- More characters (unlockable via achievements)
- Custom companion names
- Companion accessories (hats, glasses, bows)
- Seasonal variants (winter, summer themes)
- Companion mini-games
- Companion sound effects
- Companion animations tied to story events

## Privacy

All companion data is stored locally:
- No server communication
- No tracking or analytics
- GDPR-friendly
- Works offline

## Integration with Existing Features

The companion integrates seamlessly with:
- **Quiz System**: Celebrates correct answers
- **Achievement System**: Unlocks special reactions
- **Story Reader**: Listens attentively during stories
- **Accessibility Features**: Respects user preferences
- **Multilingual System**: Speaks user's language

## Testing

Test the companion:
1. Enable companion from floating button
2. Move mouse to see following behavior
3. Click companion for random phrases
4. Double-click for flip animation
5. Answer quiz questions to trigger celebration
6. Stay idle for 30 seconds to see sleep mode
7. Try different characters and trail effects

## Notes

- Companion is disabled by default on mobile to save battery
- Respects system accessibility preferences
- Uses minimal CPU when idle
- Automatically pauses when page is hidden

---

**Created**: 2025-11-05
**Version**: 1.0.0
**Status**: Production Ready
