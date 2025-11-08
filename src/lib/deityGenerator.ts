const deityNames = [
  "Kami-sama", "The One Above All", "Haruhi Suzumiya", "Lord RNGesus", "Lady Luck", 
  "Yggdrasil", "The Crimson King", "Amaterasu", "Truck-kun's Boss", "The Almighty Plot Device",
  "King of Heroes", "The Root", "Papa Bones", "Aqua (Useless Goddess)", "Madoka Kaname",
  "The Outsider", "Cthulhu-chan", "Shenron", "Kyubey", "The God Emperor", "Tsukuyomi"
];

const deityDomains = [
  "Luck and Gacha", "Reincarnation", "Plot Armor", "Power Levels", "Friendship Power",
  "Fan Service", "Sudden Power-Ups", "Convenient Timing", "Random Encounters", "Critical Hits",
  "Loot Drops", "Experience Points", "Respawns", "Save Points", "Anime Logic"
];

const deityPersonalities = [
  "benevolent but forgetful", "chaotic neutral", "lawful good but annoying",
  "secretly evil", "too lazy to care", "overly enthusiastic", "tsundere",
  "yandere for their followers", "kuudere", "completely random", "perpetually drunk"
];

export type Alignment = 
  | "Utter Consumed Evil" 
  | "Very Evil" 
  | "Evil" 
  | "Slightly Evil"
  | "Absolute Neutral"
  | "Slightly Good"
  | "Good"
  | "Very Good"
  | "Paragon of Shining Virtue";

const alignmentValues: Alignment[] = [
  "Utter Consumed Evil",
  "Very Evil",
  "Evil",
  "Slightly Evil",
  "Absolute Neutral",
  "Slightly Good",
  "Good",
  "Very Good",
  "Paragon of Shining Virtue"
];

export const generateDeity = () => {
  const name = deityNames[Math.floor(Math.random() * deityNames.length)];
  const domain = deityDomains[Math.floor(Math.random() * deityDomains.length)];
  const personality = deityPersonalities[Math.floor(Math.random() * deityPersonalities.length)];
  const alignment = alignmentValues[Math.floor(Math.random() * alignmentValues.length)];
  
  return {
    name,
    domain,
    personality,
    alignment,
    favor: 50 // Starts at neutral (0-100 scale)
  };
};

export const getRandomAlignment = (): Alignment => {
  return alignmentValues[Math.floor(Math.random() * alignmentValues.length)];
};

export const shiftAlignment = (current: Alignment, magnitude: number = 1): Alignment => {
  const currentIndex = alignmentValues.indexOf(current);
  const shift = Math.floor(Math.random() * (magnitude * 2 + 1)) - magnitude; // Random shift
  const newIndex = Math.max(0, Math.min(alignmentValues.length - 1, currentIndex + shift));
  return alignmentValues[newIndex];
};

export const getAlignmentCompatibility = (align1: Alignment, align2: Alignment): number => {
  const index1 = alignmentValues.indexOf(align1);
  const index2 = alignmentValues.indexOf(align2);
  const difference = Math.abs(index1 - index2);
  
  // Opposites attract (small chance) or repel (higher chance)
  if (difference >= 6) {
    return Math.random() < 0.2 ? 2 : -2; // 20% chance of +2, otherwise -2
  }
  
  // Similar alignments have better compatibility
  return Math.max(-2, Math.min(2, 3 - difference));
};
