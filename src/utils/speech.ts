const EMOJI =
  /[\p{Extended_Pictographic}\p{Emoji_Modifier}\p{Regional_Indicator}\u200d\ufe0f\u20e3]/gu;
const QUALITY_NAME = /\b(natural|enhanced|premium)\b/i;

/** Text as the device voice should say it: emoji are for the eye, not the ear. */
export const withoutEmoji = (text: string) => text.replace(EMOJI, '').trim();

/** The voice for a language, preferring named higher-quality ones (Edge online, Apple enhanced). */
export const bestVoice = <V extends { lang: string; name: string }>(
  voices: V[],
  locale: string
) => {
  const matches = voices.filter(v => v.lang.toLowerCase().split(/[-_]/)[0] === locale);
  return matches.find(v => QUALITY_NAME.test(v.name)) ?? matches[0] ?? null;
};
