// Shared runtime types for the adventure screen.
// These replace the `any[]` state buckets that used to live inside GameScreen.
import { generateSummon } from "@/lib/summonGenerator";
import { generateWorld } from "@/lib/worldGenerator";

/** The generated world the run takes place in (difficulty is chosen separately). */
export type WorldData = ReturnType<typeof generateWorld> & {
  difficulty?: number;
  // Older saves carried extra ad-hoc world fields.
  [key: string]: any;
};

/** A summoned ally earned from shard collection. */
export type Summon = ReturnType<typeof generateSummon>;

/** A temporary consumable buff bought from the shop. */
export interface ActiveEffect {
  type: string;
  name?: string;
  icon?: string;
  description?: string;
  /** Epoch ms when the buff wears off. */
  endTime?: number;
  value?: number;
  [key: string]: any;
}
