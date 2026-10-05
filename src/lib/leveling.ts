/** Each next level needs 60% more XP than the previous one. */
export const EXP_GROWTH = 1.6;

export function nextExpToNext(expToNext: number): number {
  return Math.floor(expToNext * EXP_GROWTH);
}

/** Apply one quest's XP; at most one level gained per quest. */
export function applyQuestExp(s: { level: number; exp: number; expToNext: number }, newExp: number) {
  const leveledUp = newExp >= s.expToNext;
  return {
    leveledUp,
    level: leveledUp ? s.level + 1 : s.level,
    exp: leveledUp ? newExp - s.expToNext : newExp,
    expToNext: leveledUp ? nextExpToNext(s.expToNext) : s.expToNext,
  };
}

/** Apply a lump of XP (offline catch-up); may gain several levels. */
export function applyBulkExp(level: number, exp: number, expToNext: number) {
  while (exp >= expToNext) { exp -= expToNext; level += 1; expToNext = nextExpToNext(expToNext); }
  return { level, exp, expToNext };
}
