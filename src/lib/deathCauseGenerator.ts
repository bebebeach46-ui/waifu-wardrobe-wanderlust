export type DeathCause = {
  cause: string;
  shortDesc: string;
  fullDesc: string;
  killer?: string;
  damageType?: string;
  location?: string;
  ironic?: boolean;
};

// Combat death causes
const combatDeathCauses = [
  { cause: "melee", templates: [
    "Slain by {monster}'s crushing blow",
    "Torn apart by {monster}",
    "Beaten to death by {monster}",
    "Impaled by {monster}'s claws",
    "Decapitated by {monster}",
    "Gutted by {monster}'s savage attack"
  ]},
  { cause: "magic", templates: [
    "Incinerated by {monster}'s fire magic",
    "Frozen solid by {monster}'s ice spell",
    "Electrocuted by {monster}'s lightning bolt",
    "Disintegrated by {monster}'s arcane blast",
    "Soul ripped out by {monster}'s dark magic",
    "Imploded by {monster}'s void spell"
  ]},
  { cause: "poison", templates: [
    "Succumbed to {monster}'s venom",
    "Died from {monster}'s toxic bite",
    "Poisoned blood boiled by {monster}'s corruption",
    "Melted from the inside by {monster}'s acid"
  ]},
  { cause: "breath", templates: [
    "Reduced to ash by {monster}'s fire breath",
    "Flash-frozen by {monster}'s frost breath",
    "Corroded to nothing by {monster}'s acid breath",
    "Withered by {monster}'s necrotic breath"
  ]},
  { cause: "overwhelm", templates: [
    "Overwhelmed by a swarm of {monster}s",
    "Dogpiled by multiple {monster}s",
    "Surrounded and butchered by {monster}s",
    "Death by a thousand cuts from {monster}s"
  ]}
];

// Environmental/accident deaths
const accidentalDeaths = [
  { cause: "trap", templates: [
    "Impaled by a hidden spike trap",
    "Crushed by a falling ceiling trap",
    "Dissolved in an acid pit trap",
    "Incinerated by a fire glyph trap",
    "Teleported into solid rock by a malfunctioning portal",
    "Arrow trap to the knee... and everywhere else"
  ]},
  { cause: "fall", templates: [
    "Fell down a bottomless pit",
    "Slipped off a cliff into the abyss",
    "Tumbled down a staircase (all 847 steps)",
    "Gravity won the argument",
    "Terminal velocity achieved, terminal condition confirmed"
  ]},
  { cause: "environment", templates: [
    "Drowned in an underground river",
    "Suffocated in a collapsed tunnel",
    "Burned alive in volcanic fumes",
    "Frozen to death in a blizzard",
    "Struck by lightning during a storm",
    "Crushed by a rolling boulder",
    "Swallowed by quicksand"
  ]},
  { cause: "starvation", templates: [
    "Starved to death in the wilderness",
    "Died of thirst in the desert",
    "Wasted away searching for provisions"
  ]},
  { cause: "curse", templates: [
    "Withered away from an ancient curse",
    "Aged to dust by a time curse",
    "Soul devoured by a cursed artifact",
    "Transformed into stone by a gorgon's lingering magic"
  ]}
];

// Ironic/comedic deaths (rare)
const ironicDeaths = [
  "Choked on a victory feast",
  "Killed by a mimic pretending to be a health potion",
  "Died of embarrassment after a critical fumble",
  "Accidentally polymorphed into a newt and stepped on",
  "Killed by own reflected spell",
  "Backstabbed by a 'friendly' merchant",
  "Crushed by an overloaded inventory",
  "Died from eating an unidentified mushroom",
  "Killed by a door (it was locked, you weren't)",
  "Slipped on a banana peel in the dungeon",
  "Heart attack from opening a chest full of mimics",
  "Died reading a scroll of immolation",
  "Teleported into the sun",
  "Wished for immortality, got petrification instead",
  "Killed by a chicken that was secretly a polymorphed archmage"
];

// Status effect deaths
const statusDeaths = [
  { effect: "bleeding", templates: [
    "Bled out from untreated wounds",
    "Exsanguinated while searching for bandages",
    "The bleeding just wouldn't stop"
  ]},
  { effect: "burning", templates: [
    "Burned to death while fumbling for water",
    "Immolated by persistent flames",
    "Set ablaze and couldn't extinguish it"
  ]},
  { effect: "disease", templates: [
    "Succumbed to dungeon plague",
    "Rotted away from necrotic disease",
    "Fever claimed another adventurer"
  ]},
  { effect: "madness", templates: [
    "Lost all sanity and walked into lava",
    "Mind shattered, body followed",
    "Driven mad by eldritch whispers"
  ]}
];

export const generateCombatDeathCause = (
  monsterName: string,
  monsterRank: number,
  playerLevel: number,
  damageType?: string
): DeathCause => {
  // Higher rank monsters use more dramatic deaths
  let causePool = combatDeathCauses;
  
  // Select cause type based on monster or random
  let causeType = causePool[Math.floor(Math.random() * causePool.length)];
  
  // Prefer certain types for high-rank monsters
  if (monsterRank >= 7) {
    causeType = causePool.find(c => c.cause === "breath" || c.cause === "magic") || causeType;
  }
  
  const template = causeType.templates[Math.floor(Math.random() * causeType.templates.length)];
  const cause = template.replace(/{monster}/g, monsterName);
  
  // Add level comparison context
  let context = "";
  if (monsterRank >= 7) {
    context = ` (Rank ${monsterRank} - you never stood a chance)`;
  } else if (monsterRank >= 5) {
    context = ` (Rank ${monsterRank} - a deadly foe)`;
  } else if (monsterRank <= 2 && playerLevel > 10) {
    context = ` (Rank ${monsterRank} - the embarrassment burns worse than death)`;
  }

  return {
    cause: causeType.cause,
    shortDesc: cause,
    fullDesc: `${cause}${context}`,
    killer: monsterName,
    damageType: causeType.cause,
    ironic: monsterRank <= 2 && playerLevel > 10
  };
};

export const generateAccidentalDeathCause = (location?: string): DeathCause => {
  const allAccidents = accidentalDeaths.flatMap(a => 
    a.templates.map(t => ({ cause: a.cause, template: t }))
  );
  
  const selected = allAccidents[Math.floor(Math.random() * allAccidents.length)];
  
  return {
    cause: selected.cause,
    shortDesc: selected.template,
    fullDesc: location ? `${selected.template} in ${location}` : selected.template,
    location
  };
};

export const generateStatusDeathCause = (activeStatus?: string): DeathCause => {
  let pool = statusDeaths;
  
  if (activeStatus) {
    const matchingStatus = statusDeaths.find(s => 
      s.effect.toLowerCase().includes(activeStatus.toLowerCase())
    );
    if (matchingStatus) {
      pool = [matchingStatus];
    }
  }
  
  const selected = pool[Math.floor(Math.random() * pool.length)];
  const template = selected.templates[Math.floor(Math.random() * selected.templates.length)];
  
  return {
    cause: selected.effect,
    shortDesc: template,
    fullDesc: template,
    damageType: selected.effect
  };
};

export const generateIronicDeath = (): DeathCause => {
  const selected = ironicDeaths[Math.floor(Math.random() * ironicDeaths.length)];
  
  return {
    cause: "ironic",
    shortDesc: selected,
    fullDesc: selected,
    ironic: true
  };
};

export const generateRandomDeathCause = (
  context: {
    monsterName?: string;
    monsterRank?: number;
    playerLevel: number;
    location?: string;
    activeStatus?: string;
    questName?: string;
  }
): DeathCause => {
  const roll = Math.random();
  
  // 2% chance of ironic death
  if (roll < 0.02) {
    return generateIronicDeath();
  }
  
  // 10% status death if status exists
  if (context.activeStatus && roll < 0.12) {
    return generateStatusDeathCause(context.activeStatus);
  }
  
  // 20% accidental death
  if (roll < 0.32) {
    return generateAccidentalDeathCause(context.location || context.questName);
  }
  
  // 68% combat death
  if (context.monsterName && context.monsterRank !== undefined) {
    return generateCombatDeathCause(
      context.monsterName,
      context.monsterRank,
      context.playerLevel
    );
  }
  
  // Fallback to accidental
  return generateAccidentalDeathCause(context.questName);
};

// Generate epitaph-style death summary for the death log
export const generateEpitaph = (
  characterName: string,
  deathCause: DeathCause,
  level: number,
  questsCompleted: number
): string => {
  const titles = [
    questsCompleted >= 100 ? "the Legendary" :
    questsCompleted >= 50 ? "the Veteran" :
    questsCompleted >= 20 ? "the Seasoned" :
    questsCompleted >= 10 ? "the Adventurer" :
    questsCompleted >= 5 ? "the Novice" :
    "the Unfortunate"
  ];
  
  const title = titles[0];
  
  let epitaph = `Here lies ${characterName} ${title}\n`;
  epitaph += `Level ${level} | ${questsCompleted} quests completed\n`;
  epitaph += `\n`;
  epitaph += `Cause of Death:\n`;
  epitaph += `  ${deathCause.fullDesc}\n`;
  
  if (deathCause.ironic) {
    epitaph += `\n  (The bards will sing of this embarrassment for generations)`;
  }
  
  return epitaph;
};
