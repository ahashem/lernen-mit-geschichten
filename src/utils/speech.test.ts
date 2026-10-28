import { describe, it, expect } from 'vitest';
import { withoutEmoji } from './speech';

describe('withoutEmoji', () => {
  it('drops an emoji that follows a word', () => {
    expect(withoutEmoji('Kekse. 🍪')).toBe('Kekse.');
  });

  it('leaves nothing of an emoji-only word, including joined, toned and flag emoji', () => {
    for (const word of ['🦖✨', '👨‍👩‍👧', '👋🏽', '❤️', '🇩🇪']) {
      expect(withoutEmoji(word)).toBe('');
    }
  });

  it('keeps digits and symbols that Unicode also counts as emoji parts', () => {
    expect(withoutEmoji('Seite 12, #3*!')).toBe('Seite 12, #3*!');
  });

  it('keeps the text of every reader language', () => {
    expect(withoutEmoji('„Hallo“ – ja…')).toBe('„Hallo“ – ja…');
    expect(withoutEmoji('Güzel 😉')).toBe('Güzel');
    expect(withoutEmoji('مرحبا 🌟')).toBe('مرحبا');
    expect(withoutEmoji('شکریہ 💖')).toBe('شکریہ');
  });
});
