export type FateOutcome = {
  type: "death" | "retirement" | "ascension" | "betrayal" | "legendary";
  description: string;
  isGameOver: boolean;
};

const fateOutcomes = {
  earlyDeath: [
    { type: "death" as const, description: "Burned alive by a dragon that destroyed your village on Day 1", isGameOver: true },
    { type: "death" as const, description: "Stepped on a landmine while picking flowers", isGameOver: true },
    { type: "death" as const, description: "Died from food poisoning at the tutorial tavern", isGameOver: true },
    { type: "death" as const, description: "Accidentally angered a god by reading their diary", isGameOver: true },
    { type: "death" as const, description: "Tripped and fell into a bottomless pit", isGameOver: true }
  ],
  
  richRetirement: [
    { type: "retirement" as const, description: "Struck it rich in the gacha mines and retired to a beach resort", isGameOver: true },
    { type: "retirement" as const, description: "Won the interdimensional lottery and quit adventuring", isGameOver: true },
    { type: "retirement" as const, description: "Married into royalty and became a full-time royal couch potato", isGameOver: true },
    { type: "retirement" as const, description: "Discovered capitalism and became a successful merchant, never fought again", isGameOver: true }
  ],
  
  legendary: [
    { type: "legendary" as const, description: "Defeated the Demon King but nobody believed you", isGameOver: true },
    { type: "legendary" as const, description: "Became so powerful you broke the game's difficulty scaling", isGameOver: true },
    { type: "legendary" as const, description: "Achieved enlightenment and transcended to become a tutorial NPC", isGameOver: true },
    { type: "legendary" as const, description: "Saved the world so many times they gave you a pension", isGameOver: true }
  ],
  
  normalDeath: [
    { type: "death" as const, description: "Defeated in an epic battle against overwhelming odds", isGameOver: true },
    { type: "death" as const, description: "Succumbed to wounds after a heroic last stand", isGameOver: true },
    { type: "death" as const, description: "Fell to a legendary monster's ultimate attack", isGameOver: true }
  ]
};

export const checkEarlyDeath = (questsCompleted: number): FateOutcome | null => {
  // 5% chance of early death in first 5 quests
  if (questsCompleted < 5 && Math.random() < 0.05) {
    return fateOutcomes.earlyDeath[Math.floor(Math.random() * fateOutcomes.earlyDeath.length)];
  }
  return null;
};

export const checkRichRetirement = (gold: number, questsCompleted: number): FateOutcome | null => {
  // Chance to retire rich if wealthy enough (10k+ gold) and lucky (1%)
  if (gold >= 10000 && questsCompleted >= 20 && Math.random() < 0.01) {
    return fateOutcomes.richRetirement[Math.floor(Math.random() * fateOutcomes.richRetirement.length)];
  }
  return null;
};

export const checkLegendaryFate = (level: number, questsCompleted: number): FateOutcome | null => {
  // Very rare legendary ending for high-level long-lived characters (0.5%)
  if (level >= 50 && questsCompleted >= 100 && Math.random() < 0.005) {
    return fateOutcomes.legendary[Math.floor(Math.random() * fateOutcomes.legendary.length)];
  }
  return null;
};

export const getNormalDeath = (): FateOutcome => {
  return fateOutcomes.normalDeath[Math.floor(Math.random() * fateOutcomes.normalDeath.length)];
};
