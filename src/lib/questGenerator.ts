import { TravelState, Area } from "./locationSystem";
 import { EncounterPreference } from "./companionEncounterSystem";

// Quest rank system (1-10)
export interface QuestRank {
  rank: number;
  name: string;
  color: string;
  bgColor: string;
  expMultiplier: number;
  goldMultiplier: number;
  companionChance: number; // Base chance to attract companion
}

export const questRanks: QuestRank[] = [
  { rank: 1, name: "Simple", color: "text-gray-400", bgColor: "bg-gray-800", expMultiplier: 0.5, goldMultiplier: 0.5, companionChance: 0.01 },
  { rank: 2, name: "Common", color: "text-gray-300", bgColor: "bg-gray-700", expMultiplier: 0.75, goldMultiplier: 0.75, companionChance: 0.02 },
  { rank: 3, name: "Uncommon", color: "text-green-400", bgColor: "bg-green-900/50", expMultiplier: 1, goldMultiplier: 1, companionChance: 0.03 },
  { rank: 4, name: "Rare", color: "text-blue-400", bgColor: "bg-blue-900/50", expMultiplier: 1.25, goldMultiplier: 1.25, companionChance: 0.05 },
  { rank: 5, name: "Epic", color: "text-purple-400", bgColor: "bg-purple-900/50", expMultiplier: 1.5, goldMultiplier: 1.5, companionChance: 0.08 },
  { rank: 6, name: "Heroic", color: "text-yellow-400", bgColor: "bg-yellow-900/50", expMultiplier: 2, goldMultiplier: 2, companionChance: 0.1 },
  { rank: 7, name: "Mythic", color: "text-orange-400", bgColor: "bg-orange-900/50", expMultiplier: 2.5, goldMultiplier: 2.5, companionChance: 0.15 },
  { rank: 8, name: "Divine", color: "text-pink-400", bgColor: "bg-pink-900/50", expMultiplier: 3, goldMultiplier: 3, companionChance: 0.2 },
  { rank: 9, name: "Apocalyptic", color: "text-red-500", bgColor: "bg-red-900/50", expMultiplier: 4, goldMultiplier: 4, companionChance: 0.3 },
  { rank: 10, name: "Legendary", color: "text-rainbow animate-pulse", bgColor: "bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-yellow-900/50", expMultiplier: 5, goldMultiplier: 5, companionChance: 0.5 }
];

// Quest templates organized by type
const questTemplates = {
  combat: [
    { name: "Subjugate the Awakened", desc: "A primordial beast stirs from eons of slumber", subjects: ["Titan", "Colossus", "Leviathan", "Behemoth", "World Turtle", "Ur-Dragon"] },
    { name: "Shatter the Vanguard of", desc: "Elite forces march under a crimson banner", subjects: ["the Demon General", "the Dark Commander", "the Fell Knight", "the Shadow Marshal", "Lord Edgelord the Misunderstood"] },
    { name: "Settle the Blood Oath with", desc: "Ancient grudges demand satisfaction", subjects: ["your Rival", "the Nemesis", "your Evil Twin", "the Mirror Self", "That Guy From the Tutorial"] },
    { name: "Track the Apex Predator of", desc: "Hunters become the hunted in treacherous terrain", subjects: ["the Wilds", "the Abyss", "the Crimson Mire", "the Bone Valley", "the Suspiciously Empty Meadow"] },
    { name: "Survive the Gauntlet of", desc: "Champions fall one by one in this merciless trial", subjects: ["Seven Devils", "Twelve Trials", "Endless Nightmares", "the Undefeated", "Mildly Inconvenient Traps"] },
    { name: "Punch a God in the Face at", desc: "Theology was never meant to be this hands-on", subjects: ["the Celestial Arena", "the Astral Colosseum", "Mount Hubris", "the Altar of Regret"] },
    { name: "Duel the Suspiciously Powerful", desc: "Their power level is definitely over 9000", subjects: ["Barkeep", "Farmer", "Retired Adventurer", "Street Vendor", "Village Elder", "Mysterious Child"] },
    { name: "End the Rampage of", desc: "Something very large and very angry needs calming down", subjects: ["the Hangry Wyrm", "the Jilted Golem", "the Caffeinated Berserker", "the Tax Collector"] },
    { name: "Answer the Challenge at", desc: "Honor demands you face destiny blade to blade", subjects: ["Crimson Dawn", "the Moonlit Arena", "the Precipice of Fate", "the Inconvenient Bridge"] },
    { name: "Confront the Berserk", desc: "Madness has claimed a once-noble warrior", subjects: ["Champion", "Paladin", "War God", "Blade Saint", "Ex-Healer Who Snapped"] },
    { name: "Hunt the", desc: "A legendary quarry demands legendary skill", subjects: ["White Stag of Prophecy", "Obsidian Wyrm", "Thunder Phoenix", "Void Serpent", "Last Shiny Slime"] },
    { name: "Defeat the Obviously Evil", desc: "Nobody saw this betrayal coming (everyone saw it coming)", subjects: ["Advisor", "Court Wizard", "Childhood Friend", "Smiling Merchant", "Helpful NPC"] },
    { name: "Withstand the Onslaught of", desc: "They just keep coming and they won't stop", subjects: ["a Thousand Goblins", "the Undead Horde", "Weaponized Cabbages", "Angry Townsfolk", "Fan Mail"] },
    { name: "Challenge the Undefeated", desc: "They haven't lost a fight in centuries—you'll fix that", subjects: ["Sword Saint", "Grandmaster", "Living Legend", "Retired Demon Lord", "Tournament Arc Boss"] }
  ],
  exploration: [
    { name: "Breach the Sealed Labyrinth of", desc: "Ancient traps guard forgotten treasures", subjects: ["the Mad Architect", "the Eternal Maze", "Shifting Shadows", "a Thousand Doors", "Mostly Locked Doors"] },
    { name: "Chart the Impossible Geography of", desc: "Reality bends in this uncharted realm", subjects: ["the Fractured Lands", "the Inverted Mountain", "the Floating Isles", "the Upside-Down Lake"] },
    { name: "Unearth the Lost Civilization beneath", desc: "History's greatest mystery awaits discovery", subjects: ["the Sands", "the Ice", "the Roots", "the Waves", "the Parking Lot"] },
    { name: "Ascend the Forbidden Peak of", desc: "Where mortals were never meant to tread", subjects: ["Mount Calamity", "the Stormspire", "Heaven's Gate", "the Screaming Summit", "Mount Plot Device"] },
    { name: "Descend into the Abyss called", desc: "Light itself fears to enter", subjects: ["the Maw", "Eternity's Well", "the God's Grave", "the Bottomless Descent", "the Very Deep Hole"] },
    { name: "Stumble into the Hidden", desc: "You weren't supposed to find this place", subjects: ["Developer Room", "Secret Hot Spring", "Bonus Dungeon", "Parallel Timeline", "Glitch Zone"] },
    { name: "Pioneer the Trail to", desc: "Blaze a path where none have gone", subjects: ["the Edge of the World", "the Hidden Paradise", "the Last Frontier", "the Suspiciously Named 'Safe Zone'"] },
    { name: "Explore the Anomaly within", desc: "Space and time twist in impossible ways", subjects: ["the Rift", "the Shattered Zone", "the Paradox Field", "Yesterday's Tomorrow"] },
    { name: "Investigate the Disappearance at", desc: "An entire settlement vanished overnight", subjects: ["Fogwatch Village", "the Merchant Quarter", "Camp Last-Seen", "the Plot-Relevant Town"] },
    { name: "Navigate the Ever-Shifting", desc: "The map is useless here—it keeps changing", subjects: ["Corridors of Madness", "Dream Archipelago", "Drunk Cartographer's Nightmare", "Living Dungeon"] },
    { name: "Discover What Lurks Beyond", desc: "The sign says 'Do Not Enter' for a reason", subjects: ["the Forbidden Door", "the World's Edge", "the Final Save Point", "the Fourth Wall"] }
  ],
  collection: [
    { name: "Gather the Scattered Orbs of", desc: "Cosmic power awaits those who collect them all", subjects: ["Divine Will", "Primordial Chaos", "the Star Dragon", "Infinite Wishes", "Vaguely Defined Power"] },
    { name: "Claim the Hoard of the Fallen", desc: "A dragon's lifetime of treasures lie unguarded", subjects: ["Dragon Emperor", "Treasure King", "Gold Tyrant", "Hoarder Supreme"] },
    { name: "Harvest the Essence of", desc: "Rare reagents bloom only in deadly places", subjects: ["Moonfire Blossoms", "Starfall Crystals", "Phoenix Tears", "Dragon Heartwood", "Plot Coupons"] },
    { name: "Recover the Stolen Relic from", desc: "Sacred artifacts must return to their rightful place", subjects: ["the Shadow Syndicate", "the Heretic's Vault", "the Demon's Trophy Room", "That One Thief Again"] },
    { name: "Assemble the Fragments of", desc: "A shattered artifact yearns to be whole again", subjects: ["the God Blade", "the Crown of Ages", "the Reality Key", "the MacGuffin Prime"] },
    { name: "Plunder the Sealed Treasury of", desc: "Riches beyond imagination lie behind ancient wards", subjects: ["the Dead Kingdom", "the Sunken Empire", "the Sky Citadel", "the IRS"] },
    { name: "Collect All 108", desc: "There's always exactly 108 of them, isn't there", subjects: ["Cursed Prayer Beads", "Demon Stars", "Celestial Seals", "Wayward Spirits", "Missing Socks of Power"] },
    { name: "Obtain the Legendary", desc: "Only the worthy may possess such power", subjects: ["Philosopher's Stone", "Cosmic Egg", "Wish Granter", "Heart of the World", "+99 Holy Avenger"] },
    { name: "Loot the Entire", desc: "If it's not nailed down, it's inventory", subjects: ["Haunted Mansion", "Ancient Temple", "Dragon's Lair", "Suspiciously Unguarded Vault", "Overworld Map"] },
    { name: "Find the Last Remaining", desc: "They said it was extinct—they were almost right", subjects: ["Adamantine Ore Vein", "World Tree Seedling", "Unicorn Horn", "Honest Merchant", "Bug-Free Code Scroll"] }
  ],
  escort: [
    { name: "Guide the Reluctant Heir through", desc: "They claim they don't need your help... but they absolutely do", subjects: ["the Assassination Gauntlet", "the Political Minefield", "their Awakening Journey", "Basic Survival Skills"] },
    { name: "Safeguard the Merchant Prince's Expedition to", desc: "Untold wealth attracts untold dangers", subjects: ["the Silk Road's End", "the Spice Islands", "the Crystal Markets", "the Black Friday Bazaar"] },
    { name: "Defend the Last Village against", desc: "These people have nowhere else to go", subjects: ["the Demon Tide", "the Corrupted Forest", "the Endless Winter", "Property Developers"] },
    { name: "Mount a Daring Rescue into", desc: "Someone precious waits in the heart of danger", subjects: ["the Demon Lord's Castle", "the Slave Pits", "the Mind Prison", "Another Castle"] },
    { name: "Babysit the Overpowered", desc: "They could destroy the world by sneezing—keep them calm", subjects: ["Chosen One", "Demon Prince Toddler", "Amnesiac Goddess", "Unstable Homunculus"] },
    { name: "Accompany the Runaway Noble to", desc: "They flee from a fate worse than death", subjects: ["Freedom's Shore", "the Sanctuary Beyond", "their True Love", "Literally Anywhere Else"] },
    { name: "Protect the Chosen One during", desc: "The prophecy demands they survive... somehow", subjects: ["the Awakening Ritual", "the Journey to the Sacred Land", "their Emo Phase", "their Training Montage"] },
    { name: "Evacuate the Survivors from", desc: "Time runs short as doom approaches", subjects: ["the Collapsing Dimension", "the Burning Kingdom", "the Sinking Continent", "the Crumbling Plot"] },
    { name: "Escort the Walking Disaster to", desc: "They attract trouble like a magnet attracts swords", subjects: ["the Capital City", "the Peace Summit", "their Own Wedding", "Anywhere Without Explosions"] },
    { name: "Keep the Oblivious Tourist Alive in", desc: "They keep trying to pet the monsters", subjects: ["the Death Zone", "the Cursed Forest", "Dragon Territory", "the Active Volcano Resort"] }
  ],
  special: [
    { name: "Enter the Grand Tournament of", desc: "Champions from across realms clash for glory", subjects: ["the Seven Kingdoms", "the Martial Heavens", "Ultimate Destiny", "Unnecessary Violence"] },
    { name: "Uncover the Mystery of the Cursed", desc: "Nothing is what it seems in this twisted place", subjects: ["Hot Spring", "Beach Episode", "Cooking Contest", "Class Reunion", "Filler Arc"] },
    { name: "Complete the Legendary Training under", desc: "Push beyond all known limits of power", subjects: ["the Hermit Master", "the Spirit of Battle", "the Mountain Sage", "a Montage Sequence"] },
    { name: "Break Through the Power Ceiling at", desc: "Shatter the boundaries that contain your potential", subjects: ["the Limit-Breaking Dojo", "the Gravity Chamber", "the Time Compression Zone", "the Arbitrary Level Cap"] },
    { name: "Attend the Festival of", desc: "Celebration masks darker machinations... or maybe it's just fun", subjects: ["a Thousand Masks", "the Blood Moon", "Eternal Night", "Suspiciously Cheap Ale"] },
    { name: "Survive the Unexpected Detour through", desc: "Not every adventure goes according to plan", subjects: ["the Pocket Dimension", "the Time Loop", "Someone Else's Backstory", "the Recap Episode"] },
    { name: "Resolve the Love Triangle at", desc: "Hearts are more dangerous than swords", subjects: ["the Royal Court", "the Academy", "the Battlefield", "the Awkward Hot Spring"] },
    { name: "Participate in the", desc: "An event that occurs once in a lifetime... every week", subjects: ["Celestial Alignment Ceremony", "Summoning of the Ancient Ones", "Ultimate Cook-Off of Destiny", "Annual Demon Lord Roast"] },
    { name: "Accidentally Start a Revolution in", desc: "All you did was ask one question", subjects: ["the Theocracy", "the Empire", "the Underworld", "the Adventurer's Guild", "a Small Bakery"] },
    { name: "Win the Bet Against", desc: "Pride and coin hang in the balance", subjects: ["the Dragon", "the Trickster God", "Death Itself", "the Narrator", "Your Future Self"] },
    { name: "Investigate Why All the NPCs in", desc: "Something is very wrong with these people", subjects: ["this Town Say the Same Thing", "this Dungeon Are Smiling", "this Kingdom Speak in Riddles", "this Village Won't Stop Dancing"] }
  ]
};

// Modifiers that scale with quest rank
const modifiersByRank: Record<number, { prefix: string[]; suffix: string[] }> = {
  1: { prefix: ["Introductory", "Basic", "Local", "Trivial"], suffix: ["for Beginners", "(Tutorial)", "- First Steps", "— Easy Peasy"] },
  2: { prefix: ["Standard", "Common", "Routine", "Mundane"], suffix: ["of the Region", "Request", "Assignment", "— Nothing Special"] },
  3: { prefix: ["Notable", "Unusual", "Curious", "Intriguing"], suffix: ["of Promise", "Challenge", "- Worth Noting", "— Eyebrow Raising"] },
  4: { prefix: ["Dangerous", "High-Stakes", "Risky", "Alarming"], suffix: ["of Consequence", "- Handle with Care", "Venture", "— Bring Potions"] },
  5: { prefix: ["Intense", "Demanding", "Elite", "Grueling"], suffix: ["of Renown", "Ordeal", "- No Retreat", "— Insurance Recommended"] },
  6: { prefix: ["Heroic", "Glorious", "Fabled", "Valiant"], suffix: ["of Legend", "Saga", "- For the Ages", "— Bards Will Sing"] },
  7: { prefix: ["Mythic", "Ancient", "Primordial", "Unfathomable"], suffix: ["of Myth", "Chronicle", "- Beyond Mortal", "— Gods Are Watching"] },
  8: { prefix: ["Divine", "Transcendent", "Sacred", "Celestial"], suffix: ["of the Gods", "Mandate", "- Heaven's Will", "— Reality Bends"] },
  9: { prefix: ["Apocalyptic", "World-Shaking", "Cataclysmic", "Reality-Ending"], suffix: ["of Annihilation", "- The End Times", "Reckoning", "— Last Chance"] },
  10: { prefix: ["Legendary", "Ultimate", "Fated", "Once-in-an-Era"], suffix: ["of Destiny", "- The Final Chapter", "Apotheosis", "— Or Die Trying"] }
};

// Context modifiers based on area/region
const areaContexts = [
  "amidst ancient ruins", "in the shadow of the mountain", "where ley lines converge",
  "beneath the blood moon", "during the convergence", "as prophecy unfolds",
  "while dimensions collide", "in defiance of fate", "under divine scrutiny",
  "where the map says 'here be dragons'", "at the worst possible time",
  "during someone else's quest", "where reality gets thin",
  "while the narrator isn't looking", "as the soundtrack intensifies"
];

export interface Quest {
  name: string;
  description: string;
  duration: number;
  expReward: number;
  goldReward: number;
  rank: QuestRank;
  areaName: string;
  regionName: string;
  type: string;
  fullTitle: string; // New: complete quest title with all modifiers
}

export const calculateQuestRank = (
  playerLevel: number,
  regionDangerLevel: number,
  areaDangerMod: number
): QuestRank => {
  // Base rank from level and danger
  const combinedDanger = regionDangerLevel + areaDangerMod;
  const levelBonus = Math.floor(playerLevel / 10);
  let baseRank = Math.floor(combinedDanger / 2) + levelBonus;
  
  // Add randomness (-1 to +2)
  const variance = Math.floor(Math.random() * 4) - 1;
  let finalRank = Math.max(1, Math.min(10, baseRank + variance));
  
  // Very rare chance (2%) for legendary quest regardless of level
  if (Math.random() < 0.02) {
    finalRank = 10;
  }
  // Small chance (5%) for one rank higher
  else if (Math.random() < 0.05) {
    finalRank = Math.min(10, finalRank + 1);
  }
  
  return questRanks[finalRank - 1];
};

export const generateQuest = (
  worldData: any, 
  level: number,
  travelState?: TravelState
): Quest => {
  // Get area info from travel state or use defaults
  const areaName = travelState?.currentArea?.name || worldData.terrain;
  const regionName = travelState?.currentRegion?.name || worldData.name;
  const regionDanger = travelState?.currentRegion?.dangerLevel || worldData.dangerLevel || 5;
  const areaDangerMod = travelState?.currentArea?.dangerModifier || 0;
  
  // Calculate quest rank
  const rank = calculateQuestRank(level, regionDanger, areaDangerMod);
  
  // Select quest type based on area features
  const questTypes = Object.keys(questTemplates) as (keyof typeof questTemplates)[];
  const questType = questTypes[Math.floor(Math.random() * questTypes.length)];
  const templates = questTemplates[questType];
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  // Get a random subject from the template
  const subject = template.subjects[Math.floor(Math.random() * template.subjects.length)];
  
  // Get modifier based on rank
  const modifiers = modifiersByRank[rank.rank];
  const prefix = modifiers.prefix[Math.floor(Math.random() * modifiers.prefix.length)];
  const suffix = modifiers.suffix[Math.floor(Math.random() * modifiers.suffix.length)];
  
  // Get area context for description
  const context = areaContexts[Math.floor(Math.random() * areaContexts.length)];
  
  // Duration scales with rank (higher rank = slightly longer)
  const baseDuration = 50 + Math.random() * 50;
  const durationMultiplier = 1 + (rank.rank - 1) * 0.1;
  
  // Calculate rewards with rank multipliers
  const baseExp = 25 + level * 10;
  const baseGold = 10 + level * 5;
  
  // Build the quest name
  const questName = template.name.includes("the ") || template.name.includes("the") 
    ? `${template.name} ${subject}`
    : `${template.name} ${subject}`;
  
  // Build full title with rank indicators
  const fullTitle = rank.rank >= 7 
    ? `【${prefix}】${questName} ${suffix}`
    : `${prefix} ${questName} ${suffix}`;
  
  return {
    name: questName,
    description: `${template.desc} ${context} in ${areaName} of ${regionName}`,
    duration: baseDuration * durationMultiplier,
    expReward: Math.floor(baseExp * rank.expMultiplier),
    goldReward: Math.floor(baseGold * rank.goldMultiplier),
    rank,
    areaName,
    regionName,
    type: questType,
    fullTitle
  };
};

export const getQuestRankDisplay = (rank: QuestRank): string => {
  return `[${rank.name}]`;
};

// Check if companion should be attracted based on quest rank and compatibility
// DEPRECATED: Use companionEncounterSystem instead for proper buildup
export const rollForCompanionAttraction = (
  questRank: QuestRank,
  compatibility: number,
  currentCompanions: number
): boolean => {
  // This function is now deprecated - companions should only come from special encounters
  // Keeping for backwards compatibility but always returns false
  return false;
};
