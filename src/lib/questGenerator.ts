const questTemplates = [
  { name: "Slay the Kaiju", desc: "Defeat a giant monster" },
  { name: "Collect Dragon Balls", desc: "Gather mystical orbs" },
  { name: "Escort the Tsundere", desc: "Protect a stubborn ally" },
  { name: "Explore the Dungeon", desc: "Investigate a mysterious labyrinth" },
  { name: "Defeat the Demon Lord", desc: "Face the ultimate evil" },
  { name: "Tournament Arc", desc: "Fight in the grand competition" },
  { name: "Beach Episode Quest", desc: "Relax and find trouble at the beach" },
  { name: "Training Montage", desc: "Unlock your true power" },
  { name: "Rescue the Waifu", desc: "Save your companion from danger" },
  { name: "Power Level Grind", desc: "Increase your combat rating" },
  { name: "Collect Rare Loot", desc: "Find legendary treasures" },
  { name: "Fight the Rival", desc: "Battle your destined enemy" }
];

const modifiers = ["Legendary", "Cursed", "Sacred", "SSS-Rank", "Ultimate", "Hidden", "Shadow", "Divine", "Forbidden", "OP"];

export const generateQuest = (worldData: any, level: number) => {
  const template = questTemplates[Math.floor(Math.random() * questTemplates.length)];
  const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
  
  return {
    name: `${modifier} ${template.name}`,
    description: `${template.desc} in the ${worldData.terrain}`,
    duration: 50 + Math.random() * 50, // 5-10 seconds
    expReward: 25 + level * 10,
    goldReward: 10 + level * 5
  };
};
