import { TravelState, Area } from "./locationSystem";

// Quest rank system (1-10)
export interface QuestRank {
  rank: number;
  name: string;
  color: string;
  bgColor: string;
  expMultiplier: number;
  goldMultiplier: number;
  companionChance: number; // Base chance to attract companion
}

export const questRanks: QuestRank[] = [
  { rank: 1, name: "Simple", color: "text-gray-400", bgColor: "bg-gray-800", expMultiplier: 0.5, goldMultiplier: 0.5, companionChance: 0.01 },
  { rank: 2, name: "Common", color: "text-gray-300", bgColor: "bg-gray-700", expMultiplier: 0.75, goldMultiplier: 0.75, companionChance: 0.02 },
  { rank: 3, name: "Uncommon", color: "text-green-400", bgColor: "bg-green-900/50", expMultiplier: 1, goldMultiplier: 1, companionChance: 0.03 },
  { rank: 4, name: "Rare", color: "text-blue-400", bgColor: "bg-blue-900/50", expMultiplier: 1.25, goldMultiplier: 1.25, companionChance: 0.05 },
  { rank: 5, name: "Epic", color: "text-purple-400", bgColor: "bg-purple-900/50", expMultiplier: 1.5, goldMultiplier: 1.5, companionChance: 0.08 },
  { rank: 6, name: "Heroic", color: "text-yellow-400", bgColor: "bg-yellow-900/50", expMultiplier: 2, goldMultiplier: 2, companionChance: 0.1 },
  { rank: 7, name: "Mythic", color: "text-orange-400", bgColor: "bg-orange-900/50", expMultiplier: 2.5, goldMultiplier: 2.5, companionChance: 0.15 },
  { rank: 8, name: "Divine", color: "text-pink-400", bgColor: "bg-pink-900/50", expMultiplier: 3, goldMultiplier: 3, companionChance: 0.2 },
  { rank: 9, name: "Apocalyptic", color: "text-red-500", bgColor: "bg-red-900/50", expMultiplier: 4, goldMultiplier: 4, companionChance: 0.3 },
  { rank: 10, name: "Legendary", color: "text-rainbow animate-pulse", bgColor: "bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-yellow-900/50", expMultiplier: 5, goldMultiplier: 5, companionChance: 0.5 }
];

// Quest templates organized by type
const questTemplates = {
  combat: [
    { name: "Slay the Kaiju", desc: "Defeat a giant monster" },
    { name: "Defeat the Demon Lord", desc: "Face the ultimate evil" },
    { name: "Fight the Rival", desc: "Battle your destined enemy" },
    { name: "Hunt the Beast", desc: "Track down a legendary creature" },
    { name: "Purge the Horde", desc: "Eliminate an army of monsters" },
    { name: "Boss Rush Challenge", desc: "Face consecutive powerful foes" },
    { name: "Duel at Dawn", desc: "Accept an honorable challenge" },
    { name: "Monster Extermination", desc: "Clear out the infestation" }
  ],
  exploration: [
    { name: "Explore the Dungeon", desc: "Investigate a mysterious labyrinth" },
    { name: "Map the Unknown", desc: "Chart uncharted territory" },
    { name: "Discover the Ruins", desc: "Uncover ancient secrets" },
    { name: "Reach the Summit", desc: "Climb to the highest peak" },
    { name: "Delve the Depths", desc: "Descend into darkness" },
    { name: "Find the Hidden Path", desc: "Locate a secret route" },
    { name: "Survey the Land", desc: "Scout the surrounding area" }
  ],
  collection: [
    { name: "Collect Dragon Balls", desc: "Gather mystical orbs" },
    { name: "Collect Rare Loot", desc: "Find legendary treasures" },
    { name: "Gather Materials", desc: "Harvest precious resources" },
    { name: "Retrieve the Artifact", desc: "Recover a lost relic" },
    { name: "Hunt for Shards", desc: "Seek crystallized power" },
    { name: "Loot the Treasury", desc: "Plunder ancient riches" }
  ],
  escort: [
    { name: "Escort the Tsundere", desc: "Protect a stubborn ally" },
    { name: "Guard the Caravan", desc: "Defend traveling merchants" },
    { name: "Protect the Village", desc: "Shield innocent civilians" },
    { name: "Rescue the Waifu", desc: "Save your companion from danger" },
    { name: "Deliver the Message", desc: "Carry vital information" },
    { name: "Escort the Princess", desc: "Guard royalty on their journey" }
  ],
  special: [
    { name: "Tournament Arc", desc: "Fight in the grand competition" },
    { name: "Beach Episode Quest", desc: "Relax and find trouble at the beach" },
    { name: "Training Montage", desc: "Unlock your true power" },
    { name: "Power Level Grind", desc: "Increase your combat rating" },
    { name: "Hot Spring Event", desc: "Recover at the healing springs" },
    { name: "Festival Chaos", desc: "Adventure during celebrations" },
    { name: "Filler Arc Adventure", desc: "An unexpected detour" }
  ]
};

// Modifiers that scale with quest rank
const modifiersByRank: Record<number, string[]> = {
  1: ["Basic", "Simple", "Tutorial", "Easy"],
  2: ["Standard", "Normal", "Routine", "Regular"],
  3: ["Challenging", "Tricky", "Uncommon", "Notable"],
  4: ["Rare", "Difficult", "Dangerous", "Risky"],
  5: ["Epic", "Intense", "Brutal", "Fierce"],
  6: ["Heroic", "Valiant", "Glorious", "Mighty"],
  7: ["Mythic", "Ancient", "Primordial", "Legendary"],
  8: ["Divine", "Sacred", "Holy", "Transcendent"],
  9: ["Apocalyptic", "World-Ending", "Cataclysmic", "Devastating"],
  10: ["Legendary", "Ultimate", "Final", "Destiny's"]
};

export interface Quest {
  name: string;
  description: string;
  duration: number;
  expReward: number;
  goldReward: number;
  rank: QuestRank;
  areaName: string;
  regionName: string;
  type: string;
}

export const calculateQuestRank = (
  playerLevel: number,
  regionDangerLevel: number,
  areaDangerMod: number
): QuestRank => {
  // Base rank from level and danger
  const combinedDanger = regionDangerLevel + areaDangerMod;
  const levelBonus = Math.floor(playerLevel / 10);
  let baseRank = Math.floor(combinedDanger / 2) + levelBonus;
  
  // Add randomness (-1 to +2)
  const variance = Math.floor(Math.random() * 4) - 1;
  let finalRank = Math.max(1, Math.min(10, baseRank + variance));
  
  // Very rare chance (2%) for legendary quest regardless of level
  if (Math.random() < 0.02) {
    finalRank = 10;
  }
  // Small chance (5%) for one rank higher
  else if (Math.random() < 0.05) {
    finalRank = Math.min(10, finalRank + 1);
  }
  
  return questRanks[finalRank - 1];
};

export const generateQuest = (
  worldData: any, 
  level: number,
  travelState?: TravelState
): Quest => {
  // Get area info from travel state or use defaults
  const areaName = travelState?.currentArea?.name || worldData.terrain;
  const regionName = travelState?.currentRegion?.name || worldData.name;
  const regionDanger = travelState?.currentRegion?.dangerLevel || worldData.dangerLevel || 5;
  const areaDangerMod = travelState?.currentArea?.dangerModifier || 0;
  
  // Calculate quest rank
  const rank = calculateQuestRank(level, regionDanger, areaDangerMod);
  
  // Select quest type based on area features
  const questTypes = Object.keys(questTemplates) as (keyof typeof questTemplates)[];
  const questType = questTypes[Math.floor(Math.random() * questTypes.length)];
  const templates = questTemplates[questType];
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  // Get modifier based on rank
  const modifiers = modifiersByRank[rank.rank];
  const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
  
  // Duration scales with rank (higher rank = slightly longer)
  const baseDuration = 50 + Math.random() * 50;
  const durationMultiplier = 1 + (rank.rank - 1) * 0.1;
  
  // Calculate rewards with rank multipliers
  const baseExp = 25 + level * 10;
  const baseGold = 10 + level * 5;
  
  return {
    name: `${modifier} ${template.name}`,
    description: `${template.desc} in ${areaName} of ${regionName}`,
    duration: baseDuration * durationMultiplier,
    expReward: Math.floor(baseExp * rank.expMultiplier),
    goldReward: Math.floor(baseGold * rank.goldMultiplier),
    rank,
    areaName,
    regionName,
    type: questType
  };
};

export const getQuestRankDisplay = (rank: QuestRank): string => {
  return `[${rank.name}]`;
};

// Check if companion should be attracted based on quest rank and compatibility
export const rollForCompanionAttraction = (
  questRank: QuestRank,
  compatibility: number,
  currentCompanions: number
): boolean => {
  if (currentCompanions >= 3) return false;
  
  // Base chance from quest rank
  let chance = questRank.companionChance;
  
  // Max compatibility (10) doubles the chance
  const compatibilityBonus = compatibility / 10;
  chance *= (1 + compatibilityBonus);
  
  // Legendary quests have guaranteed attraction if max compatibility
  if (questRank.rank === 10 && compatibility >= 8) {
    return true;
  }
  
  return Math.random() < chance;
};
