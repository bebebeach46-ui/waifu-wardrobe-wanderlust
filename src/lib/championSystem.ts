// Champion System — humanoid/villain boss encounters at the end of each area

export interface Champion {
  name: string;
  title: string;
  species: string;
  minions: ChampionMinion[];
  powerLevel: number; // scales with region danger
  goldReward: number;
  expReward: number;
  description: string;
}

export interface ChampionMinion {
  name: string;
  count: number;
}

export interface ChampionResult {
  champion: Champion;
  victory: boolean;
  fameGained: number;
  combatNarrative: string;
}

// Species pools
const species = [
  "Human", "Dark Elf", "Half-Orc", "Tiefling", "Dragonborn", "Vampire",
  "Dhampir", "Drow", "Hobgoblin", "Gnoll Warlord", "Lizardfolk", "Minotaur",
  "Oni", "Rakshasa", "Cambion", "Duergar", "Goliath", "Yuan-Ti", "Kenku",
  "Kobold King", "Bugbear Chief", "Harpy Matriarch", "Lamia", "Medusa",
  "Aasimar Fallen", "Warforged Rogue", "Revenant", "Lich (in disguise)",
  // Dark fantasy
  "Plague Lord", "Skinwalker", "Grave-Born", "Blood Hag", "Ash Wraith",
  "Iron Lich", "Carrion Knight", "Hollow One", "Bone Naga Sovereign",
  "Death-Marked Human", "Cursed Inquisitor", "Defiled Paladin",
  "Fleshcrafter", "Abyssal Warlord", "Ghoul Patriarch", "Striga",
  "Wendigo Chieftain", "Barrow King", "Pyre Maiden", "Void-Touched Seer"
];

// First names
const firstNames = [
  "Vex", "Kael", "Mordecai", "Seraphina", "Grimjaw", "Isolde", "Thorne",
  "Zara", "Balthazar", "Nyx", "Corvus", "Ashara", "Drakken", "Lilith",
  "Magnus", "Ravenna", "Silas", "Yuki", "Fenris", "Calista", "Draven",
  "Morgana", "Aldric", "Vesper", "Kazuya", "Sakura", "Ragna", "Freya",
  "Gideon", "Hela", "Judas", "Karma", "Loki", "Mephisto", "Nero",
  // Dark fantasy
  "Lazarus", "Morwen", "Caligula", "Thessaly", "Vashti", "Oberon",
  "Cressida", "Alaric", "Malachai", "Severin", "Isadora", "Thanatos",
  "Elspeth", "Grimshaw", "Carnifex", "Desmond", "Nocturne", "Sable",
  "Hadrian", "Ysabel", "Cain", "Briar", "Ossian", "Amaranth"
];

// Titles / epithets
const titles = [
  "the Ruthless", "Blade of Sorrow", "the Betrayer", "Shadow Sovereign",
  "Flesh Merchant", "the Unforgivable", "Skull Collector", "Soul Butcher",
  "the Tyrant", "Doom Bringer", "Blood Countess", "the Mad", "Pain Weaver",
  "the Unkillable", "Corpse Dancer", "Night Terror", "the Disgraced",
  "Puppet Master", "the Forsaken", "Chaos Herald", "the Wretched",
  "Iron Fist", "Gold Hoarder", "Poison Tongue", "the Abyssal",
  "the Self-Proclaimed Genius", "the Unnecessarily Dramatic",
  "the One Who Never Shuts Up", "Who-Must-Not-Be-Googled",
  "Tax Evader Supreme", "the Mid Boss", "Budget Final Boss",
  "the LinkedIn Influencer", "Certified Villain™", "the Edge Lord",
  // Dark fantasy
  "the Flayed", "Architect of Ruin", "the Pyre-Walker", "Eater of Names",
  "Who Wears the Skin of Saints", "the Hollow Sovereign", "Warden of Mass Graves",
  "the Twice-Hanged", "Keeper of the Charnel Pit", "the Undying Grievance",
  "Breaker of Holy Ground", "the Branded Heretic", "Who Speaks with Dead Tongues",
  "the Rot-Crowned", "Ender of Bloodlines", "the Last Mercy",
  "Bane of the Living", "the Unmarked Grave", "Who Burns from Within"
];

// Minion types
const minionTypes = [
  "Loyal Fanatics", "Undead Servants", "Hired Thugs", "Brainwashed Cultists",
  "Summoned Imps", "Mechanical Golems", "Shadow Clones", "Enslaved Goblins",
  "Corrupt Soldiers", "Animated Armors", "Venomous Beasts", "Dark Acolytes",
  "Skeleton Warriors", "Berserker Wolves", "Trap Mimics", "Explosive Homunculi",
  "Simp Army", "Reddit Moderators", "HOA Enforcers", "Middle Management",
  // Dark fantasy
  "Flayed Penitents", "Bone Constructs", "Plague-Ravaged Thralls",
  "Hollow-Eyed Conscripts", "Grave-Risen Veterans", "Skinstitched Abominations",
  "Branded Heretics", "Iron Maiden Sentinels", "Carrion Swarms",
  "Chained Wraiths", "Worm-Eaten Knights", "Blighted War Hounds"
];

// Champion descriptions by species archetype
const descriptionTemplates = [
  "A {species} who terrorizes {area} with an iron fist and questionable fashion choices",
  "Once a hero, this {species} turned to villainy after a bad Yelp review",
  "This {species} commands {minion_count} minions from atop a pile of stolen gold",
  "A feared {species} warlord whose monologues are longer than the actual fights",
  "The self-appointed ruler of {area}, this {species} demands tribute in the form of snacks",
  "A disgraced {species} noble who took up banditry because 'the economy'",
  "This {species} claims to be the final boss but is clearly mid-game at best",
  "A {species} champion whose tragic backstory takes 45 minutes to explain",
  // Dark fantasy
  "A {species} warlord who nailed the heads of former rivals to the gates of {area}",
  "This {species} rose from a plague pit and now commands {minion_count} damned souls",
  "A feared {species} whose very presence causes livestock to die and wells to run black",
  "Once executed for heresy, this {species} clawed free of the grave to claim dominion over {area}",
  "A {species} despot who demands blood tithes from every settlement in {area}",
  "This {species} carved their throne from the bones of a cathedral and rules {area} through dread",
  "A {species} butcher who considers mercy a weakness and compassion a disease",
  "The {species} known only as 'the Empty One' — their {minion_count} followers worship in terrified silence",
];

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generateChampion = (
  regionDangerLevel: number,
  areaName: string,
  playerLevel: number
): Champion => {
  const chosenSpecies = pick(species);
  const firstName = pick(firstNames);
  const title = pick(titles);
  const powerLevel = Math.max(1, regionDangerLevel + Math.floor(Math.random() * 3) - 1);

  // Generate 1-3 minion groups
  const minionGroupCount = 1 + Math.floor(Math.random() * 3);
  const minions: ChampionMinion[] = [];
  const usedTypes = new Set<string>();
  for (let i = 0; i < minionGroupCount; i++) {
    let type = pick(minionTypes);
    while (usedTypes.has(type)) type = pick(minionTypes);
    usedTypes.add(type);
    minions.push({
      name: type,
      count: 2 + Math.floor(Math.random() * (powerLevel + 2))
    });
  }

  const totalMinions = minions.reduce((s, m) => s + m.count, 0);
  const baseGold = 50 + powerLevel * 30 + playerLevel * 5;
  const baseExp = 30 + powerLevel * 25 + playerLevel * 3;

  const desc = pick(descriptionTemplates)
    .replace("{species}", chosenSpecies)
    .replace("{area}", areaName)
    .replace("{minion_count}", String(totalMinions));

  return {
    name: `${firstName} ${title}`,
    title,
    species: chosenSpecies,
    minions,
    powerLevel,
    goldReward: baseGold + Math.floor(Math.random() * 50),
    expReward: baseExp + Math.floor(Math.random() * 40),
    description: desc
  };
};

// Resolve champion encounter — always a victory in idle game, but quality varies
export const resolveChampionEncounter = (
  champion: Champion,
  playerLevel: number,
  playerStats: { strength: number; dexterity: number; luck: number },
  championsDefeated: number
): ChampionResult => {
  const totalMinions = champion.minions.reduce((s, m) => s + m.count, 0);

  // Build narrative
  const minionNarrative = champion.minions
    .map(m => `${m.count} ${m.name}`)
    .join(", ");

  const intros = [
    `${champion.name} (${champion.species}) blocks the path with ${minionNarrative}!`,
    `"You dare trespass?" bellows ${champion.name}, flanked by ${minionNarrative}.`,
    `A dramatic wind blows as ${champion.name} and their ${totalMinions} minions appear.`,
    `${champion.name} drops from the ceiling (unnecessary but dramatic) with ${minionNarrative}.`,
  ];

  const victories = [
    `After scattering the minions, you defeat ${champion.name} in single combat!`,
    `${champion.name}'s minions flee as you land the final blow. "This isn't even my final form—" they collapse.`,
    `You systematically dismantle the ${totalMinions} minions before confronting ${champion.name} directly.`,
    `${champion.name} surrenders mid-monologue after watching you obliterate their entire entourage.`,
  ];

  const narrative = `${pick(intros)} ${pick(victories)}`;

  // Fame from champions: +1 base, with milestones at 5, 15, 30, 50, 100
  let fameGained = 1;
  const newTotal = championsDefeated + 1;
  if (newTotal === 5) fameGained += 3;
  else if (newTotal === 15) fameGained += 5;
  else if (newTotal === 30) fameGained += 8;
  else if (newTotal === 50) fameGained += 12;
  else if (newTotal === 100) fameGained += 20;
  else if (newTotal % 25 === 0) fameGained += 5;

  // Luck bonus
  if (playerStats.luck > 14 && Math.random() < 0.15) {
    fameGained += 1;
  }

  return {
    champion,
    victory: true,
    fameGained,
    combatNarrative: narrative
  };
};

// Fame milestone titles from champion kills
export const getChampionSlayerTitle = (count: number): string | null => {
  if (count >= 100) return "Champion Annihilator";
  if (count >= 50) return "Champion Nemesis";
  if (count >= 30) return "Champion Hunter";
  if (count >= 15) return "Champion Slayer";
  if (count >= 5) return "Champion Challenger";
  if (count >= 1) return "Champion Victor";
  return null;
};
