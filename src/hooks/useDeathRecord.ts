import { useReducer, useCallback } from "react";
import type { FateOutcome } from "@/lib/fateSystem";
import type { DeathCause } from "@/lib/deathCauses";
import type { Wound } from "@/lib/woundSystem";

/** All "how/why did the hero (almost) die" state, kept in one reducer. */
export interface DeathRecord {
  isDead: boolean;
  deathLog: string;
  fateOutcome: FateOutcome | null;
  deathCause: DeathCause | null;
  fatalWound: Wound | null;
}

type Action =
  | { type: "set"; patch: Partial<DeathRecord> }
  | { type: "clearCause" }
  | { type: "reset" };

const INITIAL: DeathRecord = { isDead: false, deathLog: "", fateOutcome: null, deathCause: null, fatalWound: null };

function reducer(state: DeathRecord, a: Action): DeathRecord {
  switch (a.type) {
    case "set": return { ...state, ...a.patch };
    case "clearCause": return { ...state, deathCause: null, fateOutcome: null, fatalWound: null };
    case "reset": return INITIAL;
  }
}

export function useDeathRecord() {
  const [record, dispatch] = useReducer(reducer, INITIAL);
  const set = useCallback((patch: Partial<DeathRecord>) => dispatch({ type: "set", patch }), []);
  return {
    ...record,
    setIsDead: useCallback((v: boolean) => set({ isDead: v }), [set]),
    setDeathLog: useCallback((v: string) => set({ deathLog: v }), [set]),
    setFateOutcome: useCallback((v: FateOutcome | null) => set({ fateOutcome: v }), [set]),
    setDeathCause: useCallback((v: DeathCause | null) => set({ deathCause: v }), [set]),
    setFatalWound: useCallback((v: Wound | null) => set({ fatalWound: v }), [set]),
    clearDeathCause: useCallback(() => dispatch({ type: "clearCause" }), []),
    resetDeath: useCallback(() => dispatch({ type: "reset" }), []),
  };
}
