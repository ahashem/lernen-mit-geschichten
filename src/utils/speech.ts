const EMOJI = /[\p{Extended_Pictographic}\p{Emoji_Modifier}\p{Regional_Indicator}‍️⃣]/gu;

/** Text as the device voice should say it: emoji are for the eye, not the ear. */
export const withoutEmoji = (text: string) => text.replace(EMOJI, '').trim();
