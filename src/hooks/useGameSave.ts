import { useCallback, useEffect, useRef } from "react";

/**
 * Owns everything about persisting a run to local storage:
 *  - a ref of the latest snapshot so saves never write stale state
 *  - a debounced save (1s) whenever meaningful progress changes
 *  - a 60s heartbeat save
 *  - a save on tab close / navigating away
 *
 * A dead hero is never written back, so the slot can be cleared on death.
 */
export const useGameSave = (
  saveSlot: number,
  snapshot: Record<string, any>,
  isDead: boolean,
  /** Cheap string of the values that should trigger a debounced save. */
  saveKey: string
) => {
  const snapshotRef = useRef(snapshot);
  snapshotRef.current = snapshot;

  const performSave = useCallback(() => {
    const data = { ...snapshotRef.current, timestamp: Date.now() };
    try {
      localStorage.setItem(`quest-idle-slot-${saveSlot}`, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save game:", e);
      return null;
    }
    return data;
  }, [saveSlot]);

  // Debounced progress save — protects against tab crashes.
  useEffect(() => {
    if (isDead) return;
    const t = setTimeout(performSave, 1000);
    return () => clearTimeout(t);
  }, [saveKey, isDead, performSave]);

  // Heartbeat save.
  useEffect(() => {
    if (isDead) return;
    const interval = setInterval(performSave, 60000);
    return () => clearInterval(interval);
  }, [isDead, performSave]);

  // Save when the tab closes or the screen unmounts.
  useEffect(() => {
    const onUnload = () => {
      if (!isDead) performSave();
    };
    window.addEventListener("beforeunload", onUnload);
    return () => {
      window.removeEventListener("beforeunload", onUnload);
      if (!isDead) performSave();
    };
  }, [performSave, isDead]);

  return performSave;
};
