import { Alignment } from "./deityGenerator";
import { SkillRank } from "./skillRankGenerator";

const companionNames = [
  "Sakura", "Asuna", "Rem", "Zero Two", "Mikasa", "Hinata", "Nami", "Ryuko",
  "Kirito", "Naruto", "Goku", "Saitama", "Luffy", "Ichigo", "Edward", "Spike",
  "Aqua", "Megumin", "Darkness", "Nezuko", "Power", "Makima", "Faye", "Bulma"
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
  "Anubis (Jackal-eared)", "Bastet (Cat-eared)", "Apophis (Snake Features)"
];

const companionClasses = [
  "Tsundere Warrior", "Kuudere Mage", "Yandere Assassin", "Dandere Healer",
  "Genki Ranger", "Senpai Knight", "Waifu Summoner", "Husbando Paladin",
  "Childhood Friend Fighter", "Rival Sorcerer", "Mysterious Stranger"
];

const preferences = [
  "Flowers", "Sweets", "Books", "Weapons", "Jewelry", "Rare Items", "Food",
  "Music", "Art", "Combat", "Magic Scrolls", "Potions", "Artifacts", "Pets",
  "Master Fishermen", "Expert Smiths", "Legendary Alchemists", "Fashion Icons"
];

const animeReferences = [
  "from the Hidden Leaf Village", "wielding a Stand", "with Sharingan eyes",
  "equipped with 3D Maneuver Gear", "carrying a Death Note", "with a Zanpakuto",
  "riding a Titan", "with Nen abilities", "from UA Academy", "with Devil Fruit powers",
  "blessed by Kami", "cursed by a Witch", "training for the Chunin Exams"
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
