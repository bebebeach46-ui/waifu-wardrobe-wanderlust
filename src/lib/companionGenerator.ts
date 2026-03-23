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
  playerSkills: any[]
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
  
  return compatibility;
};

// Determine bond level cap based on compatibility and party composition
export const getBondLevelCap = (
  companionIndex: number,
  compatibility: number,
  existingCompanions: any[]
): number => {
  // Count how many companions are already at max bond
  const maxBondCompanions = existingCompanions.filter(c => c.bondCap === 10).length;
  
  // First 2 high-compatibility companions can reach 10
  if (compatibility >= 5 && maxBondCompanions < 2) {
    return 10;
  }
  
  // Medium compatibility can reach 8
  if (compatibility >= 3) {
    return 8;
  }
  
  // Low compatibility stops at 5
  return 5;
};

export const generateCompanion = (
  worldData: any,
  playerCharacter?: any,
  existingCompanions: any[] = []
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
      companion,
      playerCharacter.race,
      playerCharacter.class,
      playerCharacter.skills || []
    );
    const bondCap = getBondLevelCap(existingCompanions.length, compatibility, existingCompanions);
    
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
  const ageRanges: Record<string, [number, number]> = {
    "Human": [18, 40],
    "High Elf": [100, 500],
    "Dark Elf": [100, 400],
    "Wood Elf": [80, 300],
    "Demon": [100, 800],
    "Angel": [200, 2000],
    "Fallen Angel": [150, 1500],
    "Vampire": [100, 1500],
    "Dhampir": [25, 200],
    "Werewolf": [20, 80],
    "Android": [1, 30],
    "Cyborg": [20, 60],
    "Dragon-kin (Winged)": [50, 400],
    "Dragon-kin (Horned)": [50, 400],
    "Dragon-kin (Scaled)": [50, 400],
    "Kitsune (Multi-tailed)": [100, 1000],
    "Succubus (Winged)": [100, 800],
    "Incubus (Horned)": [100, 800],
    "Ghost Girl (Ethereal)": [50, 500],
    "Fairy (Butterfly Wings)": [20, 200],
    "Mermaid (Fish-tailed)": [18, 100],
  };
  
  // Try exact match, then partial match, then default
  let range = ageRanges[race];
  if (!range) {
    const partialMatch = Object.keys(ageRanges).find(key => race.includes(key) || key.includes(race.split(" ")[0]));
    range = partialMatch ? ageRanges[partialMatch] : [18, 50];
  }
  
  const [min, max] = range;
  return Math.floor(Math.random() * (max - min)) + min;
};

// ========== RELATIONSHIP REPAIR MECHANICS ==========

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
