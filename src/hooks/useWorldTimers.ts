import { Dispatch, SetStateAction, useEffect } from "react";
import { addDiscovery, Codex, generateLoreEntry } from "@/lib/codexSystem";
import { generateEventLog, Event } from "@/lib/eventLogGenerator";
import { ActiveEffect, WorldData } from "@/lib/gameTypes";
import type { ThrottledToastOptions } from "@/hooks/useThrottledToast";

interface WorldTimerDeps {
  isDead: boolean;
  worldData: WorldData;
  setEventLog: Dispatch<SetStateAction<Event[]>>;
  setCodex: Dispatch<SetStateAction<Codex>>;
  setActiveEffects: Dispatch<SetStateAction<ActiveEffect[]>>;
  toast: (opts: ThrottledToastOptions) => void;
}

/**
 * Background timers that run alongside the quest loop:
 *  - a world event every 2 minutes (with a 30% chance of new lore)
 *  - expiry of shop buffs every second
 * Both stop while the hero is dead.
 */
export const useWorldTimers = ({ isDead, worldData, setEventLog, setCodex, setActiveEffects, toast }: WorldTimerDeps) => {
  useEffect(() => {
    if (isDead) return;
    const interval = setInterval(() => {
      const newEvent = generateEventLog();
      setEventLog(prev => [newEvent, ...prev].slice(0, 10));
      setCodex(prev => addDiscovery(prev, "event", `event_${Date.now()}`, "World Event", newEvent.text, { sentiment: newEvent.sentiment }));
      if (Math.random() < 0.3) {
        const lore = generateLoreEntry(worldData);
        setCodex(prev => addDiscovery(prev, "lore", lore.id, lore.name, lore.description));
      }
    }, 120000);
    return () => clearInterval(interval);
  }, [isDead, worldData, setEventLog, setCodex]);

  useEffect(() => {
    if (isDead) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setActiveEffects(prev => {
        const remaining = prev.filter(e => !e.endTime || e.endTime > now);
        if (remaining.length < prev.length) {
          toast({ title: "Buff Expired", description: "Some effects have worn off" });
        }
        return remaining;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isDead, toast, setActiveEffects]);
};
