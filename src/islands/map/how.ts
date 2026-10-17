// How land was taken: the categories the map colors by. Every category also has a line pattern
// and a written label, so color is never the only signal.
export const HOW_ORDER = [
  'treaty',
  'pressure',
  'removal',
  'unratified',
  'congress',
  'executive',
  'unknown',
] as const;
export type How = (typeof HOW_ORDER)[number];

export const HOW_LABEL: Record<How, string> = {
  treaty: 'Treaty or agreement',
  pressure: 'Treaty under documented pressure',
  removal: 'Removal treaty',
  unratified: 'Unratified treaty',
  congress: 'Act of Congress',
  executive: 'Executive order',
  unknown: 'Not stated',
};

export const HOW_HELP: Record<How, string> = {
  treaty:
    'A ratified treaty or agreement. Many were signed under unequal terms; the record of each says what is known.',
  pressure:
    'A treaty where sources document coercion, fraud, disputed signers, debts or military pressure.',
  removal: 'A treaty that required a nation to leave its homeland and move west.',
  unratified:
    'A treaty the Senate never ratified; the United States treated the land as taken anyway (for example California, 1851–52).',
  congress:
    'Taken by statute, including agreements ratified by Congress after treaty-making ended in 1871.',
  executive: 'Set aside or taken by a president’s executive order.',
  unknown: 'Royce gives no treaty, statute or order for this area.',
};

/** MapLibre line-dasharray per category (a second cue beside color). */
export const HOW_DASH: Record<How, number[]> = {
  treaty: [3, 1.5],
  pressure: [1, 1],
  removal: [4, 1, 1, 1],
  congress: [6, 1.5],
  unratified: [2, 2, 6, 2],
  executive: [1, 2.5],
  unknown: [0.5, 2],
};
