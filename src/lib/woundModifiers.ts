import { Wound } from "@/lib/woundSystem";

/** Re-derive the numbers that depend on severity (bleeding, pain, healing time). */
const withSeverity = (wound: Wound, severity: number): Wound => {
  const s = Math.max(1, Math.min(10, severity)) as Wound["severity"];
  return {
    ...wound,
    severity: s,
    bleedingRate: s >= 4 ? Math.floor(s / 2) : 0,
    painLevel: s,
    healingTime: s * 10,
  };
};

export interface WoundModifierResult {
  wound: Wound;
  /** Set when a hostile companion made the wound worse. */
  worsened?: { by: number; saboteur?: string };
  /** Set when a healer companion softened the wound. */
  mitigated?: { by: number; healer?: string };
}

/**
 * Applies the party's influence to a freshly rolled wound:
 * first hostile sabotage worsens it, then healer bonuses soften it.
 * A softened wound is never fatal.
 */
export const applyPartyWoundModifiers = (
  wound: Wound,
  sabotage: number,
  saboteur: string | undefined,
  reduction: number,
  healer: string | undefined
): WoundModifierResult => {
  let w = wound;
  const result: WoundModifierResult = { wound: w };

  if (sabotage > 0 && w.severity < 10) {
    const before = w.severity;
    w = withSeverity(w, before + sabotage);
    if (w.severity > before) result.worsened = { by: sabotage, saboteur };
  }

  if (reduction > 0 && w.severity > 1) {
    const before = w.severity;
    w = withSeverity(w, before - reduction);
    if (w.severity < before) {
      w = { ...w, isFatal: false };
      result.mitigated = { by: reduction, healer };
    }
  }

  result.wound = w;
  return result;
};
