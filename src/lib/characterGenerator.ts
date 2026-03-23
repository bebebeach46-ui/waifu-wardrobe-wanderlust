import { generateSkills, generateSpells, generateStats } from "./skillGenerator";

const races = [
  "Human", "Elf", "Dwarf", "Orc", "Android", "Mutant", "Cyborg", "Demon", "Angel",
  "Catgirl", "Kitsune", "Vampire", "Dragon-kin",
  // Dark fantasy
  "Revenant", "Hollow One", "Shade", "Wight", "Ghoul-blooded", "Hag-spawn",
  "Cambion", "Tiefling", "Aasimar", "Genasi", "Duergar", "Deep Gnome",
  "Goliath", "Firbolg", "Lizardfolk", "Yuan-Ti", "Kenku", "Tabaxi",
  "Drow", "Half-Dragon", "Dhampir", "Skinwalker", "Wendigo-touched",
  "Plague Bearer", "Ashen Born", "Fey-touched", "Abyssal Scion", "Void Walker"
];
const classes = [
  "Warrior", "Mage", "Rogue", "Ranger", "Paladin", "Necromancer", "Hacker",
  "Scavenger", "Monk", "Protagonist", "Isekai Hero", "Magical Girl/Boy",
  // Dark fantasy
  "Blood Knight", "Witch Hunter", "Inquisitor", "Plague Doctor", "Grave Warden",
  "Hexblade", "Oathbreaker", "Shadow Dancer", "Flesh Sculptor", "Soul Reaver",
  "Demonologist", "Beast Tamer", "War Priest", "Eldritch Scholar", "Bone Singer"
];
const names = [
  "Aldrin", "Zephyr", "Kira", "Rex", "Nova", "Ash", "Raven", "Cipher", "Storm", "Vex",
  // Dark fantasy
  "Morrigan", "Lazarus", "Cain", "Isolde", "Theron", "Severin", "Lucretia",
  "Oberon", "Salazar", "Amaranth", "Draven", "Seraphiel", "Caius", "Elara",
  "Grimshaw", "Nocturne", "Vesper", "Ashwin", "Mordecai", "Sable",
  "Corvinus", "Nyx", "Desmona", "Fenrik", "Briar", "Haelstrom",
  "Vashti", "Alaric", "Thessaly", "Ozymandias", "Wraith", "Cinder"
];
const genders = ["Male", "Female"];

// Class definitions: which slots start filled, how many skills/spells
export interface ClassConfig {
  startingSlots: string[];
  startingSkills: number;
  startingSpells: number;
  maxSkills: number;
  maxSpells: number;
  skillAffinity: number;
  spellAffinity: number;
  equipUnlockRate: number;
}

export const classConfigs: Record<string, ClassConfig> = {
  "Warrior":          { startingSlots: ["weapon", "armor", "boots"],                startingSkills: 2, startingSpells: 0, maxSkills: 8, maxSpells: 2, skillAffinity: 1.5, spellAffinity: 0.3, equipUnlockRate: 0.12 },
  "Mage":             { startingSlots: ["weapon", "cloak", "amulet"],               startingSkills: 0, startingSpells: 3, maxSkills: 3, maxSpells: 10, skillAffinity: 0.3, spellAffinity: 1.5, equipUnlockRate: 0.08 },
  "Rogue":            { startingSlots: ["weapon", "boots", "cloak"],                startingSkills: 2, startingSpells: 0, maxSkills: 7, maxSpells: 3, skillAffinity: 1.3, spellAffinity: 0.4, equipUnlockRate: 0.10 },
  "Ranger":           { startingSlots: ["weapon", "boots", "ammo"],                 startingSkills: 2, startingSpells: 1, maxSkills: 6, maxSpells: 4, skillAffinity: 1.2, spellAffinity: 0.6, equipUnlockRate: 0.10 },
  "Paladin":          { startingSlots: ["weapon", "shield", "armor", "gauntlets"],  startingSkills: 1, startingSpells: 1, maxSkills: 5, maxSpells: 5, skillAffinity: 1.0, spellAffinity: 1.0, equipUnlockRate: 0.15 },
  "Necromancer":      { startingSlots: ["weapon", "amulet"],                        startingSkills: 0, startingSpells: 3, maxSkills: 2, maxSpells: 9, skillAffinity: 0.2, spellAffinity: 1.4, equipUnlockRate: 0.06 },
  "Hacker":           { startingSlots: ["weapon", "gauntlets", "ring1"],            startingSkills: 1, startingSpells: 2, maxSkills: 4, maxSpells: 7, skillAffinity: 0.7, spellAffinity: 1.2, equipUnlockRate: 0.08 },
  "Scavenger":        { startingSlots: ["weapon", "boots", "ring1"],                startingSkills: 1, startingSpells: 0, maxSkills: 5, maxSpells: 3, skillAffinity: 1.0, spellAffinity: 0.5, equipUnlockRate: 0.18 },
  "Monk":             { startingSlots: ["boots", "gauntlets"],                      startingSkills: 3, startingSpells: 1, maxSkills: 9, maxSpells: 3, skillAffinity: 1.6, spellAffinity: 0.5, equipUnlockRate: 0.05 },
  "Protagonist":      { startingSlots: ["weapon", "armor", "amulet"],               startingSkills: 1, startingSpells: 1, maxSkills: 7, maxSpells: 7, skillAffinity: 1.0, spellAffinity: 1.0, equipUnlockRate: 0.12 },
  "Isekai Hero":      { startingSlots: ["weapon"],                                  startingSkills: 0, startingSpells: 0, maxSkills: 8, maxSpells: 8, skillAffinity: 1.3, spellAffinity: 1.3, equipUnlockRate: 0.15 },
  "Magical Girl/Boy": { startingSlots: ["weapon", "amulet", "ring1"],               startingSkills: 0, startingSpells: 3, maxSkills: 4, maxSpells: 10, skillAffinity: 0.4, spellAffinity: 1.6, equipUnlockRate: 0.09 }
};

export const getClassConfig = (className: string): ClassConfig => {
  return classConfigs[className] || classConfigs["Protagonist"];
};

const allEquipmentSlots = ["weapon", "shield", "armor", "head", "cloak", "boots", "gauntlets", "ring1", "ring2", "amulet", "ammo"];

const slotToEquipmentKey: Record<string, string> = {
  weapon: "weapons", shield: "shields", armor: "armors", head: "heads",
  cloak: "cloaks", boots: "boots", gauntlets: "gauntlets",
  ring1: "rings", ring2: "rings", amulet: "amulets", ammo: "ammo"
};

const equipmentByTimeline: Record<string, {
  weapons: string[]; shields: string[]; armors: string[]; heads: string[];
  cloaks: string[]; boots: string[]; gauntlets: string[]; rings: string[];
  amulets: string[]; ammo: string[];
}> = {
  Medieval: {
    weapons: ["Iron Sword of Inadequacy", "War Axe of Mild Discomfort", "Longbow of Questionable Accuracy", "Staff of Tentacle Slapping"],
    shields: ["Buckler of Blocking", "Tower Shield of Compensation", "Kite Shield of Disappointment"],
    armors: ["Chainmail Bikini", "Full Plate of Virginity", "Leather Jerkin of Questionable Material"],
    heads: ["Horned Helmet of Overcompensation", "Circlet of Anime Protagonist", "Hood of Edgelord"],
    cloaks: ["Cape of Dramatic Billowing", "Cloak of Mysterious Backstory", "Mantle of Plot Armor"],
    boots: ["Boots of Shounen Speed", "Greaves of Heavy Stomping", "Sandals of Overpowered Monk"],
    gauntlets: ["Gauntlets of Fisting", "Gloves of Finger Blasting", "Mittens of Fumbling"],
    rings: ["Ring of Waifu Summoning", "Band of Harem Expansion", "Cock Ring of Constitution"],
    amulets: ["Amulet of Protagonist Energy", "Pendant of Tragic Backstory", "Necklace of Plot Convenience"],
    ammo: ["Arrows of Phallic Trajectory", "Bolts of Penetration", "Blessed Ammunition"]
  },
  Renaissance: {
    weapons: ["Rapier of Thrust", "Flintlock of Premature Discharge", "Halberd of Reach", "Enchanted Grimoire of Lewdness"],
    shields: ["Dueling Shield", "Pavise of Protection", "Buckler of Parry"],
    armors: ["Half-Plate of Nobility", "Brigandine of Bondage", "Doublet of Dashing"],
    heads: ["Tricorn of Swashbuckling", "Beret of Artist", "Helm of Conquistador"],
    cloaks: ["Cape of Musketeer", "Cloak of Assassin", "Shawl of Seduction"],
    boots: ["Boots of Renaissance Man", "Shoes of Court Dancing", "Sandals of Philosopher"],
    gauntlets: ["Dueling Gloves", "Gauntlets of Gentleman", "Gloves of Clockwork"],
    rings: ["Signet of Noble Birth", "Ring of Alchemy", "Band of Secret Society"],
    amulets: ["Medallion of Patron", "Crucifix of Inquisition", "Locket of Lover"],
    ammo: ["Musket Balls of Justice", "Crossbow Bolts of Precision", "Blessed Shot"]
  },
  Industrial: {
    weapons: ["Revolver of Quick Draw", "Steam Rifle of Overpressure", "Mechanized Fist of Punching", "Shock Rod of Stimulation"],
    shields: ["Riot Shield", "Energy Barrier Mk I", "Steam-Powered Buckler"],
    armors: ["Steam-Powered Exosuit", "Industrial Vest of Protection", "Leather Duster of Badass"],
    heads: ["Top Hat of Industrialist", "Welding Mask of Blinding", "Bowler of Gentleman Thug"],
    cloaks: ["Coat of Steam Punk", "Duster of Wanderer", "Cape of Mad Scientist"],
    boots: ["Boots of Locomotive", "Shoes of Factory Worker", "Magnetic Boots"],
    gauntlets: ["Steam Gauntlets", "Mechanical Hands", "Gloves of Grease"],
    rings: ["Gear Ring of Engineering", "Band of Union", "Ring of Oil Baron"],
    amulets: ["Pocket Watch of Time", "Medallion of Progress", "Amulet of Industry"],
    ammo: ["Steam Cartridges", "Explosive Rounds", "Armor-Piercing Bullets"]
  },
  Cyberpunk: {
    weapons: ["Plasma Blade of Slicing", "Neural Whip of Dominance", "Smart Gun of Aimbot", "Nano Katana of Weeb"],
    shields: ["Energy Shield Mk II", "Holographic Barrier", "Reactive Armor Plating"],
    armors: ["Synth-Skin Bodysuit", "Corporate Power Armor", "Street Samurai Jacket"],
    heads: ["Neural Interface Headset", "VR Visor of Hentai", "Cybernetic Skull Implant"],
    cloaks: ["Holo-Cloak of Invisibility", "Digital Cape", "Neon Trenchcoat"],
    boots: ["Mag-Boots", "Rocket Boots", "Stealth Sneakers"],
    gauntlets: ["Cyber-Gauntlets", "Hacking Gloves", "Power Fists"],
    rings: ["Data Ring", "Encryption Band", "Neural Link Ring"],
    amulets: ["AI Companion Chip", "Biometric Scanner", "Corporate ID Badge"],
    ammo: ["Plasma Cells", "EMP Rounds", "Smart Bullets"]
  },
  "Post-Apocalyptic": {
    weapons: ["Makeshift Spear of Desperation", "Pipe Rifle of Rust", "Spiked Bat of Negan", "Bone Club of Caveman"],
    shields: ["Car Door Shield", "Scrap Metal Barrier", "Tire Shield"],
    armors: ["Raider Leather", "Wasteland Armor", "Mutant Hide Jacket"],
    heads: ["Gas Mask of Survivor", "Motorcycle Helmet", "Skull Mask of Raider"],
    cloaks: ["Tattered Cape", "Wasteland Duster", "Radiation Cloak"],
    boots: ["Combat Boots", "Wasteland Wraps", "Spiked Boots"],
    gauntlets: ["Scrap Gauntlets", "Raider Gloves", "Makeshift Claws"],
    rings: ["Bottle Cap Ring", "Scrap Ring", "Radiation Ring"],
    amulets: ["Geiger Counter", "Radiation Badge", "Lucky Rabbit Foot"],
    ammo: ["Homemade Arrows", "Scrap Bolts", "Salvaged Bullets"]
  },
  Ancient: {
    weapons: ["Bronze Sword of Heroism", "Stone Hammer of Bonking", "Ritual Dagger of Sacrifice", "Ancient Staff of Old Wizard"],
    shields: ["Bronze Shield", "Wooden Shield", "Ceremonial Shield"],
    armors: ["Bronze Cuirass", "Leather Skirt", "Toga of Senator"],
    heads: ["Laurel Crown", "Bronze Helm", "Feathered Headdress"],
    cloaks: ["Purple Toga", "Animal Pelt", "Ceremonial Robes"],
    boots: ["Sandals of Sparta", "Leather Wraps", "Bronze Greaves"],
    gauntlets: ["Bronze Bracers", "Leather Wraps", "Stone Gauntlets"],
    rings: ["Golden Ring of Power", "Bronze Band", "Stone Ring"],
    amulets: ["Scarab Amulet", "Eye of Horus", "Jade Pendant"],
    ammo: ["Stone-Tipped Arrows", "Bronze-Tipped Bolts", "Flint Arrows"]
  },
  "Dark Ages": {
    weapons: ["Cursed Blade of Edgelord", "Shadow Bow of Darkness", "Dark Scepter of Evil Overlord", "Bone Club of Necrophilia"],
    shields: ["Skull Shield", "Shadow Barrier", "Cursed Shield"],
    armors: ["Dark Plate Armor", "Shadow Robes", "Bone Armor"],
    heads: ["Horned Helmet of Demon", "Hood of Assassin", "Crown of Bones"],
    cloaks: ["Cloak of Shadows", "Cape of Darkness", "Shroud of Death"],
    boots: ["Boots of Silent Death", "Shadow Walkers", "Bone Boots"],
    gauntlets: ["Clawed Gauntlets", "Shadow Gloves", "Bone Hands"],
    rings: ["Ring of Dark Pact", "Soul Ring", "Cursed Band"],
    amulets: ["Amulet of Necromancy", "Pendant of Darkness", "Skull Necklace"],
    ammo: ["Cursed Arrows", "Shadow Bolts", "Bone Arrows"]
  }
};

const generateAge = (race: string, startingAge: number | null = null): number => {
  if (startingAge !== null) return startingAge;
  const ageRanges: Record<string, [number, number]> = {
    "Human": [18, 45], "Elf": [100, 500], "Dwarf": [50, 200], "Orc": [16, 40],
    "Android": [1, 50], "Mutant": [18, 60], "Cyborg": [20, 80], "Demon": [100, 1000],
    "Angel": [100, 5000], "Catgirl": [16, 35], "Kitsune": [50, 800],
    "Vampire": [100, 2000], "Dragon-kin": [50, 500]
  };
  const [min, max] = ageRanges[race] || [18, 50];
  return Math.floor(Math.random() * (max - min)) + min;
};

export const generateCharacter = (worldData: any, options?: { startingAge?: number }) => {
  const race = races[Math.floor(Math.random() * races.length)];
  const characterClass = classes[Math.floor(Math.random() * classes.length)];
  const name = names[Math.floor(Math.random() * names.length)];
  const gender = genders[Math.floor(Math.random() * genders.length)];
  const age = generateAge(race, options?.startingAge || null);
  
  const equipment = equipmentByTimeline[worldData.timeline] || equipmentByTimeline.Medieval;
  const classConfig = getClassConfig(characterClass);
  
  const isDualClass = Math.random() > 0.7;
  const secondClass = isDualClass ? classes[Math.floor(Math.random() * classes.length)] : null;
  
  // Only fill slots the class starts with; rest are null (locked)
  const characterEquipment: Record<string, string | null> = {};
  for (const slot of allEquipmentSlots) {
    if (classConfig.startingSlots.includes(slot)) {
      const key = slotToEquipmentKey[slot];
      const pool = (equipment as any)[key];
      characterEquipment[slot] = pool[Math.floor(Math.random() * pool.length)];
    } else {
      characterEquipment[slot] = null;
    }
  }
  
  const spellCount = classConfig.startingSpells + (isDualClass ? 1 : 0);
  
  return {
    name,
    race,
    class: characterClass,
    secondClass,
    gender,
    age,
    equipment: characterEquipment,
    skills: generateSkills(classConfig.startingSkills),
    spells: generateSpells(spellCount),
    stats: generateStats()
  };
};

// Roll for learning a new skill on quest complete
export const rollForNewSkill = (currentSkills: string[], characterClass: string): string | null => {
  const config = getClassConfig(characterClass);
  if (currentSkills.length >= config.maxSkills) return null;
  const chance = 0.15 * config.skillAffinity;
  if (Math.random() > chance) return null;
  const newSkills = generateSkills(1);
  const skill = newSkills[0];
  if (currentSkills.includes(skill)) return null;
  return skill;
};

// Roll for learning a new spell on quest complete
export const rollForNewSpell = (currentSpells: any[], characterClass: string): any | null => {
  const config = getClassConfig(characterClass);
  if (currentSpells.length >= config.maxSpells) return null;
  const chance = 0.15 * config.spellAffinity;
  if (Math.random() > chance) return null;
  const newSpells = generateSpells(1);
  const spell = newSpells[0];
  if (currentSpells.some((s: any) => s.name === spell.name)) return null;
  return spell;
};

// Roll for unlocking a new equipment slot
export const rollForEquipmentUnlock = (
  currentEquipment: Record<string, string | null>,
  characterClass: string,
  worldTimeline: string
): { slot: string; item: string } | null => {
  const config = getClassConfig(characterClass);
  if (Math.random() > config.equipUnlockRate) return null;
  const lockedSlots = allEquipmentSlots.filter(s => currentEquipment[s] === null);
  if (lockedSlots.length === 0) return null;
  const slot = lockedSlots[Math.floor(Math.random() * lockedSlots.length)];
  const equipment = equipmentByTimeline[worldTimeline] || equipmentByTimeline.Medieval;
  const key = slotToEquipmentKey[slot];
  const pool = (equipment as any)[key];
  const item = pool[Math.floor(Math.random() * pool.length)];
  return { slot, item };
};