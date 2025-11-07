import { generateSkills, generateSpells, generateStats } from "./skillGenerator";

const races = ["Human", "Elf", "Dwarf", "Orc", "Android", "Mutant", "Cyborg", "Demon", "Angel", "Catgirl", "Kitsune", "Vampire", "Dragon-kin"];
const classes = ["Warrior", "Mage", "Rogue", "Ranger", "Paladin", "Necromancer", "Hacker", "Scavenger", "Monk", "Protagonist", "Isekai Hero", "Magical Girl/Boy"];
const names = ["Aldrin", "Zephyr", "Kira", "Rex", "Nova", "Ash", "Raven", "Cipher", "Storm", "Vex", "Tanjiro", "Mob", "Senku", "Asta"];
const genders = ["Male", "Female"];

const weaponsByTimeline: Record<string, string[]> = {
  Medieval: ["Iron Sword", "War Axe", "Longbow", "Staff of Light"],
  Renaissance: ["Rapier", "Flintlock Pistol", "Halberd", "Enchanted Tome"],
  Industrial: ["Revolver", "Steam Rifle", "Mechanized Gauntlet", "Shock Baton"],
  Cyberpunk: ["Plasma Blade", "Neural Disruptor", "Smart Gun", "Nano Sword"],
  "Post-Apocalyptic": ["Makeshift Spear", "Pipe Rifle", "Spiked Bat", "Scrap Shield"],
  Ancient: ["Bronze Sword", "Stone Hammer", "Ritual Dagger", "Ancient Staff"],
  "Dark Ages": ["Cursed Blade", "Shadow Bow", "Dark Scepter", "Bone Club"]
};

export const generateCharacter = (worldData: any) => {
  const race = races[Math.floor(Math.random() * races.length)];
  const characterClass = classes[Math.floor(Math.random() * classes.length)];
  const name = names[Math.floor(Math.random() * names.length)];
  const gender = genders[Math.floor(Math.random() * genders.length)];
  
  const weapons = weaponsByTimeline[worldData.timeline] || weaponsByTimeline.Medieval;
  
  return {
    name,
    race,
    class: characterClass,
    gender,
    equipment: {
      weapon: weapons[Math.floor(Math.random() * weapons.length)],
      armor: `${worldData.timeline} Armor`,
      accessory: "Lucky Charm"
    },
    skills: generateSkills(3),
    spells: generateSpells(3),
    stats: generateStats()
  };
};
