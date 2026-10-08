/** Perpetual: deaths are historical close calls, endless lineage. Campaign: real death and a 50-heir victory. */
export type GameMode = "perpetual" | "campaign";

export const CAMPAIGN_HEIR_GOAL = 50;

export const getGameMode = (world: { gameMode?: unknown } | null | undefined): GameMode =>
  world?.gameMode === "campaign" ? "campaign" : "perpetual";
