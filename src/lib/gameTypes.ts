// Shared runtime types for the adventure screen.
// These replace the `any[]` state buckets that used to live inside GameScreen.
import { generateSummon } from "@/lib/summonGenerator";

/** The generated world the run takes place in (difficulty is chosen separately). */
export interface WorldData {
  timeline: string;
  seed?: string | number;
  name?: string;
  terrain?: string;
  mainFaction?: string;
  dangerLevel?: number;
  /** 1 (Basic) … 5 (Impossible) — chosen on the difficulty screen. */
  difficulty?: number;
  // Older saves and the world generator screen carry extra ad-hoc fields.
  [key: string]: any;
}

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
