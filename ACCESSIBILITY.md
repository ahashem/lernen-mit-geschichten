# Accessibility Features

This project includes comprehensive accessibility features designed for children with different learning needs, including dyslexia, ADHD, and visual impairments.

## How to Access

1. **Via Navigation**: Click the accessibility button (♿) in the main navigation
2. **Via Floating Button**: Click the green floating button in the bottom-right corner
3. **Via Keyboard**: Press `Alt+A` anywhere on the site

## Features Overview

### Quick Presets

Three preset configurations for common accessibility needs:

- **Dyslexia-Friendly**: OpenDyslexic font, increased spacing, larger text, text highlighting
- **ADHD-Friendly**: Focus mode, reduced distractions, calm colors, no animations
- **Visual Impairment**: High contrast, large text, reading ruler, text highlighting

### Font Options

- **Dyslexia-Friendly Font**: Switch to OpenDyslexic font
- **Font Size**: Adjust from 14px to 32px
- **Letter Spacing**: Increase space between letters (0em to 0.5em)
- **Word Spacing**: Increase space between words (0em to 0.5em)
- **Line Height**: Adjust line spacing (1.2 to 2.5)

### Color & Contrast

**Color Themes:**
- Default
- High Contrast (Black on White)
- High Contrast (Yellow on Black)
- Blue-Friendly (soft blue tones)
- Warm Tones (beige and brown)
- Pastel (soft purple)
- Dark Mode

**Colorblind Modes:**
- Protanopia (Red-Blind) simulation
- Deuteranopia (Green-Blind) simulation
- Tritanopia (Blue-Blind) simulation

### Reading Aids

- **Reading Ruler**: Horizontal line that follows your mouse to help track lines
- **Focus Mode**: Dims all text except the paragraph you're hovering over
- **Text Highlight**: Highlights text on hover with yellow background
- **Remove Distractions**: Fades headers, footers, and decorative elements
- **Reduce Motion**: Disables all animations and transitions

## Persistence

All accessibility preferences are automatically saved to your browser's local storage and will be restored when you return to the site.

## Keyboard Shortcuts

- `Alt+A`: Toggle accessibility panel

## Technical Implementation

### Files

- `/src/components/AccessibilityPanel.astro`: Main accessibility control panel
- `/src/utils/accessibility.ts`: Preference management and application logic
- `/src/styles/accessibility-themes.css`: Theme and mode styles

### CSS Custom Properties

The accessibility system uses CSS custom properties that can be adjusted:

```css
--a11y-letter-spacing
--a11y-word-spacing
--a11y-line-height
--a11y-font-family
--a11y-bg-color
--a11y-text-color
--a11y-link-color
```

### Presets Configuration

Presets are defined in `/src/utils/accessibility.ts`:

```typescript
export const presets = {
  'dyslexia-friendly': { ... },
  'adhd-friendly': { ... },
  'visual-impairment': { ... }
}
```

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- OpenDyslexic font loaded from CDN
- localStorage required for preference persistence
- CSS filters for colorblind simulation (may not work in older browsers)

## Best Practices for Educators

### For Children with Dyslexia
1. Enable "Dyslexia-Friendly" preset
2. Adjust font size based on child's comfort
3. Use text highlighting to follow along while reading aloud

### For Children with ADHD
1. Enable "ADHD-Friendly" preset
2. Use focus mode to reduce overwhelm
3. Enable "Remove Distractions" mode
4. Turn on "Reduce Motion" to minimize stimulation

### For Children with Visual Impairments
1. Enable "Visual Impairment" preset
2. Choose high contrast theme (black or yellow)
3. Increase font size to maximum
4. Use reading ruler to track lines

### For General Use
1. Adjust font size for younger children (larger)
2. Use reading ruler for guided reading
3. Enable text highlighting for group reading sessions
4. Print-friendly mode automatically removes all accessibility controls

## Testing

The accessibility features have been tested for:

- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader compatibility (NVDA, JAWS)
- Cross-browser compatibility
- Mobile responsiveness

## Future Enhancements

Planned features:
- Bionic reading mode (bolding first letters)
- Custom color picker
- Font family selection beyond OpenDyslexic
- Audio descriptions for interactive content
- Gesture controls for mobile devices

## Support

For issues or feature requests related to accessibility:
- Open an issue on GitHub
- Include browser version and accessibility setting used
- Describe the specific challenge faced

---

**Last Updated**: 2025-11-05
