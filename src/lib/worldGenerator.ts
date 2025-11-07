const timelines = ["Medieval", "Renaissance", "Industrial", "Cyberpunk", "Post-Apocalyptic", "Ancient", "Dark Ages"];
const terrains = ["Mountains", "Forests", "Deserts", "Tundra", "Swamps", "Coastal", "Volcanic"];
const factions = ["The Order", "Shadow Guild", "Techno Cult", "Wasteland Raiders", "Ancient Brotherhood", "Iron Legion", "Chaos Syndicate"];

export const generateWorld = () => {
  const timeline = timelines[Math.floor(Math.random() * timelines.length)];
  const terrain = terrains[Math.floor(Math.random() * terrains.length)];
  const mainFaction = factions[Math.floor(Math.random() * factions.length)];
  
  return {
    name: `${terrain} of ${timeline}`,
    timeline,
    terrain,
    mainFaction,
    dangerLevel: Math.floor(Math.random() * 10) + 1,
    seed: Date.now()
  };
};
