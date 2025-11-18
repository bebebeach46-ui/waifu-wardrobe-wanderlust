import { Alignment } from "./deityGenerator";
import { SkillRank } from "./skillRankGenerator";

const companionNames = [
  "Sakura", "Asuna", "Rem", "Zero Two", "Mikasa", "Hinata", "Nami", "Ryuko",
  "Kirito", "Naruto", "Goku", "Saitama", "Luffy", "Ichigo", "Edward", "Spike",
  "Aqua", "Megumin", "Darkness", "Nezuko", "Power", "Makima", "Faye", "Bulma"
];

const companionRaces = [
  "Human", "High Elf", "Dark Elf", "Wood Elf", "Demon", "Angel", "Fallen Angel",
  "Catgirl (Neko)", "Doggirl (Inu)", "Foxgirl (Kitsune)", "Wolfgirl (Okami)",
  "Bunnygirl (Usagi)", "Mousegirl", "Raccoongirl (Tanuki)", "Squirrelgirl",
  "Android", "Cyborg", "Vampire", "Dhampir", "Werewolf", "Werefox",
  "Dragon-kin (Winged)", "Dragon-kin (Horned)", "Dragon-kin (Scaled)",
  "Kitsune (Multi-tailed)", "Oni (Horned)", "Oni (Tusked)",
  "Homunculus", "Nekomata (Twin-tailed)", "Bakeneko",
  "Succubus (Winged)", "Incubus (Horned)", "Dullahan (Headless)",
  "Lamia (Snake-tailed)", "Harpy (Winged)", "Arachne (Spider-bodied)",
  "Centaur", "Holstaur (Cow-eared)", "Minotaur (Horned)",
  "Slime Girl", "Dryad (Plant-bodied)", "Alraune (Flower-bodied)",
  "Mermaid (Fish-tailed)", "Siren (Scaled)", "Selkie",
  "Phoenix-kin (Flaming Wings)", "Tengu (Crow-winged)", "Valkyrie (Armored Wings)",
  "Zombie Girl", "Jiangshi (Hopping)", "Ghost Girl (Ethereal)",
  "Manticore (Scorpion-tailed)", "Sphinx (Lion-bodied)", "Chimera",
  "Goblin Girl", "Orc Girl (Tusked)", "Ogre Girl (Horned)",
  "Fairy (Butterfly Wings)", "Pixie (Dragonfly Wings)", "Imp (Bat Wings)",
  "Yuki-onna (Ice Horns)", "Jorogumo (Spider Features)", "Kappa (Turtle Shell)",
  "Anubis (Jackal-eared)", "Bastet (Cat-eared)", "Apophis (Snake Features)"
];

const companionClasses = [
  "Tsundere Warrior", "Kuudere Mage", "Yandere Assassin", "Dandere Healer",
  "Genki Ranger", "Senpai Knight", "Waifu Summoner", "Husbando Paladin",
  "Childhood Friend Fighter", "Rival Sorcerer", "Mysterious Stranger"
];

const preferences = [
  "Flowers", "Sweets", "Books", "Weapons", "Jewelry", "Rare Items", "Food",
  "Music", "Art", "Combat", "Magic Scrolls", "Potions", "Artifacts", "Pets",
  "Master Fishermen", "Expert Smiths", "Legendary Alchemists", "Fashion Icons"
];

const animeReferences = [
  "from the Hidden Leaf Village", "wielding a Stand", "with Sharingan eyes",
  "equipped with 3D Maneuver Gear", "carrying a Death Note", "with a Zanpakuto",
  "riding a Titan", "with Nen abilities", "from UA Academy", "with Devil Fruit powers",
  "blessed by Kami", "cursed by a Witch", "training for the Chunin Exams"
];

// Calculate compatibility based on player character
export const calculateCompatibility = (
  companion: any,
  playerRace: string,
  playerClass: string,
  playerSkills: any[]
): number => {
  let compatibility = 0;
  
  // Race compatibility (same race = high compatibility)
  if (companion.race === playerRace) {
    compatibility += 3;
  }
  
  // Class compatibility (complementary classes)
  const classCompatibility: { [key: string]: string[] } = {
    "Warrior": ["Kuudere Mage", "Dandere Healer"],
    "Mage": ["Tsundere Warrior", "Husbando Paladin"],
    "Rogue": ["Yandere Assassin", "Genki Ranger"],
    "Scavenger": ["Yandere Assassin", "Mysterious Stranger"]
  };
  
  if (classCompatibility[playerClass]?.includes(companion.class)) {
    compatibility += 2;
  }
  
  // Skill preference match
  if (companion.skillPreference && playerSkills) {
    const hasMatchingSkill = playerSkills.some(s => s.rank === companion.skillPreference);
    if (hasMatchingSkill) {
      compatibility += 4; // High compatibility for skill match
    }
  }
  
  return compatibility;
};

// Determine bond level cap based on compatibility and party composition
export const getBondLevelCap = (
  companionIndex: number,
  compatibility: number,
  existingCompanions: any[]
): number => {
  // Count how many companions are already at max bond
  const maxBondCompanions = existingCompanions.filter(c => c.bondCap === 10).length;
  
  // First 2 high-compatibility companions can reach 10
  if (compatibility >= 5 && maxBondCompanions < 2) {
    return 10;
  }
  
  // Medium compatibility can reach 8
  if (compatibility >= 3) {
    return 8;
  }
  
  // Low compatibility stops at 5
  return 5;
};

export const generateCompanion = (
  worldData: any,
  playerCharacter?: any,
  existingCompanions: any[] = []
) => {
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
  
  // Random alignment for companion
  const alignmentValues: Alignment[] = [
    "Utter Consumed Evil", "Very Evil", "Evil", "Slightly Evil",
    "Absolute Neutral", "Slightly Good", "Good", "Very Good", "Paragon of Shining Virtue"
  ];
  const alignment = alignmentValues[Math.floor(Math.random() * alignmentValues.length)];
  
  // Skill preference (30% chance they prefer a master-level skill)
  const skillPreference: SkillRank | null = Math.random() < 0.3 ? 
    (["Master", "Grandmaster"] as SkillRank[])[Math.floor(Math.random() * 2)] : null;
  
  const companion = {
    name,
    race,
    class: companionClass,
    gender,
    description: `${gender} ${race} ${reference}`,
    preferences: companionPreferences,
    relationship: 1,
    relationshipName: "Stranger",
    progressionRate: 0.5 + Math.random() * 1.5, // 0.5-2.0 points per quest
    gifts: [],
    alignment,
    skillPreference
  };
  
  // Calculate compatibility and bond cap if player character provided
  if (playerCharacter) {
    const compatibility = calculateCompatibility(
      companion,
      playerCharacter.race,
      playerCharacter.class,
      playerCharacter.skills || []
    );
    const bondCap = getBondLevelCap(existingCompanions.length, compatibility, existingCompanions);
    
    return {
      ...companion,
      compatibility,
      bondCap
    };
  }
  
  // Default for old saves
  return {
    ...companion,
    compatibility: 0,
    bondCap: 10
  };
};

export const getRelationshipName = (level: number): string => {
  const names = [
    "Stranger", "Acquaintance", "Friend", "Close Friend", "Trusted Ally",
    "Dear Friend", "Cherished", "Beloved", "Soulmate", "Devoted"
  ];
  return names[Math.min(Math.floor(level), 9)];
};
