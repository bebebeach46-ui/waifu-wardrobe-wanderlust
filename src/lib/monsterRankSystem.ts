export interface MonsterRank {
  rank: number;
  name: string;
  description: string;
  minLevel: number;
  shardDropChance: number; // 0 = no drop, 0.01 = 1% chance
  goldMultiplier: number;
  expMultiplier: number;
}

export const monsterRanks: MonsterRank[] = [
  {
    rank: 1,
    name: "Pest",
    description: "Weak creatures barely worth the effort",
    minLevel: 1,
    shardDropChance: 0,
    goldMultiplier: 0.5,
    expMultiplier: 0.5
  },
  {
    rank: 2,
    name: "Trash Mob",
    description: "Common enemies, easy pickings",
    minLevel: 3,
    shardDropChance: 0,
    goldMultiplier: 1,
    expMultiplier: 1
  },
  {
    rank: 3,
    name: "Minion",
    description: "Slightly threatening fodder",
    minLevel: 5,
    shardDropChance: 0,
    goldMultiplier: 1.5,
    expMultiplier: 1.5
  },
  {
    rank: 4,
    name: "Elite",
    description: "Worthy opponents with some skill",
    minLevel: 8,
    shardDropChance: 0,
    goldMultiplier: 2,
    expMultiplier: 2
  },
  {
    rank: 5,
    name: "Powerful",
    description: "Dangerous foes that drop shards",
    minLevel: 12,
    shardDropChance: 0.01, // 1% chance
    goldMultiplier: 3,
    expMultiplier: 3
  },
  {
    rank: 6,
    name: "Boss",
    description: "Major threats with valuable drops",
    minLevel: 18,
    shardDropChance: 0.03, // 3% chance
    goldMultiplier: 5,
    expMultiplier: 5
  },
  {
    rank: 7,
    name: "Epic",
    description: "Legendary creatures of immense power",
    minLevel: 25,
    shardDropChance: 0.05, // 5% chance
    goldMultiplier: 8,
    expMultiplier: 8
  },
  {
    rank: 8,
    name: "Mythic",
    description: "Ancient beings from forgotten eras",
    minLevel: 35,
    shardDropChance: 0.08, // 8% chance
    goldMultiplier: 12,
    expMultiplier: 12
  },
  {
    rank: 9,
    name: "Calamity",
    description: "World-ending entities of pure destruction",
    minLevel: 50,
    shardDropChance: 0.15, // 15% chance
    goldMultiplier: 20,
    expMultiplier: 20
  },
  {
    rank: 10,
    name: "Dragon",
    description: "Ultimate apex predators, gods among monsters",
    minLevel: 75,
    shardDropChance: 0.25, // 25% chance
    goldMultiplier: 50,
    expMultiplier: 50
  }
];

// Monster types by rank with anime/absurd flavoring
export const monsterNamesByRank: Record<number, string[]> = {
  1: [
    "Horny Slime", "Cheeky Goblin", "Tsundere Rat", "Useless Skeleton",
    "Wimpy Kobold", "Perverted Imp", "Annoying Pixie", "Pathetic Zombie"
  ],
  2: [
    "Generic Orc", "Basic Bitch Wolf", "Normie Bandit", "NPC Thief",
    "Forgettable Guard", "Random Soldier", "Background Character", "Mob #42"
  ],
  3: [
    "Senpai's Minion", "Henchman-kun", "Sub-Boss Lackey", "Elite Goon",
    "Wannabe Villain", "Chuunibyou Knight", "Edgy Assassin", "Try-Hard Mage"
  ],
  4: [
    "Slightly Threatening Ogre", "Actually Dangerous Troll", "Competent Wyvern",
    "Skilled Dark Mage", "Professional Mercenary", "Veteran Warrior", "Elite Guard Captain"
  ],
  5: [
    "Powerful Demon Lord", "Thicc Dragon Whelp", "Yandere Succubus Queen",
    "Overpowered Lich", "Main Villain's Lieutenant", "Chapter Boss", "Arc Antagonist"
  ],
  6: [
    "Raid Boss Golem", "Dungeon Master", "Floor Guardian", "Guild Boss",
    "Legendary Beast", "Ancient Behemoth", "Forbidden One", "That One Boss You Can't Beat"
  ],
  7: [
    "Epic Dragon Knight", "Mythical Phoenix", "Legendary Kraken",
    "Ancient Leviathan", "Primordial Titan", "Celestial Guardian", "Cosmic Horror"
  ],
  8: [
    "Mythic Elder Dragon", "Progenitor Demon", "First Vampire Lord",
    "Original Sin Incarnate", "Eldritch Abomination", "Reality Warper", "Dimension Eater"
  ],
  9: [
    "World-Ending Apocalypse Beast", "Civilization Destroyer", "Planet Eater",
    "Star Devourer", "Galaxy Crusher", "Universe Ender", "Existence Eraser"
  ],
  10: [
    "Divine Dragon God", "Primordial Chaos Dragon", "Dragon of the Beginning",
    "Final Boss Dragon", "True Final Form Dragon", "Secret Super Dragon",
    "Developer's Favorite Dragon", "DLC Dragon"
  ]
};

export const getMonsterByRank = (playerLevel: number): { rank: MonsterRank; name: string } => {
  // Determine which ranks are available based on player level
  const availableRanks = monsterRanks.filter(r => playerLevel >= r.minLevel);
  
  if (availableRanks.length === 0) {
    // Player is too low level, give them rank 1
    const rank = monsterRanks[0];
    const names = monsterNamesByRank[1];
    return {
      rank,
      name: names[Math.floor(Math.random() * names.length)]
    };
  }
  
  // Weight the selection towards lower ranks (more common)
  // But occasionally spawn higher ranks for challenge
  const weights: number[] = [];
  for (let i = 0; i < availableRanks.length; i++) {
    // Exponential decay: earlier ranks are much more common
    weights.push(Math.pow(0.5, i) * 100);
  }
  
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;
  
  let selectedRank = availableRanks[0];
  for (let i = 0; i < availableRanks.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      selectedRank = availableRanks[i];
      break;
    }
  }
  
  const names = monsterNamesByRank[selectedRank.rank] || monsterNamesByRank[1];
  const name = names[Math.floor(Math.random() * names.length)];
  
  return { rank: selectedRank, name };
};

export const rollForShard = (monsterRank: MonsterRank): boolean => {
  if (monsterRank.shardDropChance <= 0) return false;
  return Math.random() < monsterRank.shardDropChance;
};

export const getShardsNeededForSummon = (): number => {
  return 10000;
};

export const canSummon = (currentShards: number): boolean => {
  return currentShards >= getShardsNeededForSummon();
};

export const getMonsterRankColor = (rank: number): string => {
  const colors: Record<number, string> = {
    1: "text-gray-400",
    2: "text-gray-300",
    3: "text-green-400",
    4: "text-blue-400",
    5: "text-purple-400",
    6: "text-yellow-400",
    7: "text-orange-400",
    8: "text-red-400",
    9: "text-pink-400",
    10: "text-rainbow" // Special case
  };
  return colors[rank] || "text-gray-300";
};
