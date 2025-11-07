const summonPrefixes = [
  "Legendary", "Mythical", "Ancient", "Cosmic", "Ethereal", "Shadow", "Divine",
  "Pixel", "Glitched", "Cursed", "Blessed", "Quantum", "Cyber", "Steam-Powered"
];

const summonTypes = [
  "Dragon", "Phoenix", "Golem", "Elemental", "Demon", "Angel", "Beast",
  "Mecha", "Ghost", "Slime", "Familiar", "Waifu", "Husbando", "Stand",
  "Persona", "Digimon", "Pokemon", "Keyblade", "JoJo Reference", "Truck-kun",
  "Excalibur", "Gundam", "Eva Unit", "Chocobo", "Carbuncle", "Cactuar"
];

const summonSuffixes = [
  "of Doom", "of Destiny", "the Destroyer", "the Wise", "the Swift",
  "Prime", "EX", "Ultimate", "MAX", "Neo", "X", "Zero", "Alpha", "Omega",
  "Requiem", "Act 4", "Over Heaven", "Alter", "Lily", "Santa", "Summer"
];

const summonAbilities = [
  "Ora Ora Barrage", "Kamehameha", "Rasengan", "Getsuga Tenshou", "Domain Expansion",
  "Plot Armor Activation", "Power of Friendship", "Nakama Power", "Main Character Syndrome",
  "Isekai Cheat Skill", "Harem Protagonist EX", "Truck-kun's Blessing", "God Mode Toggle",
  "Save Scumming", "RNG Manipulation", "Fourth Wall Break", "Fan Service Shield"
];

export const generateSummon = () => {
  const prefix = summonPrefixes[Math.floor(Math.random() * summonPrefixes.length)];
  const type = summonTypes[Math.floor(Math.random() * summonTypes.length)];
  const suffix = summonSuffixes[Math.floor(Math.random() * summonSuffixes.length)];
  const ability = summonAbilities[Math.floor(Math.random() * summonAbilities.length)];
  
  const power = Math.floor(Math.random() * 9000) + 1000; // Over 9000 reference
  
  return {
    name: `${prefix} ${type} ${suffix}`,
    ability,
    power,
    description: `A ${prefix.toLowerCase()} ${type.toLowerCase()} with the power of ${ability}!`
  };
};
