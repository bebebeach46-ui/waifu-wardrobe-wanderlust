const races = ["Human", "Elf", "Dwarf", "Orc", "Android", "Mutant", "Cyborg", "Demon", "Angel"];
const classes = ["Warrior", "Mage", "Rogue", "Ranger", "Paladin", "Necromancer", "Hacker", "Scavenger", "Monk"];
const names = ["Aldrin", "Zephyr", "Kira", "Rex", "Nova", "Ash", "Raven", "Cipher", "Storm", "Vex"];

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
  
  const weapons = weaponsByTimeline[worldData.timeline] || weaponsByTimeline.Medieval;
  
  return {
    name,
    race,
    class: characterClass,
    equipment: {
      weapon: weapons[Math.floor(Math.random() * weapons.length)],
      armor: `${worldData.timeline} Armor`,
      accessory: "Lucky Charm"
    },
    skills: [
      `${characterClass} Mastery`,
      `${race} Heritage`,
      "Combat Training"
    ]
  };
};
