const questTemplates = [
  { name: "Slay the Beast", desc: "Defeat a dangerous creature" },
  { name: "Collect Resources", desc: "Gather rare materials" },
  { name: "Escort Mission", desc: "Protect a traveler" },
  { name: "Explore Ruins", desc: "Investigate ancient structures" },
  { name: "Bounty Hunt", desc: "Track down a criminal" },
  { name: "Delivery Quest", desc: "Transport important goods" },
  { name: "Rescue Mission", desc: "Save someone in danger" },
  { name: "Defend Position", desc: "Hold against enemy forces" }
];

const modifiers = ["Ancient", "Cursed", "Sacred", "Forbidden", "Lost", "Hidden", "Dark", "Glowing"];

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
