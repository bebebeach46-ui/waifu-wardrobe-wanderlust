/**
 * THREAT RESOLUTION SYSTEM
 * ------------------------
 * Hostile companions plot murder. A hero with the right skills can act first —
 * quietly, diplomatically, or with plausible deniability.
 *
 * Six resolution paths, each gated by a different hero capability:
 *   assassination — blades in the dark (physical/stealth skills + dexterity)
 *   poison        — alchemy/potion making + intelligence
 *   stealth exile — shadow skills + lockpicking: they simply vanish in the night
 *   diplomacy     — persuasion + charisma: a peaceful compromise or dignified exit
 *   plotting      — intelligence + wisdom: arrange for the enemy to do it for you
 *   accident      — trap making / smithing / carpentry: a "tragic" equipment failure
 *
 * All rolls are automated — the hero never chooses, he only survives the outcome.
 */

import { RankedSkill, SkillRank } from "./skillRankGenerator";

export type ResolutionMethod =
  | "assassination"
  | "poison"
  | "stealth_exile"
  | "diplomacy"
  | "plotting"
  | "accident";

export type ThreatResolution = {
  companionName: string;
  method: ResolutionMethod;
  outcome: "removed" | "pacified" | "failed";
  /** New bond value when the threat is pacified rather than removed */
  newRelationship?: number;
  narrative: string;
  icon: string;
};

const rankValue: Record<SkillRank, number> = {
  Novice: 0,
  Apprentice: 1,
  Journeyman: 2,
  Expert: 3,
  Master: 4,
  Grandmaster: 5,
};

/** Keyword buckets used to read intent out of the hero's randomized skill/spell names */
const keywordSets: Record<string, string[]> = {
  stealth: ["shadow", "umbral", "wraith", "veil", "night", "hollow", "silent", "invisib", "clone", "step"],
  lethal: ["execut", "sever", "assassin", "thrust", "laceration", "bisection", "deathmark", "flay", "reaver", "slash", "riposte"],
  poison: ["plague", "poison", "venom", "wither", "necrotic", "blood", "carrion", "corpse", "hemorrhage", "toxin"],
  mind: ["charm", "hold", "whisper", "puppetry", "banish", "sleep", "mark", "dominat"],
};

const countKeywordHits = (names: string[], bucket: string) => {
  const keys = keywordSets[bucket];
  return names.reduce((n, raw) => {
    const s = (raw || "").toLowerCase();
    return n + (keys.some(k => s.includes(k)) ? 1 : 0);
  }, 0);
};

const lifeSkillRank = (lifeSkills: RankedSkill[], name: string) => {
  const s = lifeSkills.find(x => x.name === name);
  return s ? rankValue[s.rank] : -1; // -1 = not learned at all
};

export type ResolutionCapabilities = {
  assassination: number;
  poison: number;
  stealth: number;
  diplomacy: number;
  plotting: number;
  traps: number;
};

/**
 * Read the hero's capability scores (roughly 0–10) out of combat skills, spells,
 * life skills and raw stats. Levels matter — a Novice poisoner is a liability.
 */
export const getResolutionCapabilities = (
  character: any,
  lifeSkills: RankedSkill[],
  stats: any,
  level: number
): ResolutionCapabilities => {
  const skillNames: string[] = [
    ...((character?.skills as string[]) || []),
    ...(((character?.spells as any[]) || []).map(s => (typeof s === "string" ? s : s?.name))),
  ].filter(Boolean);

  const st = stats || {};
  const dex = st.dexterity ?? 10;
  const int = st.intelligence ?? 10;
  const wis = st.wisdom ?? 10;
  const cha = st.charisma ?? 10;
  const luck = st.luck ?? 10;

  const statBonus = (v: number) => Math.max(0, (v - 10) / 4); // 0–2.5
  const levelBonus = Math.min(2.5, level / 8);
  const classHint = (names: string[]) =>
    names.some(n => (character?.class || "").toLowerCase().includes(n)) ? 1.5 : 0;

  const alchemy = Math.max(lifeSkillRank(lifeSkills, "Alchemy"), lifeSkillRank(lifeSkills, "Potion Making"));
  const herbalism = lifeSkillRank(lifeSkills, "Herbalism");
  const persuasion = lifeSkillRank(lifeSkills, "Persuasion");
  const traps = lifeSkillRank(lifeSkills, "Trap Making");
  const locks = lifeSkillRank(lifeSkills, "Lockpicking");
  const craft = Math.max(
    lifeSkillRank(lifeSkills, "Smithing"),
    lifeSkillRank(lifeSkills, "Carpentry"),
    lifeSkillRank(lifeSkills, "Tailoring")
  );
  const taming = lifeSkillRank(lifeSkills, "Beast Taming");

  return {
    assassination:
      countKeywordHits(skillNames, "lethal") * 1.2 +
      Math.max(0, locks) * 0.5 +
      statBonus(dex) +
      levelBonus +
      classHint(["rogue", "shadow", "witch hunter", "soul reaver", "hexblade"]),
    poison:
      Math.max(0, alchemy) * 1.4 +
      Math.max(0, herbalism) * 0.7 +
      countKeywordHits(skillNames, "poison") * 0.8 +
      statBonus(int) +
      levelBonus +
      classHint(["plague doctor", "necromancer", "flesh sculptor", "alchem"]),
    stealth:
      countKeywordHits(skillNames, "stealth") * 1.2 +
      Math.max(0, locks) * 0.9 +
      statBonus(dex) * 0.8 +
      levelBonus +
      classHint(["rogue", "shadow", "scavenger"]),
    diplomacy:
      Math.max(0, persuasion) * 1.5 +
      countKeywordHits(skillNames, "mind") * 0.7 +
      statBonus(cha) * 1.2 +
      levelBonus +
      classHint(["paladin", "protagonist", "war priest", "inquisitor", "monk"]),
    plotting:
      statBonus(int) +
      statBonus(wis) +
      statBonus(luck) * 0.5 +
      Math.max(0, taming) * 0.5 +
      countKeywordHits(skillNames, "mind") * 0.6 +
      levelBonus +
      classHint(["eldritch scholar", "demonologist", "hacker", "inquisitor"]),
    traps:
      Math.max(0, traps) * 1.6 +
      Math.max(0, craft) * 0.9 +
      statBonus(dex) * 0.6 +
      levelBonus +
      classHint(["scavenger", "grave warden", "hacker", "beast tamer"]),
  };
};

const MIN_CAPABILITY = 4; // below this the hero isn't skilled enough to try anything

const narratives: Record<ResolutionMethod, (name: string, area: string) => string> = {
  assassination: (n, a) => `🔪 You found ${n} alone at the edge of ${a}. One clean stroke — no plot, no murder, no witness.`,
  poison: (n, a) => `⚗️ ${n}'s wineskin was refilled outside ${a}. They never tasted the nightshade beneath the honey.`,
  stealth_exile: (n, a) => `🌑 You emptied ${n}'s purse, cut their tent lines, and left a knife in their bedroll as a message. By dawn they were gone from ${a}.`,
  diplomacy: (n, a) => `🕊️ Words instead of blood: ${n} accepted a share of the ${a} spoils and departed with their dignity intact.`,
  plotting: (n, a) => `🎭 You placed ${n} on the left flank, where the ${a} horde was thickest. Their death was heroic, official, and entirely arranged.`,
  accident: (n, a) => `🪤 ${n}'s harness gave way on the ${a} descent — a tragic failure of craftsmanship. Yours.`,
};

const failNarratives: Record<ResolutionMethod, (name: string) => string> = {
  assassination: n => `😰 Your blade slipped — ${n} woke, saw your face, and now hates you with purpose.`,
  poison: n => `🤢 ${n} spat out the tainted broth and understood exactly what it meant.`,
  stealth_exile: n => `👁️ ${n} caught you rifling their pack. Whatever restraint remained is gone.`,
  diplomacy: n => `🗯️ ${n} laughed at your offer of peace and spat at your feet.`,
  plotting: n => `🩸 ${n} survived the flank you doomed them to — and they know who assigned it.`,
  accident: n => `🔧 ${n} found the filed pin in their gear before it snapped.`,
};

/**
 * Roll resolution attempts against hostile companions.
 * Only genuine threats (bond <= -4) are targeted, at most one per quest.
 */
export const rollThreatResolutions = (
  companions: any[],
  caps: ResolutionCapabilities,
  areaName: string,
  areaDanger: number,
  alignment?: string
): ThreatResolution | null => {
  const threats = companions
    .filter(c => (c.relationship ?? 0) <= -4)
    .sort((a, b) => (a.relationship ?? 0) - (b.relationship ?? 0));
  if (threats.length === 0) return null;

  const target = threats[0];
  const bond = target.relationship ?? 0;
  const neglect = target.questsSinceInteraction ?? 0;

  // Urgency: the more murderous they are, the more willing the hero is to act first
  const urgency = Math.min(1, (Math.abs(bond) - 3) / 7 + neglect * 0.02);

  // Which paths are even available to this hero?
  const evil = (alignment || "").toLowerCase().includes("evil");
  const good = (alignment || "").toLowerCase().includes("good");
  const options: { method: ResolutionMethod; score: number }[] = [
    { method: "assassination", score: caps.assassination * (evil ? 1.25 : good ? 0.7 : 1) },
    { method: "poison", score: caps.poison * (evil ? 1.2 : good ? 0.7 : 1) },
    { method: "stealth_exile", score: caps.stealth },
    { method: "diplomacy", score: caps.diplomacy * (good ? 1.3 : 1) },
    { method: "plotting", score: caps.plotting * (1 + areaDanger * 0.06) },
    { method: "accident", score: caps.traps },
  ].filter(o => o.score >= MIN_CAPABILITY);
  if (options.length === 0) return null;

  // Weighted pick — the hero leans on what he's best at
  const total = options.reduce((s, o) => s + o.score, 0);
  let roll = Math.random() * total;
  let chosen = options[0];
  for (const o of options) {
    roll -= o.score;
    if (roll <= 0) { chosen = o; break; }
  }

  // Opportunity chance: skill + urgency, capped so it never feels automatic
  const opportunity = Math.min(0.45, (chosen.score - MIN_CAPABILITY) * 0.045 + urgency * 0.18);
  if (Math.random() > opportunity) return null;

  // Success chance vs. a hostile, alert companion
  const alertness = 1 + Math.max(0, -bond - 5) * 0.06; // Nemesis-level threats are watchful
  const success = Math.min(0.92, (0.45 + chosen.score * 0.05) / alertness);
  const won = Math.random() < success;

  if (!won) {
    return {
      companionName: target.name,
      method: chosen.method,
      outcome: "failed",
      newRelationship: Math.max(-10, bond - 2),
      narrative: failNarratives[chosen.method](target.name),
      icon: "⚠️",
    };
  }

  // Diplomacy has two flavors of victory: reconciliation or an honorable parting
  if (chosen.method === "diplomacy" && Math.random() < 0.45) {
    return {
      companionName: target.name,
      method: "diplomacy",
      outcome: "pacified",
      newRelationship: 0,
      narrative: `🤝 A long night of honest talk. ${target.name}'s grievance was aired, answered, and set down — the grudge is gone, the bond reset to neutral.`,
      icon: "🤝",
    };
  }

  return {
    companionName: target.name,
    method: chosen.method,
    outcome: "removed",
    narrative: narratives[chosen.method](target.name, areaName || "the wilds"),
    icon: chosen.method === "diplomacy" ? "🕊️" : chosen.method === "accident" ? "🪤" : chosen.method === "plotting" ? "🎭" : chosen.method === "poison" ? "⚗️" : chosen.method === "stealth_exile" ? "🌑" : "🔪",
  };
};

export const methodLabel: Record<ResolutionMethod, string> = {
  assassination: "Assassination",
  poison: "Poisoning",
  stealth_exile: "Silent Exile",
  diplomacy: "Diplomacy",
  plotting: "Battlefield Plot",
  accident: "Arranged Accident",
};
