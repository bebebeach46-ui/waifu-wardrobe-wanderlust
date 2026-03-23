const physicalSkills = [
  "Kamehameha Strike", "One Punch", "Rasengan", "Detroit Smash", "Gum-Gum Pistol",
  "Omnislash", "Jet Black Wings", "Thunder Breathing", "Gentle Fist", "Iron Reaver Soul Stealer",
  "Serious Consecutive Punches", "Jet Gatling", "Water Wheel", "Spinning Bird Kick",
  "Meteor Strike", "Shadow Clone Attack", "Bankai Slash", "Spirit Gun", "Alchemy Transmutation",
  // Dark fantasy
  "Sever the Thread", "Bonecrusher Verdict", "Flayed Nerve Strike", "Marrow Splinter",
  "Dread Cleave", "Entropic Lunge", "Hollow Point Thrust", "Blood Tithe Slash",
  "Carrion Wind", "Ironside Rend", "Gallowglass Blow", "Plague Fist",
  "Shatter the Veil", "Visceral Execution", "Ashen Riposte", "Gravetender's Swing",
  "Soul Siphon Strike", "Umbral Laceration", "Nightfall Bisection", "Wraith Step Assault",
  "Ruinous Charge", "Deathmark Thrust", "Bloodletter's Flourish", "Catafalque Breaker"
];

const magicSpells = [
  { name: "Megumin's Explosive Climax", save: "reflex", failChance: 0.15 },
  { name: "Fireball of Flaming Passion", save: "reflex", failChance: 0.1 },
  { name: "Lightning Stroke", save: "fortitude", failChance: 0.1 },
  { name: "Tentacle Evard's Black Tentacles", save: "reflex", failChance: 0.2 },
  { name: "Charm Person (Extremely)", save: "will", failChance: 0.15 },
  { name: "Sleep of Eternal Disappointment", save: "will", failChance: 0.1 },
  { name: "Magic Missile of Penetration", save: "none", failChance: 0.05 },
  { name: "Cone of Cold Shoulder", save: "fortitude", failChance: 0.15 },
  { name: "Polymorph into Catgirl", save: "fortitude", failChance: 0.25 },
  { name: "Dimension Door to Lewd Dimension", save: "none", failChance: 0.1 },
  { name: "Hold Person (Sensually)", save: "will", failChance: 0.15 },
  { name: "Cure Wounds (And Emotional Trauma)", save: "none", failChance: 0.05 },
  { name: "Summon Waifu", save: "will", failChance: 0.2 },
  { name: "Invisibility to Parents", save: "none", failChance: 0.1 },
  { name: "Dispel Clothes", save: "reflex", failChance: 0.15 },
  { name: "Meteor Swarm of Destruction", save: "reflex", failChance: 0.3 },
  { name: "Time Stop (But Only for One Frame)", save: "none", failChance: 0.25 },
  { name: "Resurrection (With Plot Armor)", save: "none", failChance: 0.4 },
  { name: "Wish (But It's Monkey's Paw)", save: "none", failChance: 0.5 },
  { name: "Power Word: Orgasm", save: "fortitude", failChance: 0.2 },
  { name: "Disintegrate Virginity", save: "fortitude", failChance: 0.2 },
  { name: "Animate Dead Waifu", save: "none", failChance: 0.25 },
  { name: "Gate to Hentai Realm", save: "will", failChance: 0.3 },
  { name: "Timestop Groping Session", save: "none", failChance: 0.35 },
  { name: "Banishment to Friend Zone", save: "will", failChance: 0.15 },
  // Dark fantasy
  { name: "Hemorrhage Cascade", save: "fortitude", failChance: 0.15 },
  { name: "Wither Flesh", save: "fortitude", failChance: 0.1 },
  { name: "Soul Flay", save: "will", failChance: 0.2 },
  { name: "Blackfire Immolation", save: "reflex", failChance: 0.15 },
  { name: "Summon the Crawling Dark", save: "will", failChance: 0.25 },
  { name: "Corpse Blossom", save: "fortitude", failChance: 0.2 },
  { name: "Whisper of the Hanged", save: "will", failChance: 0.15 },
  { name: "Plague Wind", save: "fortitude", failChance: 0.2 },
  { name: "Grave Frost", save: "reflex", failChance: 0.1 },
  { name: "Rend Reality", save: "none", failChance: 0.35 },
  { name: "Blood Crucible", save: "fortitude", failChance: 0.2 },
  { name: "Necrotic Embrace", save: "will", failChance: 0.15 },
  { name: "Chains of the Forsaken", save: "reflex", failChance: 0.15 },
  { name: "Eldritch Puppetry", save: "will", failChance: 0.3 },
  { name: "Voidmaw", save: "reflex", failChance: 0.25 },
  { name: "Funeral Pyre of the Damned", save: "reflex", failChance: 0.3 },
  { name: "Ossuary Eruption", save: "reflex", failChance: 0.2 },
  { name: "Mark of the Hollow King", save: "will", failChance: 0.25 },
  { name: "Skinweave Armor", save: "none", failChance: 0.1 },
  { name: "Invoke the Nameless", save: "will", failChance: 0.4 }
];

const shopNames = [
  "Senpai's Armory", "Waifu Weapons Emporium", "The Weeb Shop", "Otaku Outfitters",
  "Nakama Gear", "Doki Doki Defense", "Sugoi Smithy", "Kawaii Combat Store",
  "Baka's Bazaar", "Desu Equipment", "Nani?! Necessities", "Yatta! Yard Sale",
  "Oni's Odds & Ends", "Shounen Shop", "Seinen Supplies", "Isekai Items"
];

export const generateSkills = (count: number = 3) => {
  const skills = [];
  const available = [...physicalSkills];
  
  for (let i = 0; i < count && available.length > 0; i++) {
    const index = Math.floor(Math.random() * available.length);
    skills.push(available.splice(index, 1)[0]);
  }
  
  return skills;
};

export const generateSpells = (count: number = 3) => {
  const spells = [];
  const available = [...magicSpells];
  
  for (let i = 0; i < count && available.length > 0; i++) {
    const index = Math.floor(Math.random() * available.length);
    spells.push(available.splice(index, 1)[0]);
  }
  
  return spells;
};

export const castSpell = (spell: typeof magicSpells[0], casterStats: any, targetSave: number = 10) => {
  // Check for spell failure
  if (Math.random() < spell.failChance) {
    return { success: false, message: `${spell.name} fizzled pathetically!`, criticalFail: Math.random() < 0.1 };
  }
  
  // Check saving throw
  if (spell.save !== "none") {
    const saveRoll = Math.floor(Math.random() * 20) + 1;
    if (saveRoll + targetSave >= 15) {
      return { success: false, message: `Target resisted ${spell.name}!` };
    }
  }
  
  return { success: true, message: `${spell.name} hits dramatically!` };
};

export const generateShopName = () => {
  return shopNames[Math.floor(Math.random() * shopNames.length)];
};

export const generateStats = () => {
  return {
    strength: Math.floor(Math.random() * 18) + 3,  // 3-20
    dexterity: Math.floor(Math.random() * 18) + 3,
    constitution: Math.floor(Math.random() * 18) + 3,
    intelligence: Math.floor(Math.random() * 18) + 3,
    wisdom: Math.floor(Math.random() * 18) + 3,
    charisma: Math.floor(Math.random() * 18) + 3,
    luck: Math.floor(Math.random() * 18) + 3
  };
};
