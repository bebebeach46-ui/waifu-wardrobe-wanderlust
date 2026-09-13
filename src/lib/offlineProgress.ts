// Progress-Quest style offline catch-up.
// While the tab is closed the hero keeps adventuring; on load we fast-forward
// the quests that "would have" completed and grant a reduced share of rewards.

const MAX_OFFLINE_MS = 8 * 60 * 60 * 1000; // credit at most 8 hours
const MAX_OFFLINE_QUESTS = 250;
const OFFLINE_EFFICIENCY = 0.6; // unattended questing is less rewarding

export interface OfflineProgress {
  elapsedMs: number;
  quests: number;
  gold: number;
  exp: number;
  summary: string;
}

/**
 * Live quest ticks add ((100 / duration) * 0.4) every 100ms,
 * so a single quest takes duration * 0.25 seconds of real time.
 */
export const questRealSeconds = (duration: number) =>
  Math.max(1, (duration || 20) * 0.25);

export const computeOfflineProgress = (saved: {
  timestamp?: number;
  currentQuest?: { duration?: number; goldReward?: number; expReward?: number };
} | null): OfflineProgress | null => {
  if (!saved?.timestamp) return null;

  const elapsedMs = Math.min(MAX_OFFLINE_MS, Date.now() - saved.timestamp);
  if (elapsedMs < 60_000) return null; // under a minute away: nothing to credit

  const perQuestSec = questRealSeconds(saved.currentQuest?.duration ?? 20);
  const quests = Math.min(
    MAX_OFFLINE_QUESTS,
    Math.floor(elapsedMs / 1000 / perQuestSec)
  );
  if (quests < 1) return null;

  const gold = Math.floor((saved.currentQuest?.goldReward ?? 10) * quests * OFFLINE_EFFICIENCY);
  const exp = Math.floor((saved.currentQuest?.expReward ?? 10) * quests * OFFLINE_EFFICIENCY);

  const hours = Math.floor(elapsedMs / 3_600_000);
  const minutes = Math.floor((elapsedMs % 3_600_000) / 60_000);
  const away = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  return {
    elapsedMs,
    quests,
    gold,
    exp,
    summary: `While you were away (${away}) the hero finished ${quests} quest${quests === 1 ? "" : "s"}, earning ${gold} gold and ${exp} exp.`,
  };
};
