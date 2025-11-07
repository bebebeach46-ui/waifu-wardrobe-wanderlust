const physicalSkills = [
  "Kamehameha Strike", "One Punch", "Rasengan", "Detroit Smash", "Gum-Gum Pistol",
  "Omnislash", "Jet Black Wings", "Thunder Breathing", "Gentle Fist", "Iron Reaver Soul Stealer",
  "Serious Consecutive Punches", "Jet Gatling", "Water Wheel", "Spinning Bird Kick",
  "Meteor Strike", "Shadow Clone Attack", "Bankai Slash", "Spirit Gun", "Alchemy Transmutation"
];

const magicSpells = [
  "Explosion!", "Fireball Jutsu", "Spirit Bomb", "Amaterasu", "Cero",
  "Lightning Bolt", "Time Stop", "Dimension Slash", "Curse of Death", "Holy Purification",
  "Meteor Storm", "Black Hole", "Reanimation", "Gate of Babylon", "Reality Marble",
  "Shinra Tensei", "Domain Expansion", "Kamui", "Eight Gates Released", "Tailed Beast Bomb"
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

export const generateShopName = () => {
  return shopNames[Math.floor(Math.random() * shopNames.length)];
};

export const generateStats = () => {
  return {
    str: Math.floor(Math.random() * 18) + 3,  // 3-20
    con: Math.floor(Math.random() * 18) + 3,
    dex: Math.floor(Math.random() * 18) + 3,
    agi: Math.floor(Math.random() * 18) + 3,
    wis: Math.floor(Math.random() * 18) + 3,
    cha: Math.floor(Math.random() * 18) + 3
  };
};
