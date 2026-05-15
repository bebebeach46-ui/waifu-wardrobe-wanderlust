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
    weapons: ["Iron Sword of Inadequacy", "War Axe of Mild Discomfort", "Longbow of Questionable Accuracy", "Staff of Tentacle Slapping", "Throbbing Greatsword of the Lonely Knight", "Quivering Dagger of the Maiden's Sigh", "Pulsing Mace of Maidenhead Cracking", "Sticky Morningstar of Dawn's Embrace", "Hot-Hilted Longsword of Wenches", "Trembling Spear of Premature Glory"],
    shields: ["Buckler of Blocking", "Tower Shield of Compensation", "Kite Shield of Disappointment", "Heaving Bosom Plate of Defense", "Targe of the Teasing Maiden", "Quivering Roundshield of Restraint"],
    armors: ["Chainmail Bikini", "Full Plate of Virginity", "Leather Jerkin of Questionable Material", "Crotchless Cuirass of the Brazen Knight", "Bodice Brigandine of Heaving Honor", "Lace-Up Plate of the Tavern Wench", "Slit-Skirt Scale of the Saucy Squire"],
    heads: ["Horned Helmet of Overcompensation", "Circlet of Anime Protagonist", "Hood of Edgelord", "Throbbing Tiara of Temptation", "Helm of the Hungry Princess", "Crown of the Cuckolded King"],
    cloaks: ["Cape of Dramatic Billowing", "Cloak of Mysterious Backstory", "Mantle of Plot Armor", "Cloak of Backless Dresses", "Mantle of the Heaving Bosom", "Wrap of the Wet Maiden"],
    boots: ["Boots of Shounen Speed", "Greaves of Heavy Stomping", "Sandals of Overpowered Monk", "Thigh-High Boots of the Bored Baroness", "Stiletto Sabatons of Stomping Hearts", "Lace-Up Greaves of the Garter"],
    gauntlets: ["Gauntlets of Fisting", "Gloves of Finger Blasting", "Mittens of Fumbling", "Gauntlets of Gentle Groping", "Gloves of the Wandering Hand", "Mitts of the Marquis' Mistress"],
    rings: ["Ring of Waifu Summoning", "Band of Harem Expansion", "Cock Ring of Constitution", "Pearl Necklace Ring of Pleasure", "Throbbing Band of the Bedchamber", "Ring of the Reluctant Bride", "Promise Ring of the Pregnant Princess"],
    amulets: ["Amulet of Protagonist Energy", "Pendant of Tragic Backstory", "Necklace of Plot Convenience", "Locket of the Lusty Lady-in-Waiting", "Pendant of Pierced Maidens", "Choker of the Captive Countess"],
    ammo: ["Arrows of Phallic Trajectory", "Bolts of Penetration", "Blessed Ammunition", "Quivering Quarrels of the Quivering Quarry", "Throbbing Bodkins of Deep Penetration", "Sticky Bolts of the Bedded Beloved"]
  },
  Renaissance: {
    weapons: ["Rapier of Thrust", "Flintlock of Premature Discharge", "Halberd of Reach", "Enchanted Grimoire of Lewdness", "Throbbing Estoc of Eager Entry", "Pulsing Pistol of Powder Burns", "Sticky Stiletto of the Seduced Signora", "Quivering Cutlass of the Captive Courtesan"],
    shields: ["Dueling Shield", "Pavise of Protection", "Buckler of Parry", "Bodice Buckler of the Buxom Baroness", "Targe of the Tempting Tavern", "Pavise of Pierced Petticoats"],
    armors: ["Half-Plate of Nobility", "Brigandine of Bondage", "Doublet of Dashing", "Corset of the Choking Countess", "Codpiece of Compensating Counts", "Lace-Up Cuirass of the Lusty Lady"],
    heads: ["Tricorn of Swashbuckling", "Beret of Artist", "Helm of Conquistador", "Veil of the Vanished Virtue", "Mask of the Masked Mistress", "Crown of the Cuckolded Crown"],
    cloaks: ["Cape of Musketeer", "Cloak of Assassin", "Shawl of Seduction", "Mantle of the Mistress' Window", "Wrap of the Wet Renaissance", "Cape of the Convent Escapee"],
    boots: ["Boots of Renaissance Man", "Shoes of Court Dancing", "Sandals of Philosopher", "Heels of the Heaving Harlot", "Slippers of the Sneaking Suitor", "Boots of the Bedded Bride"],
    gauntlets: ["Dueling Gloves", "Gauntlets of Gentleman", "Gloves of Clockwork", "Gloves of the Groping Gondolier", "Mitts of the Mounted Marchioness", "Gauntlets of the Greedy Groom"],
    rings: ["Signet of Noble Birth", "Ring of Alchemy", "Band of Secret Society", "Garter Ring of the Gasping Geisha", "Pearl Band of the Pregnant Patrician", "Ring of the Ravished Renaissance"],
    amulets: ["Medallion of Patron", "Crucifix of Inquisition", "Locket of Lover", "Locket of the Loosened Laces", "Pendant of the Pierced Petticoat", "Cameo of the Caressed Countess"],
    ammo: ["Musket Balls of Justice", "Crossbow Bolts of Precision", "Blessed Shot", "Throbbing Bullets of the Bedchamber", "Sticky Shot of the Sated Suitor", "Pulsing Powder of Premature Climax"]
  },
  Industrial: {
    weapons: ["Revolver of Quick Draw", "Steam Rifle of Overpressure", "Mechanized Fist of Punching", "Shock Rod of Stimulation", "Throbbing Piston Hammer of Heaving Heat", "Pulsing Pneumatic Drill of the Lonely Locomotive", "Sticky Steam Lance of the Sweating Stoker", "Quivering Coil Whip of the Captive Countess"],
    shields: ["Riot Shield", "Energy Barrier Mk I", "Steam-Powered Buckler", "Heaving Boiler Plate of the Buxom Baroness", "Pulsing Pressure Shield of Premature Release", "Throbbing Ironclad of Thrusting Pistons"],
    armors: ["Steam-Powered Exosuit", "Industrial Vest of Protection", "Leather Duster of Badass", "Tightlaced Brass Corset of the Brazen Baroness", "Lace-Up Boiler Suit of the Lusty Locomotive", "Crotchless Coalstoker's Coveralls", "Garter-Belt Bandolier of the Saucy Sapper"],
    heads: ["Top Hat of Industrialist", "Welding Mask of Blinding", "Bowler of Gentleman Thug", "Veiled Goggles of the Voyeuristic Viscount", "Bonnet of the Bedded Bride", "Helm of the Hungry Heiress"],
    cloaks: ["Coat of Steam Punk", "Duster of Wanderer", "Cape of Mad Scientist", "Mantle of the Mounted Mistress", "Wrap of the Wet Workshop", "Bustle Cloak of the Bothered Baroness"],
    boots: ["Boots of Locomotive", "Shoes of Factory Worker", "Magnetic Boots", "Thigh-High Riding Boots of the Restless Rail", "Stiletto Steamboots of the Stoked Suitor", "Lace-Up Greaves of the Gasping Governess"],
    gauntlets: ["Steam Gauntlets", "Mechanical Hands", "Gloves of Grease", "Greasy Gloves of the Groping Greaser", "Pneumatic Mitts of the Mounted Marchioness", "Throbbing Pistons of the Pining Princess"],
    rings: ["Gear Ring of Engineering", "Band of Union", "Ring of Oil Baron", "Choker Ring of the Coal-Stoked Courtesan", "Throbbing Brass Band of the Bedchamber", "Garter Ring of the Greedy Groom"],
    amulets: ["Pocket Watch of Time", "Medallion of Progress", "Amulet of Industry", "Locket of the Loosened Laces", "Pendant of the Pierced Petticoat", "Choker of the Cuffed Countess"],
    ammo: ["Steam Cartridges", "Explosive Rounds", "Armor-Piercing Bullets", "Throbbing Shells of the Throbbing Pistons", "Sticky Slugs of the Sated Suitor", "Pulsing Powder of Premature Discharge"]
  },
  Cyberpunk: {
    weapons: ["Plasma Blade of Slicing", "Neural Whip of Dominance", "Smart Gun of Aimbot", "Nano Katana of Weeb", "Throbbing Vibroblade of the Virgin Vanguard", "Pulsing Pleasure Pistol of the Pining Pilot", "Sticky Synth-Whip of the Sated Synthetic", "Quivering Quantum Quirt of the Captive Codeslinger"],
    shields: ["Energy Shield Mk II", "Holographic Barrier", "Reactive Armor Plating", "Heaving Hardlight Bra of the Buxom Bot", "Throbbing Tactical Shield of the Tempted Tactician", "Pulsing Personal Plate of the Pining Pirate"],
    armors: ["Synth-Skin Bodysuit", "Corporate Power Armor", "Street Samurai Jacket", "Crotchless Combat Bodyglove", "Lace-Up Latex of the Lusty Lurker", "Mesh Bikini of the Mounted Merc", "Garter-Holstered Trenchcoat of Temptation"],
    heads: ["Neural Interface Headset", "VR Visor of Hentai", "Cybernetic Skull Implant", "Choker-Cam of the Choked Codeslinger", "Throbbing Tiara of the Tempted Techie", "Veil of the Voyeuristic Vlogger"],
    cloaks: ["Holo-Cloak of Invisibility", "Digital Cape", "Neon Trenchcoat", "Mantle of the Mounted Merc", "Wrap of the Wet Wirehead", "Bustle Cloak of the Bothered Botgirl"],
    boots: ["Mag-Boots", "Rocket Boots", "Stealth Sneakers", "Thigh-High Mag-Heels of the Mounted Merc", "Stiletto Stompers of the Sated Synth", "Lace-Up Latex Boots of the Lusty Lurker"],
    gauntlets: ["Cyber-Gauntlets", "Hacking Gloves", "Power Fists", "Vibrating Gauntlets of the Voyeuristic Vlogger", "Throbbing Touchpads of the Tempted Techie", "Pulsing Power Fists of the Pining Pirate"],
    rings: ["Data Ring", "Encryption Band", "Neural Link Ring", "Throbbing Bandwidth Band of the Bedchamber", "Choker-Ring of the Choked Codeslinger", "Garter Ring of the Greedy Gridrider"],
    amulets: ["AI Companion Chip", "Biometric Scanner", "Corporate ID Badge", "Locket of the Lusty Loginscreen", "Pendant of the Pierced Pixel", "Choker of the Captive Cybernaut"],
    ammo: ["Plasma Cells", "EMP Rounds", "Smart Bullets", "Throbbing Slugs of the Throbbing Servo", "Sticky Shells of the Sated Synth", "Pulsing Plasma of Premature Discharge"]
  },
  "Post-Apocalyptic": {
    weapons: ["Makeshift Spear of Desperation", "Pipe Rifle of Rust", "Spiked Bat of Negan", "Bone Club of Caveman", "Throbbing Rebar of the Restless Raider", "Pulsing Pipe Wrench of the Pining Pillager", "Sticky Sledgehammer of the Sated Survivor", "Quivering Crossbow of the Captive Courier"],
    shields: ["Car Door Shield", "Scrap Metal Barrier", "Tire Shield", "Heaving Hubcap of the Buxom Bandit", "Throbbing Tire-Shield of the Tempted Trader", "Pulsing Plate of the Pining Pioneer"],
    armors: ["Raider Leather", "Wasteland Armor", "Mutant Hide Jacket", "Crotchless Combat Tarp of the Brazen Brawler", "Lace-Up Leather of the Lusty Looter", "Mesh Bikini of the Mutant Marauder", "Garter-Holstered Wasteland Wrap"],
    heads: ["Gas Mask of Survivor", "Motorcycle Helmet", "Skull Mask of Raider", "Veiled Visor of the Voyeuristic Vagrant", "Bonnet of the Bedded Bandit", "Helm of the Hungry Heiress of Hollows"],
    cloaks: ["Tattered Cape", "Wasteland Duster", "Radiation Cloak", "Mantle of the Mounted Marauder", "Wrap of the Wet Wasteland", "Bustle Cloak of the Bothered Bandit"],
    boots: ["Comb

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