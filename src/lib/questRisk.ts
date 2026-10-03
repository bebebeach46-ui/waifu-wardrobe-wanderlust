import { Companion, isCompanionThreat } from "@/lib/companionGenerator";

// Base death chance per quest, indexed by difficulty 1 (Basic) … 5 (Impossible).
const BASE_DIFFICULTY_RATES = [0, 0.001, 0.005, 0.01, 0.02, 0.04];

export interface QuestRisk {
  /** Death chance from difficulty, level and quest count, plus hostile-companion plots. */
  deathChance: number;
  /** The part of deathChance caused by hostile companions in dangerous areas. */
  companionPlot: number;
  /** The most dangerous hostile companion in the party, if any. */
  topThreat: Companion | null;
  topThreatBonus: number;
}

/**
 * How likely the hero is to die on this quest (before nemesis maluses).
 *
 * Examples:
 *  - Level 1, Basic, 0 quests: ~0.03%
 *  - Level 1, Impossible, 0 quests: ~1.33%
 *  - Level 10, Adventurer, 50 quests: ~0.6%
 *  - Level 20+, Hero, 100 quests: ~1.8%
 * Hostile companions (bond ≤ -5) add up to ~6% in max-danger areas.
 */
export const computeQuestRisk = (opts: {
  difficulty: number;
  level: number;
  questsCompleted: number;
  areaDanger: number;
  companions: Companion[];
}): QuestRisk => {
  const baseRate = BASE_DIFFICULTY_RATES[opts.difficulty] ?? 0;
  // Low levels are protected: 33% of base at L1, 100% at L20+.
  const levelProtection = Math.min(1, (opts.level + 10) / 30);
  // Every 50 quests adds 20% more risk.
  const questScaling = 1 + (opts.questsCompleted / 50) * 0.2;

  const dangerNorm = Math.min(1, Math.max(0, opts.areaDanger / 13));
  let hostilityWeight = 0;
  let topThreat: Companion | null = null;
  let topThreatBonus = 0;
  for (const c of opts.companions) {
    const bond = typeof c.relationship === "number" ? c.relationship : 1;
    if (bond > -5) continue;
    const threat = isCompanionThreat(bond);
    hostilityWeight += threat.combatBonus / 100; // 0.15 / 0.30 / 0.50
    if (threat.combatBonus > topThreatBonus) {
      topThreatBonus = threat.combatBonus;
      topThreat = c;
    }
  }
  const companionPlot = hostilityWeight * dangerNorm * 0.12;

  return {
    deathChance: baseRate * levelProtection * questScaling + companionPlot,
    companionPlot,
    topThreat,
    topThreatBonus,
  };
};
