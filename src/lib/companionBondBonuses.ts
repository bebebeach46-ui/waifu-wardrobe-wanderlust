// ============================================================================
// COMPANION BOND BONUSES & DEVOTION EVENTS
// ----------------------------------------------------------------------------
// As companion bond ranks climb, their understanding of the hero deepens.
// All companions are combat-capable (the perilous lands demand it), but each
// has a SPECIALTY ROLE that grows stronger with bond — fighting, magic,
// healing, crafting, cooking, or support. Higher bonds also trigger more
// frequent devotion events: gift-giving, weapon enhancement, enemy repulsed,
// mid-battle healing, romantic interludes, etc.
// ----------------------------------------------------------------------------

export type CompanionRole =
  | "Fighter"     // boosts player damage / quest combat performance
  | "Mage"        // boosts critical chance / magical performance
  | "Healer"      // reduces wound severity, heals mid-battle
  | "Crafter"     // enhances weapons & equipment, more gold
  | "Cook"        // restores HP, reduces hunger penalties, fame bonus
  | "Support";    // generic morale/fame/quest performance

// ---- Role inference from class/race ----

const HEALER_HINTS = ["Healer", "Dandere", "Cleric", "Shepherd", "Chaplain", "Whisperer", "Phoenix", "Angel", "Dryad", "Alraune"];
const MAGE_HINTS = ["Mage", "Sorcerer", "Summoner", "Witch", "Hex", "Weaver", "Alchemist", "Kitsune", "Fairy", "Pixie", "Banshee"];
const FIGHTER_HINTS = ["Warrior", "Knight", "Paladin", "Sentinel", "Maiden", "Stalker", "Assassin", "Fighter", "Valkyrie", "Berserker", "Oni"];
const CRAFTER_HINTS = ["Smith", "Crafter", "Bone Collector", "Carrion", "Golem", "Cyborg", "Android", "Homunculus", "Tinker"];
const COOK_HINTS = ["Holstaur", "Bunnygirl", "Slime", "Selkie", "Mermaid", "Catgirl", "Foxgirl"];

export const inferCompanionRole = (companion: any): CompanionRole => {
  if (companion?.role) return companion.role as CompanionRole;
  const blob = `${companion?.class || ""} ${companion?.race || ""}`.toLowerCase();
  const matches = (list: string[]) => list.some(h => blob.includes(h.toLowerCase()));
  if (matches(HEALER_HINTS)) return "Healer";
  if (matches(MAGE_HINTS)) return "Mage";
  if (matches(CRAFTER_HINTS)) return "Crafter";
  if (matches(COOK_HINTS)) return "Cook";
  if (matches(FIGHTER_HINTS)) return "Fighter";
  return "Support";
};

export const getRoleIcon = (role: CompanionRole): string => {
  switch (role) {
    case "Fighter": return "⚔️";
    case "Mage": return "✨";
    case "Healer": return "💚";
    case "Crafter": return "🔨";
    case "Cook": return "🍳";
    case "Support": return "🎯";
  }
};

// ---- Aggregated bond bonuses for the active party ----

export interface PartyBondBonuses {
  // Multiplicative bonus to quest performance grade (e.g. 0.08 = +8%)
  questPerformanceMult: number;
  // Flat reduction subtracted from wound severity rolls (capped 0-3)
  woundSeverityReduction: number;
  // Multiplicative gold/treasure boost
  goldMult: number;
  // Flat fame bonus per quest
  flatFameBonus: number;
  // Critical-hit chance bonus (0..0.15)
  critBonus: number;
  // Each contributing companion summary
  contributions: Array<{
    name: string;
    role: CompanionRole;
    bond: number;
    summary: string;
  }>;
}

/**
 * Compute the per-quest passive bonuses provided by all active companions.
 * Bond rank tiers (positive bonds only — hostile companions never help):
 *   Bond  1-2 : negligible (just morale flavor)
 *   Bond  3-4 : minor support
 *   Bond  5-6 : meaningful boost in their specialty
 *   Bond  7-8 : strong specialty boost
 *   Bond  9-10: legendary synergy
 */
export const calculatePartyBondBonuses = (companions: any[]): PartyBondBonuses => {
  const out: PartyBondBonuses = {
    questPerformanceMult: 0,
    woundSeverityReduction: 0,
    goldMult: 0,
    flatFameBonus: 0,
    critBonus: 0,
    contributions: [],
  };

  for (const c of companions || []) {
    const bond = typeof c?.relationship === "number" ? c.relationship : 0;
    if (bond < 1) continue;

    const tier =
      bond >= 9 ? 5 :
      bond >= 7 ? 4 :
      bond >= 5 ? 3 :
      bond >= 3 ? 2 :
      1;

    const role = inferCompanionRole(c);
    // Specialty weight: 0.02 per tier baseline; scales differently per role
    const w = tier * 0.02;

    let summary = "";
    switch (role) {
      case "Fighter":
        out.questPerformanceMult += w * 1.2;
        out.critBonus += w * 0.4;
        summary = `+${(w * 1.2 * 100).toFixed(0)}% quest perf, +${(w * 0.4 * 100).toFixed(1)}% crit`;
        break;
      case "Mage":
        out.questPerformanceMult += w * 0.8;
        out.critBonus += w * 1.0;
        summary = `+${(w * 100).toFixed(1)}% crit, +${(w * 0.8 * 100).toFixed(0)}% perf`;
        break;
      case "Healer":
        // Healers cap-stack severity reduction up to +3 across all healers
        out.woundSeverityReduction += tier * 0.4;
        summary = `−${(tier * 0.4).toFixed(1)} wound severity`;
        break;
      case "Crafter":
        out.goldMult += w * 1.5;
        out.questPerformanceMult += w * 0.3;
        summary = `+${(w * 1.5 * 100).toFixed(0)}% gold, +${(w * 0.3 * 100).toFixed(0)}% perf`;
        break;
      case "Cook":
        out.flatFameBonus += tier * 0.25;
        out.questPerformanceMult += w * 0.4;
        summary = `+${(tier * 0.25).toFixed(1)} fame, morale boost`;
        break;
      case "Support":
        out.questPerformanceMult += w * 0.6;
        out.flatFameBonus += tier * 0.15;
        summary = `+${(w * 0.6 * 100).toFixed(0)}% perf`;
        break;
    }

    out.contributions.push({ name: c.name, role, bond, summary });
  }

  // Caps to prevent runaway scaling
  out.questPerformanceMult = Math.min(out.questPerformanceMult, 0.6);
  out.woundSeverityReduction = Math.min(out.woundSeverityReduction, 3);
  out.goldMult = Math.min(out.goldMult, 0.75);
  out.flatFameBonus = Math.min(out.flatFameBonus, 4);
  out.critBonus = Math.min(out.critBonus, 0.15);

  return out;
};

// ===========================================================================
// BOND MALUSES — negative-bond companions actively sabotage the party
// ---------------------------------------------------------------------------
// Hostile companions (bond <= -3) drag the hero down: spoiling rations,
// poisoning morale, "missing" a parry, or selling intel. The deeper the
// hostility the worse the malus. Bond -10 (Nemesis) escalates into outright
// death-risk, and the longer such a companion is IGNORED (high
// questsSinceInteraction) the more dangerous they become — they have time
// to plot, recruit accomplices, and lay traps.
// ===========================================================================

export interface PartyBondMaluses {
  // Subtractive penalty to quest performance (0..0.5)
  questPerformanceMalus: number;
  // Flat addition to wound severity rolls (0..3)
  woundSeverityIncrease: number;
  // Multiplicative gold loss factor (0..0.5)
  goldMalus: number;
  // Flat fame loss per quest (0..3)
  flatFameLoss: number;
  // ADDITIONAL flat death-chance contributed by hostile companions (0..0.12)
  // This is layered ON TOP of the GameScreen's existing dangerArea×hostility
  // calculation so a Nemesis is dangerous even in calm regions.
  bonusDeathChance: number;
  // Multiplier applied to enemy damage rolls (1.0..1.5) — Fighters/Mages
  // who hate you can leak openings, miss key counterspells, or "fail" to
  // tank, exposing the hero to harder hits.
  enemyDamageMult: number;
  // Probability (0..0.4) of a poisoning/tainted-meal status this quest from
  // a hostile Cook or Healer with apothecary skills.
  poisonChance: number;
  // The single most dangerous hostile companion (for narrative attribution)
  topNemesis: null | { name: string; race: string; bond: number; neglect: number; deathContribution: number };
  contributions: Array<{
    name: string;
    role: CompanionRole;
    bond: number;
    neglect: number;
    summary: string;
  }>;
}

/**
 * Compute per-quest passive maluses caused by hostile companions.
 *   Bond -3 to -4  : minor sabotage (perf/fame nibble)
 *   Bond -5 to -7  : dangerous (gold loss, wound severity, perf drop)
 *   Bond -8 to -9  : deadly (small death-chance contribution)
 *   Bond -10       : NEMESIS — meaningful death-chance contribution that
 *                    SCALES with how long they have been ignored.
 *
 * "Ignored" is read from companion.questsSinceInteraction (set by the
 * passive mood-drift system). After 6 quests with no interaction, every
 * additional ignored quest amplifies the Nemesis's danger up to ~3x.
 *
 * EACH ROLE CONTRIBUTES A DIFFERENT FLAVOR OF SABOTAGE (mirroring bonuses):
 *   Fighter — leaks openings → enemyDamageMult, perf loss
 *   Mage    — misfires/withholds counterspells → enemyDamageMult, deathChance
 *   Healer  — crafts poison, "treats" with venom → poisonChance, severity++
 *   Crafter — sabotages gear → goldMalus, severity++, perf loss
 *   Cook    — taints meals → poisonChance, fame loss, perf loss
 *   Support — spreads dissent → fame loss, perf loss
 */
export const calculatePartyBondMaluses = (companions: any[]): PartyBondMaluses => {
  const out: PartyBondMaluses = {
    questPerformanceMalus: 0,
    woundSeverityIncrease: 0,
    goldMalus: 0,
    flatFameLoss: 0,
    bonusDeathChance: 0,
    enemyDamageMult: 1,
    poisonChance: 0,
    topNemesis: null,
    contributions: [],
  };

  let topNemesisDeath = 0;
  let enemyDamageBonus = 0; // accumulated additive bonus, applied to mult at end

  for (const c of companions || []) {
    const bond = typeof c?.relationship === "number" ? c.relationship : 0;
    if (bond > -3) continue;

    const neglect = Math.max(0, (c?.questsSinceInteraction ?? 0) - 6);
    // Neglect amplifier: 1.0 baseline, up to 3.0 after ~25 ignored quests
    const neglectMult = 1 + Math.min(2, neglect * 0.08);

    // Severity tier
    const severity =
      bond <= -10 ? 4 :  // Nemesis
      bond <= -8  ? 3 :  // Deadly
      bond <= -5  ? 2 :  // Dangerous
                    1;   // Bitter

    const role = inferCompanionRole(c);
    // Common sabotage weight — every hostile companion at least nibbles morale
    const w = severity * 0.012 * neglectMult;
    out.flatFameLoss += w * 8;            // fame loss applies to everyone

    let summary = "";
    let roleNote = "";

    switch (role) {
      case "Fighter":
        // Leaks openings: enemies hit harder, perf drops
        enemyDamageBonus += w * 1.0;       // up to ~+15% enemy damage at Nemesis+neglect
        out.questPerformanceMalus += w * 1.2;
        if (severity >= 2) out.woundSeverityIncrease += (severity - 1) * 0.25 * neglectMult;
        roleNote = "leaks openings, enemies hit harder";
        break;
      case "Mage":
        // Withholds counterspells, miscasts protections
        enemyDamageBonus += w * 1.2;
        out.questPerformanceMalus += w * 0.8;
        if (severity >= 3) out.bonusDeathChance += 0.005 * neglectMult; // misdirected wards
        roleNote = "miscasts wards, spells go awry";
        break;
      case "Healer":
        // Crafts poison, "treats" with venom — wounds fester, poison risk
        out.woundSeverityIncrease += severity * 0.4 * neglectMult;
        if (severity >= 2) out.poisonChance += 0.04 * (severity - 1) * neglectMult;
        if (severity === 4) out.poisonChance += 0.06 * neglectMult; // Nemesis healer is terrifying
        roleNote = severity >= 2 ? "tainted poultices, venomous draughts" : "neglectful care";
        break;
      case "Crafter":
        // Sabotages gear: weaker armor, lost gold, dulled blades
        out.goldMalus += w * 1.8;
        out.questPerformanceMalus += w * 0.5;
        if (severity >= 2) out.woundSeverityIncrease += (severity - 1) * 0.35 * neglectMult;
        roleNote = "sabotaged gear, brittle repairs";
        break;
      case "Cook":
        // Taints meals: poison risk, morale drops, perf hit
        if (severity >= 1) out.poisonChance += 0.03 * severity * neglectMult;
        out.questPerformanceMalus += w * 0.6;
        out.flatFameLoss += w * 4;          // gossip from kitchen is brutal
        roleNote = "taints rations, sour stews";
        break;
      case "Support":
        // Spreads dissent: fame and perf
        out.questPerformanceMalus += w * 0.9;
        out.flatFameLoss += w * 6;
        roleNote = "spreads dissent and rumor";
        break;
    }

    // DEATH-CHANCE contribution — only deep hostility, with NEMESIS scaling hard on neglect
    let deathContribution = 0;
    if (severity === 3) {
      // Deadly: small flat addition, modest neglect scaling (max 1.5x)
      deathContribution = 0.008 * Math.min(1.5, neglectMult);
    } else if (severity === 4) {
      // NEMESIS: meaningful flat addition, full neglect scaling (up to 3x)
      // Base 2.5% per quest, up to ~7.5% if utterly ignored.
      deathContribution = 0.025 * neglectMult;
      // Role-specific killer bias: Mage/Fighter Nemeses are extra lethal
      if (role === "Mage" || role === "Fighter") deathContribution *= 1.15;
      if (deathContribution > topNemesisDeath) {
        topNemesisDeath = deathContribution;
        out.topNemesis = {
          name: c.name, race: c.race, bond, neglect,
          deathContribution,
        };
      }
    }
    out.bonusDeathChance += deathContribution;

    summary =
      severity === 4 ? `NEMESIS ${role} — +${(deathContribution * 100).toFixed(1)}% death/q • ${roleNote}${neglect > 0 ? ` (ignored ${neglect}q)` : ""}` :
      severity === 3 ? `Deadly ${role} — ${roleNote}, +${(deathContribution * 100).toFixed(1)}% death/q` :
      severity === 2 ? `Dangerous ${role} — ${roleNote}` :
                       `Bitter ${role} — ${roleNote}`;

    out.contributions.push({ name: c.name, role, bond, neglect, summary });
  }

  // Convert accumulated enemy-damage bonus into a multiplier
  out.enemyDamageMult = 1 + Math.min(0.5, enemyDamageBonus);

  // Caps to avoid runaway death spirals
  out.questPerformanceMalus  = Math.min(out.questPerformanceMalus, 0.5);
  out.woundSeverityIncrease  = Math.min(out.woundSeverityIncrease, 3);
  out.goldMalus              = Math.min(out.goldMalus, 0.5);
  out.flatFameLoss           = Math.min(out.flatFameLoss, 3);
  out.bonusDeathChance       = Math.min(out.bonusDeathChance, 0.12);
  out.poisonChance           = Math.min(out.poisonChance, 0.4);

  return out;
};

// ===========================================================================
// SABOTAGE EVENTS — role-flavored counterpart to devotion events
// ---------------------------------------------------------------------------
// Per quest, each hostile companion (bond <= -3) has a chance to fire a
// narrative sabotage event. Probability scales with hostility AND neglect.
// ===========================================================================

export type SabotageEventKind =
  | "tainted_meal"      // Cook/Healer: poison or food sickness
  | "sabotaged_gear"    // Crafter/Fighter: dulled blade, loose strap
  | "leaked_opening"    // Fighter: failed parry, "missed" warning
  | "miscast_ward"      // Mage: protection collapses mid-fight
  | "venomous_care"     // Healer: poultice burns, "wrong" herb
  | "spread_dissent"    // Support: morale tanking
  | "stolen_purse";     // any: gold lifted in the night

export interface SabotageEvent {
  kind: SabotageEventKind;
  companionName: string;
  companionRace: string;
  role: CompanionRole;
  icon: string;
  title: string;
  narrative: string;
  effect: {
    fameLoss?: number;
    goldLoss?: number;
    addWoundSeverity?: number;  // adds to next wound roll
    perfPenalty?: number;       // applied to this quest's grade
    triggerPoison?: boolean;    // GameScreen should apply a poison status
  };
}

const taintedMealNarratives = [
  "stirred something gritty into your stew — your gut knots before the fight",
  "served you 'aged' meat that smelled wrong. You ate it anyway",
  "ladled a draught laced with crushed nightshade petals",
  "served the hero last, after letting the broth sit on a suspicious shelf",
];
const sabotagedGearNarratives = [
  "loosened a strap on your armor 'by accident'",
  "left your blade dull — the edge folds on the first strike",
  "swapped a quality whetstone for a cheap one and pocketed the difference",
  "rewrapped your hilt with rotten leather",
];
const leakedOpeningNarratives = [
  "stepped aside as a flanker came in — you took the hit meant for them",
  "called out the wrong direction during an ambush",
  "lowered their shield at exactly the wrong moment",
  "let an enemy through the line and shrugged when asked why",
];
const miscastWardNarratives = [
  "let your protective ward collapse mid-engagement",
  "miscast a counterspell — the enemy hex landed full strength",
  "'forgot' the incantation to your shield rune",
  "channeled the wrong reagent and your armor flickered out",
];
const venomousCareNarratives = [
  "applied a poultice that burned, not soothed — the wound festers",
  "treated your cut with what looked like the wrong herb. It went black overnight",
  "smiled too wide while bandaging you. The bandage smells of rot",
  "ground a draught with mortar still stained from yesterday's poison",
];
const spreadDissentNarratives = [
  "whispered to the others about your last 'mistake' until morale soured",
  "mocked your last victory in front of villagers",
  "told a tavern your secrets — fame slipped",
  "convinced two companions to sit out the next watch",
];
const stolenPurseNarratives = [
  "lifted a fistful of coin from your purse while you slept",
  "pocketed the reward before it was counted",
  "claimed the bandit loot was 'lost in the brush'",
  "swapped a real gem in your pack for a cheap paste",
];

const pickN = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/**
 * Per-quest roll: each hostile companion has a chance to trigger a
 * role-flavored sabotage event. Returns up to one per companion per quest.
 */
export const rollSabotageEvents = (companions: any[]): SabotageEvent[] => {
  const events: SabotageEvent[] = [];

  for (const c of companions || []) {
    const bond = typeof c?.relationship === "number" ? c.relationship : 0;
    if (bond > -3) continue;

    const neglect = Math.max(0, (c?.questsSinceInteraction ?? 0) - 6);
    const neglectMult = 1 + Math.min(2, neglect * 0.08);
    const severity =
      bond <= -10 ? 4 :
      bond <= -8  ? 3 :
      bond <= -5  ? 2 :
                    1;

    // Probability: 3% (Bitter) to 18% (Nemesis) baseline, up to ~3x with neglect
    const baseChance = Math.min(0.45, (0.02 + severity * 0.025) * neglectMult);
    if (Math.random() > baseChance) continue;

    const role = inferCompanionRole(c);
    const candidates: SabotageEventKind[] = [];

    // Universal options (anyone can do these)
    if (severity >= 2) candidates.push("stolen_purse");
    candidates.push("spread_dissent");

    // Role-specific options (heavily weighted by repeating)
    switch (role) {
      case "Cook":
        candidates.push("tainted_meal", "tainted_meal");
        if (severity >= 3) candidates.push("tainted_meal");
        break;
      case "Healer":
        candidates.push("venomous_care", "venomous_care");
        if (severity >= 3) candidates.push("tainted_meal"); // apothecary poison
        break;
      case "Fighter":
        candidates.push("leaked_opening", "leaked_opening");
        if (severity >= 2) candidates.push("sabotaged_gear");
        break;
      case "Mage":
        candidates.push("miscast_ward", "miscast_ward");
        if (severity >= 3) candidates.push("miscast_ward");
        break;
      case "Crafter":
        candidates.push("sabotaged_gear", "sabotaged_gear");
        if (severity >= 2) candidates.push("stolen_purse");
        break;
      case "Support":
        candidates.push("spread_dissent", "spread_dissent");
        break;
    }

    const kind = pickN(candidates);
    let event: SabotageEvent;

    switch (kind) {
      case "tainted_meal":
        event = {
          kind, role, companionName: c.name, companionRace: c.race,
          icon: "🍲", title: `${c.name} Tainted the Meal`,
          narrative: pickN(taintedMealNarratives),
          effect: {
            triggerPoison: severity >= 2,
            perfPenalty: 0.1 + severity * 0.05,
            fameLoss: 1,
          },
        };
        break;
      case "sabotaged_gear":
        event = {
          kind, role, companionName: c.name, companionRace: c.race,
          icon: "⚙️", title: `${c.name} Sabotaged Your Gear`,
          narrative: pickN(sabotagedGearNarratives),
          effect: {
            addWoundSeverity: 1 + Math.floor(severity / 2),
            perfPenalty: 0.15,
            goldLoss: 5 + severity * 3,
          },
        };
        break;
      case "leaked_opening":
        event = {
          kind, role, companionName: c.name, companionRace: c.race,
          icon: "🛡️", title: `${c.name} Left You Exposed`,
          narrative: pickN(leakedOpeningNarratives),
          effect: { addWoundSeverity: 1 + severity, perfPenalty: 0.1 },
        };
        break;
      case "miscast_ward":
        event = {
          kind, role, companionName: c.name, companionRace: c.race,
          icon: "✨", title: `${c.name}'s Ward Failed`,
          narrative: pickN(miscastWardNarratives),
          effect: { addWoundSeverity: 2 + Math.floor(severity / 2), perfPenalty: 0.12 },
        };
        break;
      case "venomous_care":
        event = {
          kind, role, companionName: c.name, companionRace: c.race,
          icon: "☠️", title: `${c.name}'s 'Care' Backfired`,
          narrative: pickN(venomousCareNarratives),
          effect: {
            addWoundSeverity: 1 + severity,
            triggerPoison: severity >= 3,
            perfPenalty: 0.08,
          },
        };
        break;
      case "spread_dissent":
        event = {
          kind, role, companionName: c.name, companionRace: c.race,
          icon: "🗣️", title: `${c.name} Spread Dissent`,
          narrative: pickN(spreadDissentNarratives),
          effect: { fameLoss: 1 + Math.floor(severity / 2), perfPenalty: 0.05 + severity * 0.03 },
        };
        break;
      case "stolen_purse":
        event = {
          kind, role, companionName: c.name, companionRace: c.race,
          icon: "💰", title: `${c.name} Lifted Your Coin`,
          narrative: pickN(stolenPurseNarratives),
          effect: { goldLoss: 8 + severity * 6 },
        };
        break;
    }

    events.push(event);
  }

  return events;
};

// ===========================================================================
// DEVOTION EVENTS — triggered per quest, weighted by bond rank
// ===========================================================================

export type DevotionEventKind =
  | "interlude"         // romantic moment (bond 7+)
  | "gift"              // companion gives the hero a gift (bond 4+)
  | "weapon_enhance"    // crafter polishes/sharpens gear (bond 5+)
  | "enemy_repulsed"    // companion drives off a threat (bond 4+)
  | "midbattle_heal"    // healer patches a wound (bond 5+)
  | "rallying_cry";     // support boosts morale (bond 3+)

export interface DevotionEvent {
  kind: DevotionEventKind;
  companionName: string;
  companionRace: string;
  icon: string;
  title: string;
  narrative: string;
  // Mechanical effect to apply in GameScreen
  effect: {
    fame?: number;
    gold?: number;
    healWoundSeverity?: number; // remove this much severity from worst wound
    bondBoost?: number;         // small reciprocal bond gain
    perfBoost?: number;         // applied to next quest grade (0..2)
  };
}

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const interludeNarratives = [
  "shared a quiet, tender moment under the stars",
  "stole a kiss in the moonlit clearing",
  "whispered private vows by the campfire",
  "danced a slow, secret dance in the rain",
];
const giftNarratives = [
  "pressed a small carved trinket into your palm",
  "offered a dried flower kept since their childhood",
  "handed you a charm woven from their own hair",
  "left a steaming flask of spiced wine in your pack",
];
const enhanceNarratives = [
  "spent the night polishing your blade until it gleamed",
  "etched protective runes along your armor",
  "rebalanced your weapon with practiced precision",
  "rewrapped your hilt with grip cured in monster oil",
];
const repulseNarratives = [
  "spotted a stalking ambusher and drove them off before you noticed",
  "stared down a rival party until they backed away from your camp",
  "killed a pursuing scout with a single thrown dagger",
  "intercepted a trap meant for your boots",
];
const healNarratives = [
  "pressed a warm hand against your wound mid-fight — the bleeding stopped",
  "chanted a forbidden cantrip while parrying for you",
  "force-fed you an alchemical draught between sword swings",
  "stitched a gash closed without breaking eye contact with the enemy",
];
const rallyNarratives = [
  "shouted a war-cry that steeled your nerves",
  "cracked a joke at exactly the worst moment — and you laughed",
  "reminded you of why you started this quest",
  "matched their pace to yours and you both felt unbreakable",
];

/**
 * Per-quest roll: each high-bond companion has a chance to trigger a
 * devotion event. Returns up to one event per companion per quest.
 */
export const rollDevotionEvents = (
  companions: any[],
  hasActiveWound: boolean
): DevotionEvent[] => {
  const events: DevotionEvent[] = [];

  for (const c of companions || []) {
    const bond = typeof c?.relationship === "number" ? c.relationship : 0;
    if (bond < 3) continue;

    // Probability scales steeply with bond: bond 3 = 4%, bond 10 = 22%
    const baseChance = 0.02 + (bond - 2) * 0.025;
    if (Math.random() > baseChance) continue;

    const role = inferCompanionRole(c);
    const candidates: DevotionEventKind[] = [];

    if (bond >= 3) candidates.push("rallying_cry");
    if (bond >= 4) candidates.push("gift", "enemy_repulsed");
    if (bond >= 5 && (role === "Crafter" || role === "Fighter")) candidates.push("weapon_enhance");
    if (bond >= 5 && (role === "Healer" || role === "Mage") && hasActiveWound) candidates.push("midbattle_heal");
    if (bond >= 7) candidates.push("interlude", "interlude"); // double weight at high bond

    if (candidates.length === 0) continue;

    const kind = pick(candidates);
    let event: DevotionEvent;

    switch (kind) {
      case "interlude":
        event = {
          kind, companionName: c.name, companionRace: c.race,
          icon: "💞",
          title: `Romantic Interlude with ${c.name}`,
          narrative: pick(interludeNarratives),
          effect: { fame: 1, bondBoost: 0.15, perfBoost: 0.5 },
        };
        break;
      case "gift":
        event = {
          kind, companionName: c.name, companionRace: c.race,
          icon: "🎁",
          title: `${c.name} Offered a Gift`,
          narrative: pick(giftNarratives),
          effect: { gold: 5 + Math.floor(bond * 3), bondBoost: 0.1 },
        };
        break;
      case "weapon_enhance":
        event = {
          kind, companionName: c.name, companionRace: c.race,
          icon: "🔨",
          title: `${c.name} Enhanced Your Gear`,
          narrative: pick(enhanceNarratives),
          effect: { perfBoost: 0.8, bondBoost: 0.05 },
        };
        break;
      case "enemy_repulsed":
        event = {
          kind, companionName: c.name, companionRace: c.race,
          icon: "🛡️",
          title: `${c.name} Repulsed a Threat`,
          narrative: pick(repulseNarratives),
          effect: { fame: 1, perfBoost: 0.3 },
        };
        break;
      case "midbattle_heal":
        event = {
          kind, companionName: c.name, companionRace: c.race,
          icon: "💚",
          title: `${c.name} Healed You Mid-Battle`,
          narrative: pick(healNarratives),
          effect: { healWoundSeverity: 1 + Math.floor((bond - 5) / 2), bondBoost: 0.1 },
        };
        break;
      case "rallying_cry":
        event = {
          kind, companionName: c.name, companionRace: c.race,
          icon: "📣",
          title: `${c.name} Rallied You`,
          narrative: pick(rallyNarratives),
          effect: { perfBoost: 0.4 },
        };
        break;
    }

    events.push(event);
  }

  return events;
};

// ===========================================================================
// RIVALRY SYSTEM
// ---------------------------------------------------------------------------
// When two companions reach similar bond ranks (>=4, within 1.5 of each
// other), they may see each other as rivals competing for the hero's love.
// Rival pairs grant ESCALATING bonuses to the hero (each "round" of rivalry
// stacks a small temporary perk). The rivalry resolves when one of them
// reaches bond 10 first ("won love"). If BOTH reach bond 10 (the max-2 tie)
// the rivalry ends as a draw — both are partners and both bear heirs.
// ===========================================================================

export interface Rivalry {
  id: string;                // stable id `${nameA}|${nameB}` (sorted)
  nameA: string;
  nameB: string;
  raceA: string;
  raceB: string;
  startedAt: number;
  rounds: number;            // # of rivalry events fired so far
  resolution: null | "won_A" | "won_B" | "tie";
}

const rivalryKey = (a: string, b: string) =>
  [a, b].sort().join("|");

/**
 * Detect rival pairs amongst active companions. A pair qualifies when both
 * have bond >= 4 and their bond difference is <= 1.5 and neither has
 * already reached bond 10. Returns id strings only.
 */
export const detectRivalPairs = (companions: any[]): Array<{ a: any; b: any }> => {
  const pairs: Array<{ a: any; b: any }> = [];
  const eligible = (companions || []).filter(c =>
    typeof c?.relationship === "number" && c.relationship >= 4 && c.relationship < 10
  );
  for (let i = 0; i < eligible.length; i++) {
    for (let j = i + 1; j < eligible.length; j++) {
      if (Math.abs(eligible[i].relationship - eligible[j].relationship) <= 1.5) {
        pairs.push({ a: eligible[i], b: eligible[j] });
      }
    }
  }
  return pairs;
};

/**
 * Per-quest tick: returns an updated rivalries list and any new rivalry
 * events that should be displayed. Resolves rivalries when one or both
 * partners hit bond 10.
 */
export interface RivalryTick {
  rivalries: Rivalry[];
  newPairs: Rivalry[];
  events: Array<{
    rivalryId: string;
    nameA: string;
    nameB: string;
    icon: string;
    title: string;
    narrative: string;
    perfBoost: number;       // hero benefits from the competition
    fameBoost: number;
  }>;
  resolutions: Array<{
    rivalryId: string;
    winner: "A" | "B" | "tie";
    nameA: string;
    nameB: string;
    narrative: string;
  }>;
}

const rivalryEventNarratives = [
  "{a} sparred harder than usual after seeing {b} draw your gaze",
  "{b} cooked you a feast before {a} could offer their gift",
  "{a} doubled their watch shift so {b} would not impress you alone",
  "{b} polished your armor through the night — {a} noticed and matched the effort",
  "{a} and {b} dueled for the honor of riding at your side",
];

const tieResolutions = [
  "Their rivalry ended as a tie — both have won your heart, and both will bear your line",
  "Neither could best the other; the hero takes both as partners, and two heirs are promised",
];
const winResolutions = [
  "{winner} finally claimed the hero's love — {loser} steps back with quiet grace",
  "{winner} stood victorious in the contest of devotion; {loser} remains a treasured friend",
  "{winner} won the soul-bond, leaving {loser} to seek their own path",
];

export const tickRivalries = (
  companions: any[],
  prior: Rivalry[]
): RivalryTick => {
  const result: RivalryTick = {
    rivalries: [],
    newPairs: [],
    events: [],
    resolutions: [],
  };

  // Build a quick lookup of current bond per name
  const bondByName = new Map<string, number>();
  const compByName = new Map<string, any>();
  for (const c of companions || []) {
    bondByName.set(c.name, typeof c.relationship === "number" ? c.relationship : 0);
    compByName.set(c.name, c);
  }

  // Carry forward existing rivalries (resolve any that should end)
  for (const r of prior || []) {
    const ba = bondByName.get(r.nameA);
    const bb = bondByName.get(r.nameB);

    // Drop if a participant is gone from active party
    if (ba === undefined || bb === undefined) {
      continue;
    }

    if (r.resolution) {
      // Already resolved, keep for record (UI shows fading)
      result.rivalries.push(r);
      continue;
    }

    const aWon = ba >= 10;
    const bWon = bb >= 10;

    if (aWon && bWon) {
      const narrative = pick(tieResolutions);
      const resolved: Rivalry = { ...r, resolution: "tie" };
      result.rivalries.push(resolved);
      result.resolutions.push({
        rivalryId: r.id, winner: "tie", nameA: r.nameA, nameB: r.nameB, narrative,
      });
      continue;
    }
    if (aWon) {
      const narrative = pick(winResolutions)
        .replace("{winner}", r.nameA).replace("{loser}", r.nameB);
      result.rivalries.push({ ...r, resolution: "won_A" });
      result.resolutions.push({
        rivalryId: r.id, winner: "A", nameA: r.nameA, nameB: r.nameB, narrative,
      });
      continue;
    }
    if (bWon) {
      const narrative = pick(winResolutions)
        .replace("{winner}", r.nameB).replace("{loser}", r.nameA);
      result.rivalries.push({ ...r, resolution: "won_B" });
      result.resolutions.push({
        rivalryId: r.id, winner: "B", nameA: r.nameA, nameB: r.nameB, narrative,
      });
      continue;
    }

    // Still active — chance to fire a competitive event
    if (Math.random() < 0.18) {
      const rounds = r.rounds + 1;
      const perfBoost = Math.min(0.04 + rounds * 0.015, 0.15); // escalating
      const fameBoost = 1;
      const narrative = pick(rivalryEventNarratives)
        .replace("{a}", r.nameA).replace("{b}", r.nameB);
      result.events.push({
        rivalryId: r.id,
        nameA: r.nameA, nameB: r.nameB,
        icon: "⚡",
        title: `Rivalry: ${r.nameA} vs. ${r.nameB}`,
        narrative,
        perfBoost,
        fameBoost,
      });
      result.rivalries.push({ ...r, rounds });
    } else {
      result.rivalries.push(r);
    }
  }

  // Detect new pairs not already tracked
  const known = new Set(result.rivalries.map(r => r.id));
  const pairs = detectRivalPairs(companions);
  for (const { a, b } of pairs) {
    const id = rivalryKey(a.name, b.name);
    if (known.has(id)) continue;
    // 35% chance per quest that a new eligible pair declares rivalry
    if (Math.random() < 0.35) {
      const fresh: Rivalry = {
        id,
        nameA: a.name, nameB: b.name,
        raceA: a.race, raceB: b.race,
        startedAt: Date.now(),
        rounds: 0,
        resolution: null,
      };
      result.rivalries.push(fresh);
      result.newPairs.push(fresh);
      known.add(id);
    }
  }

  return result;
};
