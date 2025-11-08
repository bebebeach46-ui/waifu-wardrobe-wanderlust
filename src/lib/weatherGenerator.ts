export type Weather = {
  name: string;
  description: string;
  effect: string;
  icon: string;
};

const weatherTypes: Weather[] = [
  { name: "Clear Skies", description: "Perfect weather for adventure", effect: "No effect", icon: "☀️" },
  { name: "Blizzard", description: "Freezing winds and snow", effect: "Need to recover health", icon: "❄️" },
  { name: "Thunderstorm", description: "Lightning cracks across the sky", effect: "Magic spells empowered", icon: "⚡" },
  { name: "Blood Rain", description: "Ominous crimson droplets fall", effect: "Enemies strengthened", icon: "🩸" },
  { name: "Meteor Shower", description: "Rocks fall from the heavens", effect: "Random damage events", icon: "☄️" },
  { name: "Fog", description: "Thick mist obscures vision", effect: "Encounter rate increased", icon: "🌫️" },
  { name: "Solar Eclipse", description: "The sun is devoured", effect: "Dark powers awakened", icon: "🌑" },
  { name: "Cherry Blossom Breeze", description: "Petals drift peacefully", effect: "Relationship progression boosted", icon: "🌸" },
  { name: "Dimensional Rift", description: "Reality tears at the seams", effect: "Bizarre events possible", icon: "🌀" },
  { name: "Acid Rain", description: "Corrosive precipitation", effect: "Equipment degradation risk", icon: "☔" },
  { name: "Aurora Borealis", description: "Mystical lights dance", effect: "Experience gain increased", icon: "🌌" },
  { name: "Sandstorm", description: "Choking dust everywhere", effect: "Vision impaired", icon: "🌪️" }
];

export const getRandomWeather = (): Weather => {
  return weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
};

export const weatherRequiresRest = (weather: Weather): boolean => {
  return weather.name === "Blizzard" || weather.name === "Acid Rain" || weather.name === "Sandstorm";
};
