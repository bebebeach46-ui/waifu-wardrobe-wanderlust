import type { rollSabotageEvents } from "@/lib/companionBondBonuses";

type SabotageEvent = ReturnType<typeof rollSabotageEvents>["events"][number];

export interface SabotageTotals {
  perfPenalty: number;
  fameLoss: number;
  goldLoss: number;
  addSeverity: number;
  poison: boolean;
}

/** Sum the effects of this quest's sabotage events into one set of penalties. */
export const sumSabotage = (events: SabotageEvent[]): SabotageTotals =>
  events.reduce<SabotageTotals>(
    (t, ev) => ({
      perfPenalty: t.perfPenalty + (ev.effect.perfPenalty || 0),
      fameLoss: t.fameLoss + (ev.effect.fameLoss || 0),
      goldLoss: t.goldLoss + (ev.effect.goldLoss || 0),
      addSeverity: t.addSeverity + (ev.effect.addWoundSeverity || 0),
      poison: t.poison || !!ev.effect.triggerPoison,
    }),
    { perfPenalty: 0, fameLoss: 0, goldLoss: 0, addSeverity: 0, poison: false }
  );
