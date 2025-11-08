export type Material = {
  name: string;
  amount: number;
};

export type MaterialActivity = {
  action: string;
  material: string;
  amount: number;
  description: string;
};

const gatheringActivities: MaterialActivity[] = [
  { action: "Chopped Wood", material: "Wood", amount: 5, description: "Gathered firewood from nearby trees" },
  { action: "Mined Ore", material: "Iron Ore", amount: 3, description: "Extracted ore from a rocky outcrop" },
  { action: "Picked Herbs", material: "Healing Herbs", amount: 8, description: "Found medicinal plants" },
  { action: "Hunted Game", material: "Monster Meat", amount: 4, description: "Defeated creature and harvested materials" },
  { action: "Collected Crystals", material: "Mana Crystals", amount: 2, description: "Found glowing crystals" },
  { action: "Salvaged Scrap", material: "Scrap Metal", amount: 6, description: "Recovered materials from ruins" },
  { action: "Foraged Mushrooms", material: "Strange Mushrooms", amount: 10, description: "Gathered fungi (possibly edible?)" },
  { action: "Harvested Scales", material: "Dragon Scales", amount: 1, description: "Collected rare dragon materials" },
  { action: "Fished", material: "Fish", amount: 7, description: "Caught fish from a nearby stream" },
  { action: "Gathered Feathers", material: "Phoenix Feathers", amount: 2, description: "Found mystical feathers" }
];

const craftingActivities = [
  { action: "Built Campfire", materials: ["Wood"], result: "Rested and recovered health", healthGain: 20 },
  { action: "Crafted Potion", materials: ["Healing Herbs", "Mana Crystals"], result: "Created healing potion", healthGain: 50 },
  { action: "Forged Weapon", materials: ["Iron Ore", "Scrap Metal"], result: "Improved weapon damage", bonus: "weapon" },
  { action: "Cooked Meal", materials: ["Monster Meat", "Strange Mushrooms"], result: "Delicious(?) meal prepared", healthGain: 30 },
  { action: "Enhanced Armor", materials: ["Dragon Scales", "Phoenix Feathers"], result: "Armor durability increased", bonus: "armor" }
];

export const getRandomGatheringActivity = (): MaterialActivity => {
  return gatheringActivities[Math.floor(Math.random() * gatheringActivities.length)];
};

export const getRandomCraftingActivity = () => {
  return craftingActivities[Math.floor(Math.random() * craftingActivities.length)];
};

export const shouldGatherMaterials = (): boolean => {
  return Math.random() < 0.15; // 15% chance
};

export const shouldCraft = (materials: Material[]): boolean => {
  return Math.random() < 0.1 && materials.length >= 2; // 10% chance if have materials
};
