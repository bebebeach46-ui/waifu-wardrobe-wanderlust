const companionNames = [
  "Sakura", "Asuna", "Rem", "Zero Two", "Mikasa", "Hinata", "Nami", "Ryuko",
  "Kirito", "Naruto", "Goku", "Saitama", "Luffy", "Ichigo", "Edward", "Spike",
  "Aqua", "Megumin", "Darkness", "Nezuko", "Power", "Makima", "Faye", "Bulma"
];

const companionRaces = [
  "Human", "Elf", "Demon", "Angel", "Catgirl", "Android", "Vampire", "Dragon-kin",
  "Kitsune", "Oni", "Homunculus", "Cyborg", "Nekomata", "Succubus"
];

const companionClasses = [
  "Tsundere Warrior", "Kuudere Mage", "Yandere Assassin", "Dandere Healer",
  "Genki Ranger", "Senpai Knight", "Waifu Summoner", "Husbando Paladin",
  "Childhood Friend Fighter", "Rival Sorcerer", "Mysterious Stranger"
];

const preferences = [
  "Flowers", "Sweets", "Books", "Weapons", "Jewelry", "Rare Items", "Food",
  "Music", "Art", "Combat", "Magic Scrolls", "Potions", "Artifacts", "Pets"
];

const animeReferences = [
  "from the Hidden Leaf Village", "wielding a Stand", "with Sharingan eyes",
  "equipped with 3D Maneuver Gear", "carrying a Death Note", "with a Zanpakuto",
  "riding a Titan", "with Nen abilities", "from UA Academy", "with Devil Fruit powers",
  "blessed by Kami", "cursed by a Witch", "training for the Chunin Exams"
];

export const generateCompanion = (worldData: any) => {
  const name = companionNames[Math.floor(Math.random() * companionNames.length)];
  const race = companionRaces[Math.floor(Math.random() * companionRaces.length)];
  const companionClass = companionClasses[Math.floor(Math.random() * companionClasses.length)];
  const gender = Math.random() > 0.5 ? "Male" : "Female";
  const reference = animeReferences[Math.floor(Math.random() * animeReferences.length)];
  
  const companionPreferences = [];
  for (let i = 0; i < 3; i++) {
    const pref = preferences[Math.floor(Math.random() * preferences.length)];
    if (!companionPreferences.includes(pref)) {
      companionPreferences.push(pref);
    }
  }
  
  return {
    name,
    race,
    class: companionClass,
    gender,
    description: `${gender} ${race} ${reference}`,
    preferences: companionPreferences,
    relationship: 1,
    relationshipName: "Stranger",
    progressionRate: 0.5 + Math.random() * 1.5, // 0.5-2.0 points per quest
    gifts: []
  };
};

export const getRelationshipName = (level: number): string => {
  const names = [
    "Stranger", "Acquaintance", "Friend", "Close Friend", "Trusted Ally",
    "Dear Friend", "Cherished", "Beloved", "Soulmate", "Devoted"
  ];
  return names[Math.min(Math.floor(level), 9)];
};
