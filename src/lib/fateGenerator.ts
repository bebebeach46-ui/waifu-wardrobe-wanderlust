export type FateOutcome = {
  type: "death" | "retirement" | "ascension" | "betrayal" | "legendary";
  description: string;
  shortDesc: string;
  isGameOver: boolean;
};

const fateOutcomes = {
  earlyDeath: [
    { type: "death" as const, shortDesc: "Killed by tutorial dragon", description: "Burned alive by a dragon that destroyed your village on Day 1", isGameOver: true },
    { type: "death" as const, shortDesc: "Stepped on landmine", description: "Stepped on a landmine while picking flowers in a 'safe' meadow", isGameOver: true },
    { type: "death" as const, shortDesc: "Food poisoning", description: "Died from food poisoning at the tutorial tavern (the stew was suspicious)", isGameOver: true },
    { type: "death" as const, shortDesc: "Divine retribution", description: "Accidentally angered a god by reading their diary - smote instantly", isGameOver: true },
    { type: "death" as const, shortDesc: "Fell into pit", description: "Tripped and fell into a bottomless pit while admiring scenery", isGameOver: true },
    { type: "death" as const, shortDesc: "Tutorial slime", description: "Killed by a Level 1 Slime (it was a critical hit, okay?)", isGameOver: true },
    { type: "death" as const, shortDesc: "Wrong door", description: "Opened the wrong door in the starter dungeon - found the final boss", isGameOver: true },
    { type: "death" as const, shortDesc: "Allergic reaction", description: "Had a fatal allergic reaction to healing potion ingredients", isGameOver: true }
  ],
  
  richRetirement: [
    { type: "retirement" as const, shortDesc: "Won the lottery", description: "Struck it rich in the gacha mines and retired to a beach resort", isGameOver: true },
    { type: "retirement" as const, shortDesc: "Lottery winner", description: "Won the interdimensional lottery and quit adventuring forever", isGameOver: true },
    { type: "retirement" as const, shortDesc: "Married royalty", description: "Married into royalty and became a full-time royal couch potato", isGameOver: true },
    { type: "retirement" as const, shortDesc: "Became merchant", description: "Discovered capitalism and became a successful merchant - never fought again", isGameOver: true },
    { type: "retirement" as const, shortDesc: "Real estate mogul", description: "Bought all the cleared dungeons and converted them to condos", isGameOver: true }
  ],
  
  legendary: [
    { type: "legendary" as const, shortDesc: "Unwitnessed victory", description: "Defeated the Demon King but nobody believed you - died of frustration", isGameOver: true },
    { type: "legendary" as const, shortDesc: "Too powerful", description: "Became so powerful you broke the game's difficulty scaling - ascended", isGameOver: true },
    { type: "legendary" as const, shortDesc: "Achieved enlightenment", description: "Achieved enlightenment and transcended to become a tutorial NPC", isGameOver: true },
    { type: "legendary" as const, shortDesc: "Pensioned hero", description: "Saved the world so many times they gave you a pension - retired", isGameOver: true },
    { type: "legendary" as const, shortDesc: "Became a god", description: "Accumulated so much power the gods offered you a position - accepted", isGameOver: true },
    { type: "legendary" as const, shortDesc: "Isekai'd again", description: "Was so legendary you got isekai'd to another world (again)", isGameOver: true }
  ],
  
  normalDeath: [
    { type: "death" as const, shortDesc: "Heroic last stand", description: "Defeated in an epic battle against overwhelming odds", isGameOver: true },
    { type: "death" as const, shortDesc: "Wounds too great", description: "Succumbed to wounds after a heroic last stand", isGameOver: true },
    { type: "death" as const, shortDesc: "Ultimate attack", description: "Fell to a legendary monster's ultimate attack", isGameOver: true },
    { type: "death" as const, shortDesc: "Betrayed by ally", description: "Stabbed in the back by a trusted ally", isGameOver: true },
    { type: "death" as const, shortDesc: "Ambushed", description: "Ambushed in the night by assassins", isGameOver: true }
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

/**
 * Triggered when the hero has sired 50 heirs from 50 unique companions.
 * Guaranteed legendary retirement with their favorite partner.
 */
export const checkLineageLegendary = (
  uniqueHeirMothers: number,
  favoriteName: string | null
): FateOutcome | null => {
  if (uniqueHeirMothers < 50) return null;
  const partner = favoriteName || "their favorite companion";
  return {
    type: "legendary",
    shortDesc: "Restored the world's future",
    description: `Sired 50 lineages from 50 different companions — a feat unmatched in living memory. The bloodlines they planted will steward the world for generations. Retired in peace with ${partner} to watch their children's children inherit the realm.`,
    isGameOver: true
  };
};

export const getNormalDeath = (): FateOutcome => {
  return fateOutcomes.normalDeath[Math.floor(Math.random() * fateOutcomes.normalDeath.length)];
};
