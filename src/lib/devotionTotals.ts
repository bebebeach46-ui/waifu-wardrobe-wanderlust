import type { rollDevotionEvents, tickRivalries } from "@/lib/companionBondBonuses";

type DevotionEvent = ReturnType<typeof rollDevotionEvents>[number];
type RivalryEvent = ReturnType<typeof tickRivalries>["events"][number];

export interface DevotionTotals {
  perfBoost: number;
  fame: number;
  gold: number;
  healSeverity: number;
  bondReciprocals: Record<string, number>;
}

/** Fold devotion events into one set of per-quest bonuses. */
export function sumDevotion(events: DevotionEvent[]): DevotionTotals {
  const t: DevotionTotals = { perfBoost: 0, fame: 0, gold: 0, healSeverity: 0, bondReciprocals: {} };
  for (const ev of events) {
    t.perfBoost += ev.effect.perfBoost || 0;
    t.fame += ev.effect.fame || 0;
    t.gold += ev.effect.gold || 0;
    t.healSeverity += ev.effect.healWoundSeverity || 0;
    if (ev.effect.bondBoost) {
      t.bondReciprocals[ev.companionName] = (t.bondReciprocals[ev.companionName] || 0) + ev.effect.bondBoost;
    }
  }
  return t;
}

/** Fold rivalry events into performance and fame boosts. */
export function sumRivalry(events: RivalryEvent[]): { perfBoost: number; fame: number } {
  let perfBoost = 0, fame = 0;
  for (const re of events) { perfBoost += re.perfBoost; fame += re.fameBoost; }
  return { perfBoost, fame };
}

/** Reduce the worst wound by `amount` severity; removes it when it reaches 0. */
export function healWorstWound<W extends { id: string | number; severity: number }>(wounds: W[], amount: number): W[] {
  if (amount <= 0 || wounds.length === 0) return wounds;
  const worst = [...wounds].sort((a, b) => b.severity - a.severity)[0];
  const newSev = Math.max(0, worst.severity - amount);
  if (newSev <= 0) return wounds.filter(w => w.id !== worst.id);
  return wounds.map(w => w.id === worst.id
    ? { ...w, severity: newSev, painLevel: newSev, bleedingRate: newSev >= 4 ? Math.floor(newSev / 2) : 0 }
    : w);
}
