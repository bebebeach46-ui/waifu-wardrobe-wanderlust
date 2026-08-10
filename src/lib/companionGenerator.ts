import { Alignment } from "./deityGenerator";
import { SkillRank } from "./skillRankGenerator";

const companionNames = [
  "Sakura", "Asuna", "Rem", "Zero Two", "Mikasa", "Hinata", "Nami", "Ryuko",
  "Kirito", "Naruto", "Goku", "Saitama", "Luffy", "Ichigo", "Edward", "Spike",
  "Aqua", "Megumin", "Darkness", "Nezuko", "Power", "Makima", "Faye", "Bulma",
  // Dark fantasy
  "Morwen", "Cassius", "Elara", "Theron", "Lysara", "Severin", "Brenna",
  "Kaelen", "Isolde", "Draven", "Sable", "Fenris", "Nocturne", "Alaric",
  "Selene", "Malachai", "Vivienne", "Corvus", "Ashara", "Grimhild",
  "Lazarus", "Thessaly", "Oberon", "Ravenna", "Caius", "Vesper",
  "Mordred", "Ysabel", "Vashti", "Dante", "Circe", "Hadrian"
];

const companionRaces = [
  "Human", "High Elf", "Dark Elf", "Wood Elf", "Demon", "Angel", "Fallen Angel",
  "Catgirl (Neko)", "Doggirl (Inu)", "Foxgirl (Kitsune)", "Wolfgirl (Okami)",
  "Bunnygirl (Usagi)", "Mousegirl", "Raccoongirl (Tanuki)", "Squirrelgirl",
  "Android", "Cyborg", "Vampire", "Dhampir", "Werewolf", "Werefox",
  "Dragon-kin (Winged)", "Dragon-kin (Horned)", "Dragon-kin (Scaled)",
  "Kitsune (Multi-tailed)", "Oni (Horned)", "Oni (Tusked)",
  "Homunculus", "Nekomata (Twin-tailed)", "Bakeneko",
  "Succubus (Winged)", "Incubus (Horned)", "Dullahan (Headless)",
  "Lamia (Snake-tailed)", "Harpy (Winged)", "Arachne (Spider-bodied)",
  "Centaur", "Holstaur (Cow-eared)", "Minotaur (Horned)",
  "Slime Girl", "Dryad (Plant-bodied)", "Alraune (Flower-bodied)",
  "Mermaid (Fish-tailed)", "Siren (Scaled)", "Selkie",
  "Phoenix-kin (Flaming Wings)", "Tengu (Crow-winged)", "Valkyrie (Armored Wings)",
  "Zombie Girl", "Jiangshi (Hopping)", "Ghost Girl (Ethereal)",
  "Manticore (Scorpion-tailed)", "Sphinx (Lion-bodied)", "Chimera",
  "Goblin Girl", "Orc Girl (Tusked)", "Ogre Girl (Horned)",
  "Fairy (Butterfly Wings)", "Pixie (Dragonfly Wings)", "Imp (Bat Wings)",
  "Yuki-onna (Ice Horns)", "Jorogumo (Spider Features)", "Kappa (Turtle Shell)",
  "Anubis (Jackal-eared)", "Bastet (Cat-eared)", "Apophis (Snake Features)",
  // Dark fantasy
  "Revenant (Stitched)", "Wight (Frost-Veined)", "Shade (Translucent)",
  "Cambion (Smoldering)", "Hag-spawn (Gnarled)", "Plague Bearer (Scarred)",
  "Flesh Golem (Patchwork)", "Bone Naga (Skeletal)", "Banshee (Wailing)",
  "Wendigo-touched (Gaunt)", "Ghoul (Hollow-Eyed)", "Skinwalker (Shifting)",
  "Night Hag (Veiled)", "Wraith (Chained)", "Abyssal Scion (Void-Marked)",
  "Striga (Cursed)", "Moroi (Pale)", "Draugr (Barnacled)"
];

const companionClasses = [
  "Tsundere Warrior", "Kuudere Mage", "Yandere Assassin", "Dandere Healer",
  "Genki Ranger", "Senpai Knight", "Waifu Summoner", "Husbando Paladin",
  "Childhood Friend Fighter", "Rival Sorcerer", "Mysterious Stranger",
  // Dark fantasy
  "Blood Sentinel", "Grave Whisperer", "Hex Weaver", "Bone Collector",
  "Oathbreaker Knight", "Plague Alchemist", "Shadow Stalker", "Soul Shepherd",
  "Iron Maiden", "Carrion Crow", "Dread Chaplain", "Hollow Warden"
];

const preferences = [
  "Flowers", "Sweets", "Books", "Weapons", "Jewelry", "Rare Items", "Food",
  "Music", "Art", "Combat", "Magic Scrolls", "Potions", "Artifacts", "Pets",
  "Master Fishermen", "Expert Smiths", "Legendary Alchemists", "Fashion Icons",
  // Dark fantasy
  "Bone Carvings", "Cursed Relics", "Dried Herbs", "Blood Wine",
  "Funeral Rites", "Dark Poetry", "Trophy Skulls", "Ancient Tomes",
  "Moonstone", "Grave Dirt", "Venoms", "Occult Instruments"
];

const animeReferences = [
  "from the Hidden Leaf Village", "wielding a Stand", "with Sharingan eyes",
  "equipped with 3D Maneuver Gear", "carrying a Death Note", "with a Zanpakuto",
  "riding a Titan", "with Nen abilities", "from UA Academy", "with Devil Fruit powers",
  "blessed by Kami", "cursed by a Witch", "training for the Chunin Exams",
  // Dark fantasy
  "bearing the brand of a forgotten god", "with scars that weep black ichor",
  "whose shadow moves independently", "carrying a blade forged from a saint's bones",
  "with eyes that reflect no light", "marked by the Pale Court",
  "who speaks a language that predates the world", "bound to a dying oath",
  "wearing armor fused to their flesh", "followed by carrion birds",
  "with a voice like grinding stone", "smelling of grave ash and iron",
  "whose heartbeat echoes like a war drum", "branded by the Inquisition",
  "haunted by the ghost of someone they killed", "who has died twice already",
  "with veins visible through translucent skin", "exiled from a kingdom of the dead"
];

// Calculate compatibility based on player character
export const calculateCompatibility = (
  companion: any,
  playerRace: string,
  playerClass: string,
  playerSkills: any[],
  playerAlignment?: string
): number => {

  let compatibility = 0;
  
  // Race compatibility (same race = high compatibility)
  if (companion.race === playerRace) {
    compatibility += 3;
  }
  
  // Class compatibility (complementary classes)
  const classCompatibility: { [key: string]: string[] } = {
    "Warrior": ["Kuudere Mage", "Dandere Healer"],
    "Mage": ["Tsundere Warrior", "Husbando Paladin"],
    "Rogue": ["Yandere Assassin", "Genki Ranger"],
    "Scavenger": ["Yandere Assassin", "Mysterious Stranger"]
  };
  
  if (classCompatibility[playerClass]?.includes(companion.class)) {
    compatibility += 2;
  }
  
  // Skill preference match
  if (companion.skillPreference && playerSkills) {
    const hasMatchingSkill = playerSkills.some(s => s.rank === companion.skillPreference);
    if (hasMatchingSkill) {
      compatibility += 4; // High compatibility for skill match
    }
  }
  
  // Alignment affinity — close moral outlooks bond deeply
  const alignmentOrder = [
    "Utter Consumed Evil", "Very Evil", "Evil", "Slightly Evil",
    "Absolute Neutral", "Slightly Good", "Good", "Very Good", "Paragon of Shining Virtue"
  ];
  const ai = alignmentOrder.indexOf(companion.alignment);
  const pi = alignmentOrder.indexOf(playerAlignment ?? "");
  if (ai >= 0 && pi >= 0) {
    const gap = Math.abs(ai - pi);
    if (gap <= 1) compatibility += 2;
    else if (gap <= 3) compatibility += 1;
  }
  
  // Shared interests — each matching preference deepens attraction
  const shared = (companion.preferences || []).filter((p: string) =>
    (companion.playerPreferences || []).includes(p)).length;
  compatibility += Math.min(shared, 2);
  
  // Destiny spark — fate sometimes simply decides two souls belong together
  compatibility += Math.floor(Math.random() * 4); // 0-3
  
  return compatibility;
};


// ===== POOL CAPS =====
// Active slots: max companions that can travel with the hero at once
export const ACTIVE_COMPANION_SLOTS = 10;
// Reserve slots: companions waiting at home (auto-cycled when active dies)
export const RESERVE_COMPANION_SLOTS = 50;
// Heir slots: total successors that can be sired across all bond-10 partners
export const HEIR_SLOTS = 50;
// Hard cap on simultaneous Bond Rank 10 companions
export const MAX_BOND_10_COMPANIONS = 2;

// Determine bond level cap based on compatibility, party composition, and fame
export const getBondLevelCap = (
  companionIndex: number,
  compatibility: number,
  existingCompanions: any[],
  fame: number = 0
): number => {
  // Count how many companions are already at max bond
  const maxBondCompanions = existingCompanions.filter(c => c.bondCap === 10).length;
  
  // Fame bonus: every 10 fame lowers the compatibility threshold for bond 10
  // At 0 fame: need compatibility >= 5
  // At 50 fame: need compatibility >= 3
  // At 100+ fame: need compatibility >= 2
  const fameBonus = Math.min(fame / 10, 3); // max 3 points of threshold reduction
  const bond10Threshold = Math.max(2, 5 - Math.floor(fameBonus));
  
  // First MAX_BOND_10 high-compatibility companions can reach 10
  if (compatibility >= bond10Threshold && maxBondCompanions < MAX_BOND_10_COMPANIONS) {
    return 10;
  }
  
  // Fame can also promote medium-compatibility companions to bond 10
  if (compatibility >= 2 && maxBondCompanions < MAX_BOND_10_COMPANIONS) {
    // Base "soulmate" chance even for unremarkable pairings, scaling with fame
    const fameChance = Math.min(0.18 + fame * 0.003, 0.5);
    if (Math.random() < fameChance) {
      return 10;
    }
  }
  
  // Medium compatibility can reach 8
  if (compatibility >= 3) {
    return 8;
  }
  
  // Low compatibility stops at 5
  return 5;
};

// A capped companion who has maxed their bond can, rarely, transcend their cap
// (5 → 8 → 10) if a Bond-10 slot is open. Devotion beats destiny.
export const tryBondCapBreakthrough = (
  companion: any,
  allCompanions: any[],
  fame: number = 0
): { bondCap: number; breakthrough: boolean } => {
  const cap = companion.bondCap ?? 10;
  if (cap >= 10) return { bondCap: cap, breakthrough: false };
  // Must be pinned at their ceiling and not neglected
  if (companion.relationship < cap - 0.05) return { bondCap: cap, breakthrough: false };
  if ((companion.questsSinceInteraction ?? 0) > 10) return { bondCap: cap, breakthrough: false };
  
  const bond10Count = allCompanions.filter(c => (c.bondCap ?? 10) === 10).length;
  if (cap === 8 && bond10Count >= MAX_BOND_10_COMPANIONS) return { bondCap: cap, breakthrough: false };
  
  const chance = 0.04 + Math.min(fame * 0.0006, 0.06); // 4%–10% per quest at ceiling
  if (Math.random() < chance) {
    return { bondCap: cap === 5 ? 8 : 10, breakthrough: true };
  }
  return { bondCap: cap, breakthrough: false };
};




export const generateCompanion = (
  worldData: any,
  playerCharacter?: any,
  existingCompanions: any[] = [],
  fame: number = 0
) => {
  const name = companionNames[Math.floor(Math.random() * companionNames.length)];
  const race = companionRaces[Math.floor(Math.random() * companionRaces.length)];
  const companionClass = companionClasses[Math.floor(Math.random() * companionClasses.length)];
  const gender = Math.random() > 0.5 ? "Male" : "Female";
  const reference = animeReferences[Math.floor(Math.random() * animeReferences.length)];
  const age = generateCompanionAge(race);
  
  const companionPreferences = [];
  for (let i = 0; i < 3; i++) {
    const pref = preferences[Math.floor(Math.random() * preferences.length)];
    if (!companionPreferences.includes(pref)) {
      companionPreferences.push(pref);
    }
  }
  
  // Random alignment for companion
  const alignmentValues: Alignment[] = [
    "Utter Consumed Evil", "Very Evil", "Evil", "Slightly Evil",
    "Absolute Neutral", "Slightly Good", "Good", "Very Good", "Paragon of Shining Virtue"
  ];
  const alignment = alignmentValues[Math.floor(Math.random() * alignmentValues.length)];
  
  // Skill preference (30% chance they prefer a master-level skill)
  const skillPreference: SkillRank | null = Math.random() < 0.3 ? 
    (["Master", "Grandmaster"] as SkillRank[])[Math.floor(Math.random() * 2)] : null;
  
  const companion = {
    name,
    race,
    class: companionClass,
    gender,
    age,
    description: `${gender} ${race} ${reference}`,
    preferences: companionPreferences,
    relationship: 1,
    relationshipName: "Stranger",
    progressionRate: 0.5 + Math.random() * 1.5, // 0.5-2.0 points per quest
    gifts: [],
    alignment,
    skillPreference
  };
  
  // Calculate compatibility and bond cap if player character provided
  if (playerCharacter) {
    const compatibility = calculateCompatibility(
      { ...companion, playerPreferences: playerCharacter.preferences || [] },
      playerCharacter.race,
      playerCharacter.class,
      playerCharacter.skills || [],
      playerCharacter.alignment
    );

    const bondCap = getBondLevelCap(existingCompanions.length, compatibility, existingCompanions, fame);
    
    return {
      ...companion,
      compatibility,
      bondCap
    };
  }
  
  // Default for old saves
  return {
    ...companion,
    compatibility: 0,
    bondCap: 10
  };
};

export const getRelationshipName = (level: number): string => {
  if (level <= -9.5) return "Nemesis";
  if (level <= -8.5) return "Mortal Enemy";
  if (level <= -7.5) return "Sworn Enemy";
  if (level <= -6.5) return "Bitter Rival";
  if (level <= -5.5) return "Driven Enemy";
  if (level <= -4.5) return "Hostile";
  if (level <= -3.5) return "Antagonist";
  if (level <= -2.5) return "Unfriendly";
  if (level <= -1.5) return "Distrustful";
  if (level <= -0.5) return "Wary";
  
  const positiveNames = [
    "Stranger", "Acquaintance", "Friend", "Close Friend", "Trusted Ally",
    "Dear Friend", "Cherished", "Beloved", "Soulmate", "Devoted"
  ];
  return positiveNames[Math.min(Math.floor(level), 9)];
};

/**
 * Calculate relationship change after a quest based on performance, difficulty, 
 * companion preferences, fame, and current bond level.
 * 
 * Returns a delta that can be positive or negative.
 */
export const calculateRelationshipDelta = (
  performanceGrade: number,       // 0-10
  questDifficulty: number,        // 1-5
  fame: number,
  companionCompatibility: number, // 0-9
  currentRelationship: number,    // -10 to bondCap
  progressionRate: number,        // companion's base rate
  companionPreferences: string[], // what the companion values
  questType?: string              // optional quest theme
): number => {
  // Base delta: centered around grade 5 ("Completed") being neutral-positive
  // Below 3 = negative, 3-4 = small positive, 5+ = good positive
  let delta = 0;
  
  if (performanceGrade <= 0) {
    // Failed: significant relationship hit
    delta = -0.8 - (Math.random() * 0.5);
  } else if (performanceGrade <= 2) {
    // Barely survived / Poor: relationship suffers
    delta = -0.3 - (Math.random() * 0.3);
  } else if (performanceGrade <= 3) {
    // Mediocre: slight negative to slight positive
    delta = (Math.random() * 0.4) - 0.2;
  } else if (performanceGrade <= 4) {
    // Adequate: small positive
    delta = Math.random() * 0.3;
  } else if (performanceGrade <= 6) {
    // Completed / Good: solid positive
    delta = 0.2 + (Math.random() * 0.4);
  } else if (performanceGrade <= 8) {
    // Impressive / Outstanding: strong positive
    delta = 0.4 + (Math.random() * 0.5);
  } else {
    // Masterful / Exceptional: excellent
    delta = 0.6 + (Math.random() * 0.6);
  }
  
  // Difficulty scaling: harder quests amplify both gains and losses
  const difficultyScale = [0, 0.7, 1.0, 1.2, 1.5, 2.0];
  delta *= difficultyScale[questDifficulty] || 1.0;
  
  // Compatibility modifier: high compatibility = bond grows faster, low = slower
  // But incompatible companions are also MORE hurt by poor performance
  if (delta > 0) {
    delta *= 0.6 + (companionCompatibility * 0.1); // 0.6x to 1.5x for positive
  } else {
    delta *= 1.4 - (companionCompatibility * 0.08); // 1.4x to 0.68x for negative (low compat = worse)
  }
  
  // Fame modifier: famous heroes get more respect (reduces negative impact slightly)
  if (fame > 0) {
    const fameShield = Math.min(fame / 200, 0.3); // Up to 30% reduction in negativity
    if (delta < 0) {
      delta *= (1 - fameShield);
    } else {
      delta *= (1 + fameShield * 0.5); // Small fame bonus to positive gains
    }
  }
  
  // Current relationship momentum: 
  // Already negative relationships are harder to improve, easier to worsen
  // Already positive relationships are slightly more resilient
  if (currentRelationship < 0) {
    if (delta > 0) {
      delta *= 0.7; // Harder to climb back from negativity
    } else {
      delta *= 1.2; // Easier to spiral deeper
    }
  } else if (currentRelationship > 5) {
    if (delta < 0) {
      delta *= 0.8; // Strong bonds are more resilient
    }
  }
  
  // Apply companion's base progression rate as a final scalar
  delta *= progressionRate * 0.6;
  
  // Random variance: relationships are messy
  delta += (Math.random() - 0.5) * 0.15;
  
  return delta;
};

/**
 * Check if a companion at negative relationship becomes a threat
 */
export const isCompanionThreat = (relationship: number): { isThreat: boolean; severity: string; combatBonus: number } => {
  if (relationship > -5) return { isThreat: false, severity: "none", combatBonus: 0 };
  if (relationship > -8) return { isThreat: true, severity: "dangerous", combatBonus: 15 };
  if (relationship > -9.5) return { isThreat: true, severity: "deadly", combatBonus: 30 };
  return { isThreat: true, severity: "nemesis", combatBonus: 50 };
};

// Relationship milestone events (like VN scene unlocks)
export type RelationshipMilestone = {
  level: number;
  name: string;
  description: string;
  unlockedAt: number;
  companionName: string;
  companionRace: string;
};

const milestoneEvents: Record<number, { name: string; descriptions: string[] }> = {
  2: { 
    name: "First Conversation",
    descriptions: [
      "Shared an awkward introduction at the campfire",
      "Had a chance encounter at the tavern",
      "Exchanged names after a battle"
    ]
  },
  3: {
    name: "Shared Meal",
    descriptions: [
      "Cooked a meal together after a quest",
      "Shared rations during a long journey",
      "Tried local cuisine at a festival"
    ]
  },
  4: {
    name: "Trust Exercise",
    descriptions: [
      "Watched each other's backs in a dungeon",
      "Revealed a personal secret",
      "Defended each other from slander"
    ]
  },
  5: {
    name: "Heart-to-Heart",
    descriptions: [
      "Talked through the night about dreams",
      "Shared childhood memories by moonlight",
      "Confided fears and hopes for the future"
    ]
  },
  6: {
    name: "Gift Exchange",
    descriptions: [
      "Exchanged meaningful gifts",
      "Created matching accessories",
      "Found a treasure that reminded them of each other"
    ]
  },
  7: {
    name: "Near-Death Experience",
    descriptions: [
      "Saved each other from certain death",
      "Made a desperate pact to survive together",
      "Cried tears of relief at the other's survival"
    ]
  },
  8: {
    name: "Confession Scene",
    descriptions: [
      "Confessed feelings under a starlit sky",
      "Admitted attraction during a heated moment",
      "Realized the depth of their bond"
    ]
  },
  9: {
    name: "First Kiss",
    descriptions: [
      "Shared a passionate kiss after a victory",
      "A gentle first kiss in a quiet moment",
      "An unexpected kiss that changed everything"
    ]
  },
  10: {
    name: "Eternal Bond",
    descriptions: [
      "Exchanged vows of eternal commitment",
      "Performed a soul-binding ritual",
      "Became partners for life in a sacred ceremony"
    ]
  }
};

export const generateMilestone = (
  level: number,
  companionName: string,
  companionRace: string
): RelationshipMilestone | null => {
  const event = milestoneEvents[level];
  if (!event) return null;
  
  const description = event.descriptions[Math.floor(Math.random() * event.descriptions.length)];
  
  return {
    level,
    name: event.name,
    description,
    unlockedAt: Date.now(),
    companionName,
    companionRace
  };
};

// Child generation from max bond (10) relationship
export type ChildInfo = {
  name: string;
  gender: "Male" | "Female";
  parentName: string;
  parentRace: string;
  otherParentName: string;
  otherParentRace: string;
  bornAt: number;
  traits: string[];
};

const childNames = {
  male: ["Aiden", "Kazuki", "Leon", "Ryu", "Shin", "Takeshi", "Yuki", "Zero", "Kai", "Hiro"],
  female: ["Aria", "Hana", "Luna", "Mika", "Rina", "Sora", "Yuna", "Kira", "Mei", "Sakura"]
};

const childTraits = [
  "Has their father's eyes",
  "Has their mother's smile", 
  "Inherited magical potential",
  "Born under a lucky star",
  "Destined for greatness",
  "Inherited combat instincts",
  "Shows signs of supernatural heritage",
  "Blessed by the deity",
  "Has a mysterious birthmark",
  "Already showing adventurer spirit"
];

export const generateChild = (
  playerName: string,
  playerRace: string,
  companionName: string,
  companionRace: string
): ChildInfo => {
  const gender: "Male" | "Female" = Math.random() < 0.5 ? "Male" : "Female";
  const namePool = gender === "Male" ? childNames.male : childNames.female;
  const name = namePool[Math.floor(Math.random() * namePool.length)];
  
  // Select 2-3 random traits
  const numTraits = 2 + Math.floor(Math.random() * 2);
  const selectedTraits: string[] = [];
  const shuffledTraits = [...childTraits].sort(() => Math.random() - 0.5);
  for (let i = 0; i < numTraits && i < shuffledTraits.length; i++) {
    selectedTraits.push(shuffledTraits[i]);
  }
  
  return {
    name,
    gender,
    parentName: playerName,
    parentRace: playerRace,
    otherParentName: companionName,
    otherParentRace: companionRace,
    bornAt: Date.now(),
    traits: selectedTraits
  };
};

// Generate companion age based on race
export const generateCompanionAge = (race: string): number => {
  const [adult, max] = getRaceLifespan(race);
  // Spawn between adult and ~60% of max so they have years left to live
  const upper = Math.max(adult + 5, Math.floor(adult + (max - adult) * 0.6));
  return Math.floor(Math.random() * (upper - adult)) + adult;
};

// Returns [adultAge, naturalMaxAge] in years for a given race
export const getRaceLifespan = (race: string): [number, number] => {
  const lifespans: Record<string, [number, number]> = {
    "Human": [18, 80],
    "High Elf": [100, 900],
    "Dark Elf": [100, 700],
    "Wood Elf": [80, 600],
    "Demon": [100, 1500],
    "Angel": [200, 4000],
    "Fallen Angel": [150, 3000],
    "Vampire": [100, 3000],
    "Dhampir": [25, 250],
    "Werewolf": [20, 120],
    "Werefox": [25, 200],
    "Android": [1, 60],
    "Cyborg": [20, 130],
    "Catgirl (Neko)": [16, 70],
    "Doggirl (Inu)": [16, 65],
    "Foxgirl (Kitsune)": [18, 200],
    "Wolfgirl (Okami)": [18, 90],
    "Bunnygirl (Usagi)": [16, 60],
    "Mousegirl": [14, 50],
    "Raccoongirl (Tanuki)": [16, 80],
    "Squirrelgirl": [14, 55],
    "Dragon-kin (Winged)": [50, 800],
    "Dragon-kin (Horned)": [50, 800],
    "Dragon-kin (Scaled)": [50, 800],
    "Half-Dragon": [40, 500],
    "Kitsune (Multi-tailed)": [100, 1500],
    "Oni (Horned)": [30, 250],
    "Oni (Tusked)": [30, 250],
    "Homunculus": [1, 40],
    "Nekomata (Twin-tailed)": [50, 400],
    "Bakeneko": [50, 400],
    "Succubus (Winged)": [100, 1500],
    "Incubus (Horned)": [100, 1500],
    "Dullahan (Headless)": [100, 800],
    "Lamia (Snake-tailed)": [40, 400],
    "Harpy (Winged)": [18, 90],
    "Arachne (Spider-bodied)": [30, 200],
    "Centaur": [25, 150],
    "Holstaur (Cow-eared)": [18, 80],
    "Minotaur (Horned)": [25, 150],
    "Slime Girl": [1, 50],
    "Dryad (Plant-bodied)": [40, 600],
    "Alraune (Flower-bodied)": [20, 200],
    "Mermaid (Fish-tailed)": [18, 150],
    "Siren (Scaled)": [25, 250],
    "Selkie": [20, 200],
    "Phoenix-kin (Flaming Wings)": [50, 1000],
    "Tengu (Crow-winged)": [40, 400],
    "Valkyrie (Armored Wings)": [100, 2000],
    "Zombie Girl": [1, 100],
    "Jiangshi (Hopping)": [50, 500],
    "Ghost Girl (Ethereal)": [50, 800],
    "Manticore (Scorpion-tailed)": [40, 300],
    "Sphinx (Lion-bodied)": [50, 600],
    "Chimera": [30, 250],
    "Goblin Girl": [12, 50],
    "Orc Girl (Tusked)": [16, 70],
    "Ogre Girl (Horned)": [25, 120],
    "Fairy (Butterfly Wings)": [20, 300],
    "Pixie (Dragonfly Wings)": [20, 300],
    "Imp (Bat Wings)": [30, 400],
    "Yuki-onna (Ice Horns)": [50, 600],
    "Jorogumo (Spider Features)": [50, 500],
    "Kappa (Turtle Shell)": [25, 250],
    "Anubis (Jackal-eared)": [40, 400],
    "Bastet (Cat-eared)": [40, 400],
    "Apophis (Snake Features)": [60, 800],
    "Revenant (Stitched)": [1, 200],
    "Wight (Frost-Veined)": [50, 500],
    "Shade (Translucent)": [50, 600],
    "Cambion (Smoldering)": [40, 400],
    "Hag-spawn (Gnarled)": [40, 350],
    "Plague Bearer (Scarred)": [18, 60],
    "Flesh Golem (Patchwork)": [1, 80],
    "Bone Naga (Skeletal)": [50, 600],
    "Banshee (Wailing)": [40, 700],
    "Wendigo-touched (Gaunt)": [25, 200],
    "Ghoul (Hollow-Eyed)": [20, 150],
    "Skinwalker (Shifting)": [30, 250],
    "Night Hag (Veiled)": [60, 600],
    "Wraith (Chained)": [50, 800],
    "Abyssal Scion (Void-Marked)": [40, 600],
    "Striga (Cursed)": [30, 300],
    "Moroi (Pale)": [40, 500],
    "Draugr (Barnacled)": [50, 400],
  };
  
  let range = lifespans[race];
  if (!range) {
    const partialMatch = Object.keys(lifespans).find(key => race.includes(key) || key.includes(race.split(" ")[0]));
    range = partialMatch ? lifespans[partialMatch] : [18, 75];
  }
  return range;
};

export type CompanionDeathCause =
  | "old_age"
  | "betrayal"
  | "assassination"
  | "ambush"
  | "heroic_sacrifice"
  | "peaceful_passing";

/**
 * Age a companion by N years. Returns updated companion plus death info.
 * Death chance scales by:
 *   - Natural lifespan proximity (old age)
 *   - Bond rank: hostile (negative) companions can betray/assassinate
 *   - Area danger: dangerous areas amplify ambush/betrayal risk
 *   - High-bond (8+) companions in safe areas may pass peacefully; in deadly
 *     areas they may die in heroic sacrifice
 */
export const tickCompanionAge = (
  companion: any,
  years: number = 1,
  areaDanger: number = 0 // 0-13 typical (region 1-10 + area mod -2..+3)
): {
  companion: any;
  died: boolean;
  ofOldAge: boolean;
  cause: CompanionDeathCause | null;
  narrative: string | null;
} => {
  const newAge = (companion.age || 18) + years;
  const [, maxAge] = getRaceLifespan(companion.race);
  const bond = typeof companion.relationship === "number" ? companion.relationship : 1;
  const name = companion.name || "Companion";
  const race = companion.race || "Unknown";

  // ---- 1. Natural old-age check ----
  let died = false;
  let cause: CompanionDeathCause | null = null;
  let narrative: string | null = null;

  if (newAge >= maxAge) {
    died = true;
    cause = "old_age";
    narrative = `${name} (${race}, age ${newAge}) reached the end of their natural lifespan`;
  } else if (newAge >= maxAge * 0.8) {
    const proximity = (newAge - maxAge * 0.8) / (maxAge * 0.2);
    const deathChance = proximity * proximity * 0.35;
    if (Math.random() < deathChance) {
      died = true;
      cause = "old_age";
      narrative = `${name} (${race}) succumbed to the weight of years (age ${newAge})`;
    }
  }

  // ---- 2. Bond/danger-driven risks (independent of age) ----
  // Skip if already died of old age
  if (!died) {
    // Normalize danger: 0..13 → 0..1
    const dangerNorm = Math.min(1, Math.max(0, areaDanger / 13));

    if (bond <= -5) {
      // Hostile companions: betrayal/assassination/ambush risk
      // Severity ramps with how negative the bond is and how dangerous the area
      const hostility = Math.min(1, (-bond - 4) / 6); // -5 → 0.17, -10 → 1.0
      // Base 4% per tick, scaled by hostility & danger (dangerous lands embolden enemies)
      const treacheryChance = 0.04 + hostility * 0.18 + dangerNorm * hostility * 0.22;
      if (Math.random() < treacheryChance) {
        died = true;
        const roll = Math.random();
        if (bond <= -8 && roll < 0.5) {
          cause = "assassination";
          narrative = `${name} attempted assassination — they were slain in the struggle`;
        } else if (dangerNorm > 0.5 && roll < 0.7) {
          cause = "ambush";
          narrative = `${name} led you into an ambush in the dangerous wilds — the plot collapsed and they fell`;
        } else {
          cause = "betrayal";
          narrative = `${name} turned their blade on you — the betrayal cost them their life`;
        }
      }
    } else if (bond >= 8) {
      // Devoted companions in deadly areas may sacrifice themselves
      if (dangerNorm > 0.55) {
        const sacrificeChance = 0.015 + (dangerNorm - 0.55) * 0.06; // up to ~4%
        if (Math.random() < sacrificeChance) {
          died = true;
          cause = "heroic_sacrifice";
          narrative = `${name} threw themselves between you and certain death — a heroic sacrifice`;
        }
      } else if (dangerNorm < 0.2 && newAge >= maxAge * 0.6) {
        // Aging high-bond companions in safe areas may pass peacefully
        const peaceChance = 0.01;
        if (Math.random() < peaceChance) {
          died = true;
          cause = "peaceful_passing";
          narrative = `${name} (${race}) passed peacefully in their sleep, surrounded by the bonds they cherished`;
        }
      }
    } else if (bond >= 0 && bond < 5 && dangerNorm > 0.6) {
      // Lukewarm bonds in very dangerous areas: small abandonment-turned-fatal risk
      const fadeChance = 0.005 + (dangerNorm - 0.6) * 0.02;
      if (Math.random() < fadeChance) {
        died = true;
        cause = "ambush";
        narrative = `${name} fell behind in the perilous lands — found later, ambushed`;
      }
    }
  }

  return {
    companion: { ...companion, age: newAge },
    died,
    ofOldAge: cause === "old_age",
    cause,
    narrative,
  };
};

// ========== PASSIVE MOOD DRIFT ==========
// Each quest, companions drift slightly based on the area's calm/danger and
// how long the hero has neglected them. The hero cannot directly control this —
// they can only observe the algorithm play out and hope.

/**
 * Apply per-quest passive mood drift to a companion.
 *
 * - Calm areas (low danger) gradually pull bonds toward stable values:
 *     hostile bonds slowly heal upward; positive bonds receive a tiny lift.
 * - Dangerous areas suppress this stabilization (stress prevents reconciliation).
 * - The longer a companion goes without an interaction (gift, apology, repair quest),
 *   the more their bond decays. Decay accelerates after long neglect.
 */
export const applyMoodDrift = (
  companion: any,
  areaDanger: number, // 0..13 typical
): { relationship: number; driftTag: "stabilized" | "neglected" | "ignored" | "abandoned" | null } => {
  const bond = typeof companion.relationship === "number" ? companion.relationship : 1;
  const bondCap = companion.bondCap ?? 10;
  const ignored = companion.questsSinceInteraction ?? 0;

  const dangerNorm = Math.min(1, Math.max(0, areaDanger / 13));
  const calm = 1 - dangerNorm;

  let drift = 0;
  let driftTag: "stabilized" | "neglected" | "ignored" | "abandoned" | null = null;

  // Stabilization in calm areas (only meaningful below danger ~0.45)
  if (calm > 0.55) {
    if (bond < 0) {
      // Hostile bonds: slow upward pull toward 0
      const pull = (0.04 + calm * 0.06) * Math.min(1, Math.abs(bond) / 5);
      drift += pull;
      if (Math.random() < 0.35) driftTag = "stabilized";
    } else if (bond > 0 && bond < bondCap && ignored < 8) {
      // Positive bonds: tiny passive warmth — only if not being ignored
      drift += 0.02 * calm;
    }
  }

  // Neglect decay (independent of area; ramps with ignored quests)
  if (ignored >= 6) {
    const overdue = ignored - 6;
    let decay = 0.03 + Math.min(overdue, 20) * 0.012; // up to ~0.27 per quest
    if (bond < 0) decay *= 1.5;       // resentment compounds
    if (bond >= 8) decay *= 0.5;      // soul-bonded are patient
    decay *= 1 + dangerNorm * 0.6;    // danger amplifies neglect

    drift -= decay;

    if (overdue >= 20) driftTag = "abandoned";
    else if (overdue >= 12) driftTag = "ignored";
    else driftTag = "neglected";
  }

  const newRel = Math.max(-10, Math.min(bondCap, bond + drift));
  return { relationship: newRel, driftTag };
};



/**
 * Calculate gift effectiveness based on whether it matches companion preferences.
 * Returns a multiplier: 0.3x (hated), 1x (neutral), 2-3x (loved).
 */
export const calculateGiftEffectiveness = (
  giftCategory: string,
  companionPreferences: string[],
  currentRelationship: number
): { multiplier: number; reaction: string; icon: string } => {
  const isPreferred = companionPreferences.some(
    pref => pref.toLowerCase().includes(giftCategory.toLowerCase()) ||
            giftCategory.toLowerCase().includes(pref.toLowerCase())
  );
  
  // Deep negative relationships are suspicious of gifts
  if (currentRelationship <= -7) {
    if (isPreferred) {
      return { multiplier: 1.2, reaction: "grudgingly accepted", icon: "😤" };
    }
    return { multiplier: 0.3, reaction: "threw it back at you", icon: "💢" };
  }
  
  if (currentRelationship <= -4) {
    if (isPreferred) {
      return { multiplier: 1.8, reaction: "was surprised by your thoughtfulness", icon: "😳" };
    }
    return { multiplier: 0.5, reaction: "barely acknowledged it", icon: "😒" };
  }
  
  if (isPreferred) {
    // Loved gift — bonus is stronger at negative relationships (repair value)
    const repairBonus = currentRelationship < 0 ? 0.5 : 0;
    return { 
      multiplier: 2.5 + repairBonus, 
      reaction: "absolutely loved it!", 
      icon: "💖" 
    };
  }
  
  return { multiplier: 1.0, reaction: "appreciated the gesture", icon: "🎁" };
};

/**
 * Gift categories mapped to companion preferences for matching.
 */
export const giftPreferenceMap: Record<string, string[]> = {
  "Chocolate Box": ["Sweets", "Food"],
  "Bouquet of Flowers": ["Flowers", "Art"],
  "Legendary Gift Box": ["Rare Items", "Artifacts"],
  "Marriage Proposal Ring": ["Jewelry"],
  "Apology Letter": [],  // Works on everyone equally
  "Peace Offering Feast": ["Food", "Sweets"],
  "Handcrafted Weapon": ["Weapons", "Combat"],
  "Enchanted Jewelry": ["Jewelry", "Magic Scrolls"],
  "Rare Book Collection": ["Books", "Art"],
  "Concert Tickets": ["Music"],
  "Exotic Pet Egg": ["Pets"],
  "Alchemist's Bundle": ["Potions"],
};

/**
 * Apology events that can fire randomly when a companion is at negative relationship.
 * Returns the relationship bonus and narrative text.
 */
export type ApologyEvent = {
  name: string;
  description: string;
  relationshipGain: number;
  icon: string;
  minRelationship: number; // Only triggers at or below this level
  successChance: number;   // 0-1
};

const apologyEvents: ApologyEvent[] = [
  {
    name: "Campfire Apology",
    description: "sat down with {companion} by the campfire and sincerely apologized for past failures",
    relationshipGain: 0.8,
    icon: "🔥",
    minRelationship: 0,
    successChance: 0.7
  },
  {
    name: "Saved from Danger",
    description: "threw themselves in front of {companion} to block a surprise attack",
    relationshipGain: 1.5,
    icon: "🛡️",
    minRelationship: -3,
    successChance: 0.5
  },
  {
    name: "Public Defense",
    description: "defended {companion}'s honor in front of a crowd of skeptics",
    relationshipGain: 1.0,
    icon: "📢",
    minRelationship: -2,
    successChance: 0.65
  },
  {
    name: "Heartfelt Confession",
    description: "broke down and admitted their mistakes to {companion}, baring their soul",
    relationshipGain: 1.2,
    icon: "💬",
    minRelationship: -5,
    successChance: 0.4
  },
  {
    name: "Revenge Fulfilled",
    description: "tracked down and defeated the monster that once humiliated {companion}",
    relationshipGain: 2.0,
    icon: "⚔️",
    minRelationship: -7,
    successChance: 0.3
  },
  {
    name: "Sacrifice Play",
    description: "gave up a legendary reward so {companion} could have it instead",
    relationshipGain: 2.5,
    icon: "✨",
    minRelationship: -9,
    successChance: 0.2
  }
];

/**
 * Roll for an apology event. Only triggers for companions with negative relationships.
 * Chance scales with how negative the relationship is (worse = more likely to trigger, but harder to succeed).
 */
export const rollForApologyEvent = (
  companionName: string,
  currentRelationship: number,
  fame: number
): { event: ApologyEvent; success: boolean; actualGain: number } | null => {
  // Only triggers for negative relationships
  if (currentRelationship >= 0) return null;
  
  // 8% base chance per quest tick, higher when deeply negative
  const triggerChance = 0.08 + (Math.abs(currentRelationship) * 0.01);
  if (Math.random() > triggerChance) return null;
  
  // Filter eligible events
  const eligible = apologyEvents.filter(e => currentRelationship <= e.minRelationship);
  if (eligible.length === 0) return null;
  
  const event = eligible[Math.floor(Math.random() * eligible.length)];
  
  // Fame boosts success chance slightly
  const fameBonus = Math.min(fame / 500, 0.15);
  const success = Math.random() < (event.successChance + fameBonus);
  
  // Failed apologies still give a tiny bit back (0.1-0.2), showing effort
  const actualGain = success ? event.relationshipGain : 0.1 + Math.random() * 0.1;
  
  return { event, success, actualGain };
};

/**
 * Repair side quest — a special quest that triggers when a companion is hostile.
 * Completing it gives a large relationship boost.
 */
export type RepairQuest = {
  name: string;
  description: string;
  companionName: string;
  targetRelationshipGain: number;
  difficulty: string;
  icon: string;
};

const repairQuestTemplates = [
  {
    name: "Retrieve {companion}'s Lost Heirloom",
    description: "A family treasure was stolen. Finding it could prove your worth.",
    targetRelationshipGain: 3.0,
    difficulty: "Hard",
    icon: "🏺"
  },
  {
    name: "Clear {companion}'s Name",
    description: "False accusations tarnish their reputation. Only you can set things right.",
    targetRelationshipGain: 2.5,
    difficulty: "Medium",
    icon: "📜"
  },
  {
    name: "Protect {companion}'s Homeland",
    description: "Their village is under threat. Defending it would mean everything.",
    targetRelationshipGain: 4.0,
    difficulty: "Very Hard",
    icon: "🏘️"
  },
  {
    name: "Fulfill {companion}'s Dream",
    description: "They once spoke of a dream they'd abandoned. You could make it real.",
    targetRelationshipGain: 3.5,
    difficulty: "Hard",
    icon: "⭐"
  },
  {
    name: "Duel for {companion}'s Respect",
    description: "Challenge them to an honorable duel. Win or lose, they'll respect the attempt.",
    targetRelationshipGain: 2.0,
    difficulty: "Medium",
    icon: "🤺"
  },
  {
    name: "Cook {companion}'s Favorite Dish",
    description: "The way to anyone's heart is through their stomach. Probably.",
    targetRelationshipGain: 1.5,
    difficulty: "Easy",
    icon: "🍳"
  }
];

/**
 * Roll for a repair quest trigger. Only for companions at -3 or below.
 */
export const rollForRepairQuest = (
  companionName: string,
  currentRelationship: number,
  questsCompleted: number
): RepairQuest | null => {
  if (currentRelationship > -3) return null;
  
  // 5% chance per quest, cooldown of 20 quests between attempts
  if (Math.random() > 0.05) return null;
  
  // Pick a template scaled to how bad the relationship is
  const severity = Math.abs(currentRelationship);
  const eligible = repairQuestTemplates.filter(t => {
    if (severity >= 7) return true; // All templates available for deep negativity
    if (severity >= 5) return t.targetRelationshipGain <= 3.5;
    return t.targetRelationshipGain <= 2.5;
  });
  
  const template = eligible[Math.floor(Math.random() * eligible.length)];
  if (!template) return null;
  
  return {
    ...template,
    name: template.name.replace("{companion}", companionName),
    description: template.description,
    companionName
  };
};

/**
 * Calculate repair quest reward — performance on the repair quest scales the gain.
 */
export const calculateRepairQuestReward = (
  repairQuest: RepairQuest,
  performanceGrade: number // 0-10
): { relationshipGain: number; narrative: string } => {
  if (performanceGrade <= 2) {
    return {
      relationshipGain: repairQuest.targetRelationshipGain * 0.2,
      narrative: `Attempted "${repairQuest.name}" but performed poorly. ${repairQuest.companionName} noticed the effort, at least.`
    };
  }
  if (performanceGrade <= 4) {
    return {
      relationshipGain: repairQuest.targetRelationshipGain * 0.5,
      narrative: `Partially completed "${repairQuest.name}". ${repairQuest.companionName} is warming up slightly.`
    };
  }
  if (performanceGrade <= 7) {
    return {
      relationshipGain: repairQuest.targetRelationshipGain * 0.8,
      narrative: `Successfully completed "${repairQuest.name}"! ${repairQuest.companionName} is reconsidering their feelings.`
    };
  }
  return {
    relationshipGain: repairQuest.targetRelationshipGain * 1.2,
    narrative: `Masterfully completed "${repairQuest.name}"! ${repairQuest.companionName} was deeply moved.`
  };
};
