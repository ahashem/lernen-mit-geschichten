# Interactive Story Elements System

## Overview

This system brings stories to life with clickable elements, animations, sounds, and hidden surprises. Children can interact with characters, discover easter eggs, learn vocabulary, and play mini-games within the story narrative.

## Features

### 1. Clickable Characters

Characters respond to clicks with animations, sounds, and dialogue.

**Syntax:**
```markdown
[[character:name:action:x=50%:y=30%]]
```

**Examples:**
```markdown
[[character:bruno:wave:x=20%:y=60%]]
[[character:mila:flutter:x=70%:y=30%]]
[[character:default:bounce:x=50%:y=50%]]
```

**Available Actions:**
- `wave` - Character waves hello
- `jump` - Character jumps with joy
- `dance` - Character dances
- `speak` - Character speaks
- `hide` - Character hides
- `bounce` - Character bounces
- `wiggle` - Character wiggles
- `spin` - Character spins

**Predefined Characters:**
- `bruno` (bear) - Has custom reactions and sounds
- `mila` (owl) - Flutters and hoots
- `default` - Generic animal behavior

### 2. Animated Elements

Elements that move or animate automatically or on interaction.

**Syntax:**
```markdown
[[animate:element:type:duration=3s]]
```

**Examples:**
```markdown
[[animate:butterfly:flutter:duration=3s]]
[[animate:clouds:drift:duration=60s]]
[[animate:trees:sway:duration=2s]]
[[animate:stars:glow]]
```

**Animation Types:**
- `bounce` - Bounces up and down
- `wiggle` - Wiggles side to side
- `shake` - Shakes rapidly
- `spin` - Spins 360 degrees
- `float` - Floats gently (infinite)
- `drift` - Drifts across screen (infinite)
- `sway` - Sways like trees (infinite)
- `pulse` - Pulses scale (infinite)
- `glow` - Glowing effect (infinite)
- `shimmer` - Shimmer effect (infinite)
- `fade-in` - Fades in
- `fade-out` - Fades out
- `slide` - Slides in from left
- `zoom` - Zooms in
- `flutter` - Flutter like butterfly
- `path` - Follows a path

### 3. Interactive Vocabulary

Words that show definitions and translations when clicked.

**Syntax:**
```markdown
**[word]**
```

**Example:**
```markdown
Bruno walked through the **[enchanted]** forest.
The **[brave]** little bear climbed the tree.
```

**Features:**
- Shows definition popup on click
- Displays translations in multiple languages
- TTS pronunciation on demand
- Touch-friendly for mobile

### 4. Easter Eggs

Hidden surprises that reward exploration.

**Syntax:**
```markdown
[[easter-egg:id=unique-id:x=50%:y=30%]]
```

**Examples:**
```markdown
[[easter-egg:id=star1:x=30%:y=40%]]
[[easter-egg:id=secret-coin:x=85%:y=15%]]
[[easter-egg:id=bonus-star:x=50%:y=50%]]
```

**Features:**
- Nearly invisible until discovered
- Plays discovery sound and confetti
- Awards collectibles (stars, coins, badges)
- Tracks progress in localStorage
- Celebrates when all eggs found

### 5. Sound Effects

Ambient and triggered sounds.

**Syntax:**
```markdown
[[sound:name:loop=true|false]]
```

**Examples:**
```markdown
[[sound:birds:loop=true]]
[[sound:owl-hoot]]
[[sound:magic-sparkle]]
```

**Available Sounds:**
- `birds` / `bird-chirp` - Bird sounds
- `owl-hoot` - Owl hooting
- `magic-sparkle` - Magical sparkle
- `bounce` - Bounce sound
- `pop` - Pop sound
- `whoosh` - Whoosh sound
- `discovery` - Discovery fanfare

### 6. Mini-Games

Interactive challenges within stories.

**Syntax:**
```markdown
[[mini-game:type:correct=answer:reward=star]]
```

**Game Types:**

#### Count Objects
```markdown
[[mini-game:count:correct=5:reward=star]]
```
Children count objects in the scene.

#### Find Hidden Items
```markdown
[[mini-game:find:correct=hidden-mouse:reward=coin]]
```
Find a specific hidden object.

#### Drag and Sort
```markdown
[[mini-game:drag-sort:correct=["item1","item2","item3"]:reward=badge]]
```
Drag items to correct locations.

#### Color Matching
```markdown
[[mini-game:color-match:correct=["red","blue","green"]:reward=sticker]]
```
Match colors or patterns.

#### Pattern Recognition
```markdown
[[mini-game:pattern:correct=option3:reward=star]]
```
Complete a pattern sequence.

## File Structure

```
src/
├── utils/
│   ├── story-interactions.ts       # Core interaction system
│   └── sound-effects.ts            # Enhanced sound effects
├── animations/
│   └── story-animations.ts         # Animation library
├── components/
│   ├── InteractiveElement.astro    # Base interactive element
│   ├── VocabularyTooltip.astro     # Vocabulary tooltips
│   ├── EasterEgg.astro             # Easter egg component
│   └── MiniGame.astro              # Mini-game component
└── styles/
    └── story-animations.css        # Animation styles
```

## Usage in Stories

### Basic Interactive Story

```markdown
---
title: "Bruno's Adventure"
storyFormat: "interactive"
pages:
  - text: "Bruno walked through the forest. [[character:bruno:wave:x=50%:y=50%]]"
    image: "/images/bruno-forest.png"
  - text: "He found a **[magical]** star! [[easter-egg:id=star1:x=60%:y=40%]]"
    image: "/images/bruno-star.png"
---

## Vocabulary
**magical**: special and wonderful
```

### Advanced Interactive Story

```markdown
---
title: "The Enchanted Forest"
storyFormat: "interactive"
pages:
  - text: "The **[ancient]** trees swayed gently. [[animate:trees:sway]] Birds sang sweetly. [[sound:birds:loop=true]]"
    image: "/images/forest.png"
  - text: "Bruno met Mila! [[character:bruno:wave:x=30%:y=60%]] [[character:mila:flutter:x=70%:y=30%]]"
    image: "/images/meeting.png"
  - text: "Can you find all 3 hidden stars? [[easter-egg:id=s1:x=20%:y=30%]] [[easter-egg:id=s2:x=80%:y=50%]] [[easter-egg:id=s3:x=50%:y=70%]]"
    image: "/images/search.png"
---
```

## Component Usage

### In Astro Pages

```astro
---
import InteractiveElement from '@components/InteractiveElement.astro';
import VocabularyTooltip from '@components/VocabularyTooltip.astro';
import EasterEgg from '@components/EasterEgg.astro';
import MiniGame from '@components/MiniGame.astro';
import { InteractiveParser } from '@utils/story-interactions';

const storyText = "Bruno waved [[character:bruno:wave:x=50%:y=50%]]";
const parsed = InteractiveParser.parseAll(storyText);
---

<!-- Render interactive elements -->
{parsed.characters.map(char => (
  <InteractiveElement element={char} storyId="bruno-adventure">
    <img src="/bruno.png" alt="Bruno" />
  </InteractiveElement>
))}

<!-- Vocabulary -->
<VocabularyTooltip vocabulary={parsed.vocabulary} locale="de" />

<!-- Easter Eggs -->
{parsed.easterEggs.map(egg => (
  <EasterEgg egg={egg} storyId="bruno-adventure" icon="⭐" />
))}

<!-- Mini-Game -->
<MiniGame
  game={{
    id: 'count-apples',
    type: 'count',
    question: 'How many apples?',
    correctAnswer: 5,
    reward: 'star'
  }}
  storyId="bruno-adventure"
>
  <div slot="objects">
    {Array(5).fill(0).map(() => <span>🍎</span>)}
  </div>
</MiniGame>
```

## JavaScript API

### Sound Effects

```typescript
import { soundEffects } from '@utils/sound-effects';

// Play sounds
soundEffects.playBounce();
soundEffects.playCharacterWave();
soundEffects.playDiscovery();
soundEffects.play('magic-sparkle');

// Toggle sounds
soundEffects.toggle();
soundEffects.isEnabled(); // true/false
```

### Animations

```typescript
import { applyAnimation, createConfetti, triggerHaptic } from '@animations/story-animations';

// Apply animation
const element = document.querySelector('.character');
await applyAnimation(element, 'bounce');

// Confetti
createConfetti(element, 30);

// Haptic feedback
triggerHaptic('medium');
```

### Character Reactions

```typescript
import { characterReactions } from '@utils/story-interactions';

// Get reaction
const reaction = characterReactions.getReaction('bruno', 'wave');
// { character: 'bruno', action: 'wave', sound: 'character-wave', dialogue: 'Hallo! 👋', duration: 1000 }

// Add custom reaction
characterReactions.addReaction('felix', {
  character: 'felix',
  action: 'jump',
  sound: 'character-jump',
  dialogue: 'Yay!',
  duration: 800
});
```

### Easter Egg Manager

```typescript
import { EasterEggManager } from '@utils/story-interactions';

const manager = new EasterEggManager('bruno-adventure');

manager.addEgg({
  id: 'star1',
  position: { x: '50%', y: '30%' },
  reward: 'star',
  discovered: false
});

manager.discover('star1'); // Returns true if newly discovered
manager.getDiscoveredCount(); // 1
manager.isComplete(); // false
```

### Collectibles Manager

```typescript
import { collectiblesManager } from '@utils/story-interactions';

// Add collectible
collectiblesManager.add({
  id: 'star-001',
  type: 'star',
  name: 'Golden Star',
  storyId: 'bruno-adventure',
  timestamp: Date.now()
});

// Get collectibles
collectiblesManager.getAll(); // All collectibles
collectiblesManager.getByStory('bruno-adventure'); // Story-specific
collectiblesManager.getStarCount(); // Count of stars
```

## Styling

### Custom Animations

Add to your component:

```astro
<style>
  .my-element {
    animation: bounce 0.6s ease;
  }

  .my-element:hover {
    animation: wiggle 0.5s ease;
  }
</style>
```

### Override Defaults

```css
:root {
  --animation-duration: 0.6s;
  --animation-timing: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.interactive-element {
  transition-duration: var(--animation-duration);
}
```

## Accessibility

All interactive elements support:

- **Keyboard navigation**: Tab, Enter, Space
- **Screen readers**: ARIA labels and roles
- **Focus indicators**: Visible outlines
- **Reduced motion**: Respects `prefers-reduced-motion`
- **Touch targets**: Minimum 44x44px on mobile

## Performance

- Lazy load animations
- Debounce click handlers
- Optimize SVG complexity
- Use CSS animations where possible
- Limit concurrent sounds
- Cache parsed interactions

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Web Audio API for sounds
- Web Speech API for TTS
- LocalStorage for progress
- Vibration API for haptics (mobile)

## Examples

See example stories:
- `/src/content/stories/de/001-bruno-super-interactive.md`
- `/src/content/stories/de/001-bruno-interactive.md`

## Future Enhancements

- [ ] SVG path-based animations
- [ ] More mini-game types
- [ ] Custom sound effects upload
- [ ] Interactive story builder UI
- [ ] Multi-character dialogues
- [ ] Branching story paths
- [ ] Achievement system integration
- [ ] Story sharing features

## Troubleshooting

**Sounds not playing?**
- Browser requires user interaction first
- Check `soundEffects.isEnabled()`
- Verify Web Audio API support

**Animations not working?**
- Check browser support for CSS animations
- Verify element has proper class
- Check `prefers-reduced-motion` setting

**Easter eggs not saving?**
- Check localStorage permissions
- Verify storyId is consistent
- Clear browser cache if needed

## Contributing

To add new features:

1. Add types to `story-interactions.ts`
2. Create component in `components/`
3. Add animations to `story-animations.ts`
4. Update documentation
5. Test on mobile and desktop
6. Verify accessibility

---

**Last Updated**: 2025-11-05
**Version**: 1.0.0
