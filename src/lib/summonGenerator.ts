const summonPrefixes = [
  "Legendary", "Mythical", "Ancient", "Cosmic", "Ethereal", "Shadow", "Divine",
  "Pixel", "Glitched", "Cursed", "Blessed", "Quantum", "Cyber", "Steam-Powered",
  // Dark fantasy
  "Carrion", "Blighted", "Hollow", "Grave-Born", "Blood-Soaked", "Charnel",
  "Penitent", "Iron-Bound", "Plague-Kissed", "Flayed", "Bone-Wrought", "Ashen"
];

const summonTypes = [
  "Dragon", "Phoenix", "Golem", "Elemental", "Demon", "Angel", "Beast",
  "Mecha", "Ghost", "Slime", "Familiar", "Waifu", "Husbando", "Stand",
  "Persona", "Digimon", "Pokemon", "Keyblade", "JoJo Reference", "Truck-kun",
  "Excalibur", "Gundam", "Eva Unit", "Chocobo", "Carbuncle", "Cactuar",
  // Dark fantasy
  "Wraith", "Revenant", "Bone Colossus", "Skinwalker", "Abomination",
  "Crypt Fiend", "Night Terror", "Flesh Golem", "Soul Eater", "Plague Bearer",
  "Barrow Wight", "Carrion Swarm", "Pale Rider", "Iron Maiden", "Charnel Hound"
];

const summonSuffixes = [
  "of Doom", "of Destiny", "the Destroyer", "the Wise", "the Swift",
  "Prime", "EX", "Ultimate", "MAX", "Neo", "X", "Zero", "Alpha", "Omega",
  "Requiem", "Act 4", "Over Heaven", "Alter", "Lily", "Santa", "Summer",
  // Dark fantasy
  "the Unburied", "of the Hollow Gate", "the Twice-Dead", "of Endless Hunger",
  "the Rot-Crowned", "of the Final Grave", "the Skinless", "of Black Bile",
  "the Unforgiven", "of Wailing Ash", "the Branded", "of the Charnel Throne"
];

const summonAbilities = [
  "Ora Ora Barrage", "Kamehameha", "Rasengan", "Getsuga Tenshou", "Domain Expansion",
  "Plot Armor Activation", "Power of Friendship", "Nakama Power", "Main Character Syndrome",
  "Isekai Cheat Skill", "Harem Protagonist EX", "Truck-kun's Blessing", "God Mode Toggle",
  "Save Scumming", "RNG Manipulation", "Fourth Wall Break", "Fan Service Shield",
  // Dark fantasy
  "Soul Harvest", "Flesh Unraveling", "Bone Storm", "Plague Breath",
  "Death Knell", "Grave Eruption", "Blood Tithe", "Hollow Scream",
  "Corpse Detonation", "Iron Maiden Embrace", "Entropy Cascade", "Marrow Drain",
  "Wail of the Damned", "Necrotic Implosion", "Void Consumption", "Dread Aura"
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
