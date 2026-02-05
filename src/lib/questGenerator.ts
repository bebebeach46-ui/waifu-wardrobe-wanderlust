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
    { name: "Subjugate the Awakened Titan", desc: "A primordial beast stirs from eons of slumber", subjects: ["Titan", "Colossus", "Leviathan", "Behemoth"] },
    { name: "Shatter the Demon General's Vanguard", desc: "Elite forces march under a crimson banner", subjects: ["Demon General", "Dark Commander", "Fell Knight", "Shadow Marshal"] },
    { name: "Settle the Blood Oath with", desc: "Ancient grudges demand satisfaction", subjects: ["your Rival", "the Nemesis", "your Shadow", "the Mirror Self"] },
    { name: "Track the Apex Predator of", desc: "Hunters become the hunted in treacherous terrain", subjects: ["the Wilds", "the Abyss", "the Crimson Mire", "the Bone Valley"] },
    { name: "Break the Siege of the Monster Horde at", desc: "Countless fangs and claws descend upon civilization", subjects: ["the Last Bastion", "Fort Desperation", "the Burning Gate", "Hope's Edge"] },
    { name: "Survive the Gauntlet of", desc: "Champions fall one by one in this merciless trial", subjects: ["Seven Devils", "Twelve Trials", "Endless Nightmares", "the Undefeated"] },
    { name: "Answer the Challenge at", desc: "Honor demands you face destiny blade to blade", subjects: ["Crimson Dawn", "the Moonlit Arena", "the Precipice of Fate", "the Silent Duel Ground"] },
    { name: "Exterminate the Nest within", desc: "Corruption festers in the darkness below", subjects: ["the Hive", "the Brood Pit", "the Spawning Depths", "the Corruption Heart"] },
    { name: "Confront the Berserk", desc: "Madness has claimed a once-noble warrior", subjects: ["Champion", "Paladin", "War God", "Blade Saint"] },
    { name: "Hunt the", desc: "A legendary quarry demands legendary skill", subjects: ["White Stag of Prophecy", "Obsidian Wyrm", "Thunder Phoenix", "Void Serpent"] }
  ],
  exploration: [
    { name: "Breach the Sealed Labyrinth of", desc: "Ancient traps guard forgotten treasures", subjects: ["the Mad Architect", "the Eternal Maze", "Shifting Shadows", "a Thousand Doors"] },
    { name: "Chart the Impossible Geography of", desc: "Reality bends in this uncharted realm", subjects: ["the Fractured Lands", "the Inverted Mountain", "the Floating Isles", "the Void Between"] },
    { name: "Unearth the Lost Civilization beneath", desc: "History's greatest mystery awaits discovery", subjects: ["the Sands", "the Ice", "the Roots", "the Waves"] },
    { name: "Ascend the Forbidden Peak of", desc: "Where mortals were never meant to tread", subjects: ["Mount Calamity", "the Stormspire", "Heaven's Gate", "the Screaming Summit"] },
    { name: "Descend into the Abyss called", desc: "Light itself fears to enter", subjects: ["the Maw", "Eternity's Well", "the God's Grave", "the Bottomless Descent"] },
    { name: "Discover the Secret Passage through", desc: "Hidden paths known only to legends", subjects: ["the World's Spine", "the Shadow Veil", "the Mirror Realm", "the Forgotten Way"] },
    { name: "Pioneer the Trail to", desc: "Blaze a path where none have gone", subjects: ["the Edge of the World", "the Hidden Paradise", "the Last Frontier", "the Unknown Horizon"] },
    { name: "Explore the Anomaly within", desc: "Space and time twist in impossible ways", subjects: ["the Rift", "the Shattered Zone", "the Paradox Field", "the Unstable Realm"] }
  ],
  collection: [
    { name: "Gather the Scattered Orbs of", desc: "Cosmic power awaits those who collect them all", subjects: ["Divine Will", "Primordial Chaos", "the Star Dragon", "Infinite Wishes"] },
    { name: "Claim the Hoard of the Fallen", desc: "A dragon's lifetime of treasures lie unguarded", subjects: ["Dragon Emperor", "Treasure King", "Gold Tyrant", "Jewel Sovereign"] },
    { name: "Harvest the Essence of", desc: "Rare reagents bloom only in deadly places", subjects: ["Moonfire Blossoms", "Starfall Crystals", "Phoenix Tears", "Dragon Heartwood"] },
    { name: "Recover the Stolen Relic from", desc: "Sacred artifacts must return to their rightful place", subjects: ["the Shadow Syndicate", "the Heretic's Vault", "the Demon's Trophy Room", "the Void Pirates"] },
    { name: "Assemble the Fragments of", desc: "A shattered artifact yearns to be whole again", subjects: ["the God Blade", "the Crown of Ages", "the Reality Key", "the Primordial Core"] },
    { name: "Plunder the Sealed Treasury of", desc: "Riches beyond imagination lie behind ancient wards", subjects: ["the Dead Kingdom", "the Sunken Empire", "the Sky Citadel", "the Demon Lords"] },
    { name: "Seek the Seven", desc: "Collect them all before time runs out", subjects: ["Soul Gems", "Chaos Emeralds", "Pieces of Heaven", "Keys to the Abyss"] },
    { name: "Obtain the Legendary", desc: "Only the worthy may possess such power", subjects: ["Philosopher's Stone", "Cosmic Egg", "Wish Granter", "Heart of the World"] }
  ],
  escort: [
    { name: "Guide the Reluctant Heir through", desc: "They claim they don't need your help... but they do", subjects: ["the Assassination Gauntlet", "the Political Minefield", "their Awakening Journey", "the Trial of Succession"] },
    { name: "Safeguard the Merchant Prince's Expedition to", desc: "Untold wealth attracts untold dangers", subjects: ["the Silk Road's End", "the Spice Islands", "the Crystal Markets", "the Dragon Trade Route"] },
    { name: "Defend the Last Village against", desc: "These people have nowhere else to go", subjects: ["the Demon Tide", "the Corrupted Forest", "the Endless Winter", "the Plague of Shadows"] },
    { name: "Mount a Daring Rescue into", desc: "Someone precious waits in the heart of danger", subjects: ["the Demon Lord's Castle", "the Slave Pits", "the Mind Prison", "the Eternal Nightmare"] },
    { name: "Carry the Sealed Letter to", desc: "This message could change the fate of nations", subjects: ["the Hidden Emperor", "the Rebel Queen", "the Sleeping God", "the Last Alliance"] },
    { name: "Accompany the Runaway Noble to", desc: "They flee from a fate worse than death", subjects: ["Freedom's Shore", "the Sanctuary Beyond", "their True Love", "a New Beginning"] },
    { name: "Protect the Chosen One during", desc: "The prophecy demands they survive", subjects: ["the Awakening Ritual", "the Journey to the Sacred Land", "the Final Transformation", "their Darkest Hour"] },
    { name: "Evacuate the Survivors from", desc: "Time runs short as doom approaches", subjects: ["the Collapsing Dimension", "the Burning Kingdom", "the Sinking Continent", "the Zone of Annihilation"] }
  ],
  special: [
    { name: "Enter the Grand Tournament of", desc: "Champions from across realms clash for glory", subjects: ["the Seven Kingdoms", "the Martial Heavens", "Ultimate Destiny", "the God's Favor"] },
    { name: "Uncover the Mystery of the Cursed Beach at", desc: "Paradise hides deadly secrets beneath the waves", subjects: ["Siren's Cove", "the Phantom Shore", "Kraken Bay", "the Sunken Resort"] },
    { name: "Complete the Legendary Training under", desc: "Push beyond all known limits of power", subjects: ["the Hermit Master", "the Spirit of Battle", "the Mountain Sage", "the Eternal Warrior"] },
    { name: "Break Through the Power Ceiling at", desc: "Shatter the boundaries that contain your potential", subjects: ["the Limit-Breaking Dojo", "the Gravity Chamber", "the Time Compression Zone", "the Soul Forge"] },
    { name: "Seek the Mystical Hot Springs of", desc: "Ancient waters restore what time has taken", subjects: ["Eternal Youth", "Divine Restoration", "the Phoenix's Nest", "the Dragon's Blessing"] },
    { name: "Navigate the Chaos of the Festival of", desc: "Celebration masks darker machinations", subjects: ["a Thousand Masks", "the Blood Moon", "Eternal Night", "the Returning Dead"] },
    { name: "Survive the Unexpected Detour through", desc: "Not every adventure goes according to plan", subjects: ["the Pocket Dimension", "the Time Loop", "Someone Else's Story", "the Meta Realm"] },
    { name: "Participate in the", desc: "An event that occurs once in a lifetime", subjects: ["Celestial Alignment Ceremony", "Summoning of the Ancient Ones", "Clash of the Generations", "Ultimate Cook-Off of Destiny"] }
  ]
};

// Modifiers that scale with quest rank
const modifiersByRank: Record<number, { prefix: string[]; suffix: string[] }> = {
  1: { prefix: ["Introductory", "Basic", "Local"], suffix: ["for Beginners", "(Tutorial)", "- First Steps"] },
  2: { prefix: ["Standard", "Common", "Everyday"], suffix: ["of the Region", "Request", "Assignment"] },
  3: { prefix: ["Notable", "Unusual", "Rising"], suffix: ["of Promise", "Challenge", "- Worth Noting"] },
  4: { prefix: ["Dangerous", "High-Stakes", "Risky"], suffix: ["of Consequence", "- Handle with Care", "Venture"] },
  5: { prefix: ["Intense", "Demanding", "Elite"], suffix: ["of Renown", "Ordeal", "- No Retreat"] },
  6: { prefix: ["Heroic", "Glorious", "Fabled"], suffix: ["of Legend", "Saga", "- For the Ages"] },
  7: { prefix: ["Mythic", "Ancient", "Primordial"], suffix: ["of Myth", "Chronicle", "- Beyond Mortal"] },
  8: { prefix: ["Divine", "Transcendent", "Sacred"], suffix: ["of the Gods", "Mandate", "- Heaven's Will"] },
  9: { prefix: ["Apocalyptic", "World-Shaking", "Cataclysmic"], suffix: ["of Annihilation", "- The End Times", "Reckoning"] },
  10: { prefix: ["Legendary", "Ultimate", "Fated"], suffix: ["of Destiny", "- The Final Chapter", "Apotheosis"] }
};

// Context modifiers based on area/region
const areaContexts = [
  "amidst ancient ruins", "in the shadow of the mountain", "where ley lines converge",
  "beneath the blood moon", "during the convergence", "as prophecy unfolds",
  "while dimensions collide", "in defiance of fate", "under divine scrutiny"
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
