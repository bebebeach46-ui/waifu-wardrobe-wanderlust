import { generateSkills, generateSpells, generateStats } from "./skillGenerator";

const races = ["Human", "Elf", "Dwarf", "Orc", "Android", "Mutant", "Cyborg", "Demon", "Angel", "Catgirl", "Kitsune", "Vampire", "Dragon-kin"];
const classes = ["Warrior", "Mage", "Rogue", "Ranger", "Paladin", "Necromancer", "Hacker", "Scavenger", "Monk", "Protagonist", "Isekai Hero", "Magical Girl/Boy"];
const names = ["Aldrin", "Zephyr", "Kira", "Rex", "Nova", "Ash", "Raven", "Cipher", "Storm", "Vex", "Tanjiro", "Mob", "Senku", "Asta"];
const genders = ["Male", "Female"];

const equipmentByTimeline: Record<string, {
  weapons: string[];
  shields: string[];
  armors: string[];
  heads: string[];
  cloaks: string[];
  boots: string[];
  gauntlets: string[];
  rings: string[];
  amulets: string[];
  ammo: string[];
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

// Generate age based on race (different races have different lifespans)
const generateAge = (race: string, startingAge: number | null = null): number => {
  if (startingAge !== null) return startingAge;
  
  // Base adult age ranges by race type
  const ageRanges: Record<string, [number, number]> = {
    "Human": [18, 45],
    "Elf": [100, 500],
    "Dwarf": [50, 200],
    "Orc": [16, 40],
    "Android": [1, 50],
    "Mutant": [18, 60],
    "Cyborg": [20, 80],
    "Demon": [100, 1000],
    "Angel": [100, 5000],
    "Catgirl": [16, 35],
    "Kitsune": [50, 800],
    "Vampire": [100, 2000],
    "Dragon-kin": [50, 500]
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
  
  // Allow dual/multi-classing (max 2 classes for simplicity)
  const isDualClass = Math.random() > 0.7;
  const secondClass = isDualClass ? classes[Math.floor(Math.random() * classes.length)] : null;
  
  return {
    name,
    race,
    class: characterClass,
    secondClass,
    gender,
    age,
    equipment: {
      weapon: equipment.weapons[Math.floor(Math.random() * equipment.weapons.length)],
      shield: equipment.shields[Math.floor(Math.random() * equipment.shields.length)],
      armor: equipment.armors[Math.floor(Math.random() * equipment.armors.length)],
      head: equipment.heads[Math.floor(Math.random() * equipment.heads.length)],
      cloak: equipment.cloaks[Math.floor(Math.random() * equipment.cloaks.length)],
      boots: equipment.boots[Math.floor(Math.random() * equipment.boots.length)],
      gauntlets: equipment.gauntlets[Math.floor(Math.random() * equipment.gauntlets.length)],
      ring1: equipment.rings[Math.floor(Math.random() * equipment.rings.length)],
      ring2: equipment.rings[Math.floor(Math.random() * equipment.rings.length)],
      amulet: equipment.amulets[Math.floor(Math.random() * equipment.amulets.length)],
      ammo: equipment.ammo[Math.floor(Math.random() * equipment.ammo.length)]
    },
    skills: generateSkills(3),
    spells: generateSpells(isDualClass ? 5 : 3),
    stats: generateStats()
  };
};
