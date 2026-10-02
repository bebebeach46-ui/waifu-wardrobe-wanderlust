import { Dispatch, SetStateAction, useEffect } from "react";
import { ACTIVE_COMPANION_SLOTS, calculateCompatibility, Companion, getBondLevelCap } from "@/lib/companionGenerator";
import type { ThrottledToastOptions } from "@/hooks/useThrottledToast";

interface RosterDeps {
  companions: Companion[];
  reserveCompanions: Companion[];
  setCompanions: Dispatch<SetStateAction<Companion[]>>;
  setReserveCompanions: Dispatch<SetStateAction<Companion[]>>;
  character: { race: string; class: string };
  lifeSkills: any[];
  fame: number;
  toast: (opts: ThrottledToastOptions) => void;
}

/**
 * Keeps the active party healthy:
 *  - once on load, older saved companions get a compatibility + bond cap
 *  - whenever an active slot opens, the newest reserve companion is promoted
 */
export const useCompanionRoster = ({
  companions, reserveCompanions, setCompanions, setReserveCompanions, character, lifeSkills, fame, toast,
}: RosterDeps) => {
  useEffect(() => {
    if (!companions.some(c => c.bondCap === undefined || c.compatibility === undefined)) return;
    setCompanions(companions.map((comp, index) => {
      if (comp.bondCap !== undefined && comp.compatibility !== undefined) return comp;
      const compatibility = comp.compatibility ?? calculateCompatibility(comp, character.race, character.class, lifeSkills);
      const bondCap = comp.bondCap ?? getBondLevelCap(index, compatibility, companions, fame);
      return { ...comp, compatibility, bondCap };
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (companions.length >= ACTIVE_COMPANION_SLOTS || reserveCompanions.length === 0) return;
    const slotsOpen = ACTIVE_COMPANION_SLOTS - companions.length;
    const promoting = reserveCompanions.slice(-slotsOpen); // newest reserve first (LIFO)
    setCompanions(c => [...c, ...promoting]);
    setReserveCompanions(reserveCompanions.slice(0, -slotsOpen));
    promoting.forEach(p =>
      toast({ title: `🔄 ${p.name} joined the active party`, description: "Promoted from reserve to fill an empty slot", duration: 5000 })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companions.length, reserveCompanions]);
};
