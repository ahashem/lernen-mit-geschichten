import { describe, it, expect } from 'vitest';
import { bestVoice, withoutEmoji } from './speech';

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

describe('bestVoice', () => {
  const voice = (name: string, lang: string) => ({ name, lang });

  it('prefers a natural, enhanced or premium voice for the language', () => {
    const voices = [
      voice('Google العربية', 'ar-SA'),
      voice('Microsoft Hamed Online (Natural) - Arabic (Saudi Arabia)', 'ar-SA'),
    ];
    expect(bestVoice(voices, 'ar')?.name).toContain('Natural');
    expect(
      bestVoice([voice('Maged', 'ar-SA'), voice('Majed (Enhanced)', 'ar_SA')], 'ar')?.name
    ).toBe('Majed (Enhanced)');
  });

  it('falls back to the first voice for the language', () => {
    expect(bestVoice([voice('Anna', 'de-DE'), voice('Uzma', 'ur-PK')], 'ur')?.name).toBe('Uzma');
  });

  it("never picks another language's voice, however good", () => {
    expect(bestVoice([voice('Microsoft Katja Online (Natural)', 'de-DE')], 'ar')).toBeNull();
  });
});
