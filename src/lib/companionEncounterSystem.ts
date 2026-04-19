 import { Quest, QuestRank } from "./questGenerator";
 
 // Preferences that can be accumulated through quests
 export const encounterPreferences = [
   "Flowers", "Sweets", "Books", "Weapons", "Jewelry", "Rare Items", "Food",
   "Music", "Art", "Combat", "Magic Scrolls", "Potions", "Artifacts", "Pets",
   "Master Fishermen", "Expert Smiths", "Legendary Alchemists", "Fashion Icons"
 ] as const;
 
 export type EncounterPreference = typeof encounterPreferences[number];
 
 // Quest types that build specific preferences
 const questTypeToPreferences: Record<string, EncounterPreference[]> = {
   combat: ["Combat", "Weapons", "Artifacts"],
   exploration: ["Rare Items", "Artifacts", "Books"],
   collection: ["Flowers", "Jewelry", "Potions", "Magic Scrolls"],
   escort: ["Food", "Sweets", "Pets"],
   special: ["Music", "Art", "Fashion Icons"]
 };
 
 // Special keywords in quest names that boost preferences
 const keywordPreferenceMap: Record<string, EncounterPreference[]> = {
   "dragon": ["Combat", "Artifacts", "Rare Items"],
   "beast": ["Combat", "Pets"],
   "treasure": ["Jewelry", "Rare Items", "Artifacts"],
   "ancient": ["Books", "Artifacts", "Magic Scrolls"],
   "herb": ["Flowers", "Potions"],
   "cook": ["Food", "Sweets"],
   "festival": ["Music", "Art", "Sweets"],
   "forge": ["Weapons", "Expert Smiths"],
   "library": ["Books", "Magic Scrolls"],
   "garden": ["Flowers", "Pets"],
   "alchemist": ["Potions", "Legendary Alchemists"],
   "fish": ["Food", "Master Fishermen"],
   "craft": ["Expert Smiths", "Art"],
   "fashion": ["Fashion Icons", "Jewelry"],
   "art": ["Art", "Music"],
   "scroll": ["Magic Scrolls", "Books"],
   "ritual": ["Artifacts", "Magic Scrolls"],
   "hunt": ["Combat", "Pets", "Food"]
 };
 
 export interface PreferenceAffinity {
   [key: string]: number;
 }
 
 export interface SpecialEncounter {
   id: string;
   name: string;
   description: string;
   requiredPreference: EncounterPreference;
   affinityThreshold: number;
   triggered: boolean;
   triggeredAt?: number;
   questsCompleted: number;
 }
 
 export interface CompanionEncounterState {
   affinity: PreferenceAffinity;
   questsSinceLastCompanion: number;
   totalQuestsCompleted: number;
   activeEncounter: SpecialEncounter | null;
   encounterHistory: SpecialEncounter[];
   encounterProgress: number; // 0-100 for current encounter
 }
 
 // Encounter templates based on preferences
 const encounterTemplates: Record<EncounterPreference, { names: string[]; descriptions: string[] }> = {
   "Flowers": {
     names: ["The Moonlit Garden", "Petals of Destiny", "The Eternal Bloom"],
     descriptions: ["A mysterious figure tends rare flowers under starlight", "Someone left a trail of petals leading to a hidden grove", "The legendary flower collector seeks a kindred spirit"]
   },
   "Sweets": {
     names: ["The Midnight Patisserie", "Sugar's Sweet Promise", "The Confectioner's Heart"],
     descriptions: ["A traveling sweet maker offers their finest creation", "The aroma of rare desserts draws you to a hidden shop", "A culinary competition reveals an unexpected ally"]
   },
   "Books": {
     names: ["The Forbidden Library", "Whispers of the Tome", "The Scholar's Sanctuary"],
     descriptions: ["A fellow seeker of knowledge shares forbidden texts", "An ancient library reveals itself only to the worthy", "A bookworm adventurer seeks a reading companion"]
   },
   "Weapons": {
     names: ["The Blade's Echo", "Trial of Steel", "The Armorer's Legacy"],
     descriptions: ["A master weaponsmith tests your appreciation of arms", "An ancient weapon calls out to a worthy wielder", "The legendary forge accepts visitors for the first time"]
   },
   "Jewelry": {
     names: ["Gems of the Abyss", "The Crown's Keeper", "Sparkle of Fate"],
     descriptions: ["A gemcutter reveals stones that resonate with souls", "The guardian of ancient treasures extends an invitation", "A jewelry thief with a heart of gold seeks redemption"]
   },
   "Rare Items": {
     names: ["The Collector's Den", "Treasures Untold", "The Merchant of Wonders"],
     descriptions: ["A mysterious collector notices your discerning eye", "The rarest treasures in the realm converge at your feet", "A fellow treasure hunter proposes an alliance"]
   },
   "Food": {
     names: ["The Wandering Feast", "Flavors of the Journey", "The Last Supper Inn"],
     descriptions: ["A traveling chef invites you to taste the world", "The aroma of home cooking leads to an unexpected meeting", "A legendary inn opens its doors for a single night"]
   },
   "Music": {
     names: ["Symphony of Souls", "The Bard's Final Song", "Melody of the Heart"],
     descriptions: ["A haunting melody draws you to a lone musician", "The greatest concert in history seeks its final audience member", "A silent performer speaks through their music"]
   },
   "Art": {
     names: ["Canvas of Dreams", "The Gallery Eternal", "Strokes of Destiny"],
     descriptions: ["An artist captures your essence in their masterwork", "Living paintings tell stories of those who appreciate beauty", "A gallery of impossible art reveals its curator"]
   },
   "Combat": {
     names: ["The Arena of Legends", "Blood and Honor", "The Warrior's Crucible"],
     descriptions: ["A fellow warrior seeks a worthy sparring partner", "The tournament of champions awaits its final contestants", "A battle-scarred veteran offers to share their secrets"]
   },
   "Magic Scrolls": {
     names: ["Whispers of the Arcane", "The Scroll Keeper's Trial", "Secrets of the Magi"],
     descriptions: ["Ancient scrolls unfurl before a worthy student", "The guardian of magical knowledge tests your dedication", "A reclusive mage seeks an apprentice with true passion"]
   },
   "Potions": {
     names: ["The Bubbling Cauldron", "Elixir of Connection", "The Alchemist's Heart"],
     descriptions: ["A potion master's experiment requires a brave soul", "The perfect brew can only be made by two", "An alchemist's dying wish draws you to their tower"]
   },
   "Artifacts": {
     names: ["Echoes of the Ancients", "The Relic's Call", "Guardians of History"],
     descriptions: ["An ancient artifact resonates with your presence", "The keeper of relics senses a worthy successor", "History itself reaches out through forgotten treasures"]
   },
   "Pets": {
     names: ["The Beast Tamer's Bond", "Creatures of the Heart", "The Sanctuary's Secret"],
     descriptions: ["A mysterious creature chooses you as its companion", "The legendary beast sanctuary opens for those who understand", "A fellow animal lover recognizes a kindred spirit"]
   },
   "Master Fishermen": {
     names: ["The Legendary Catch", "Tides of Destiny", "The Fisher's Horizon"],
     descriptions: ["A fishing tournament reveals an unexpected competitor", "The sea whispers tales of the one who got away", "A master angler seeks their final apprentice"]
   },
   "Expert Smiths": {
     names: ["The Forge's Flame", "Hammer and Heart", "Legacy of Steel"],
     descriptions: ["The sound of hammering leads to a master's forge", "An ancient anvil awaits one who understands its purpose", "A wandering smith seeks a partner for their final masterwork"]
   },
   "Legendary Alchemists": {
     names: ["The Philosopher's Path", "Elements of Fate", "The Grand Transmutation"],
     descriptions: ["An alchemist's tower appears only to the worthy", "The formula for the impossible requires two minds", "A legendary elixir's creation draws kindred spirits together"]
   },
   "Fashion Icons": {
     names: ["The Runway of Dreams", "Threads of Destiny", "The Designer's Muse"],
     descriptions: ["A fashion event reveals an unexpected kindred spirit", "The legendary designer seeks their ultimate inspiration", "Style and substance collide in a fateful encounter"]
   }
 };
 
 // Initialize fresh encounter state
 export const initializeEncounterState = (): CompanionEncounterState => {
   const affinity: PreferenceAffinity = {};
   encounterPreferences.forEach(pref => {
     affinity[pref] = 0;
   });
   
   return {
     affinity,
     questsSinceLastCompanion: 0,
     totalQuestsCompleted: 0,
     activeEncounter: null,
     encounterHistory: [],
     encounterProgress: 0
   };
 };
 
 // Calculate affinity gains from a completed quest
 export const calculateAffinityGains = (quest: Quest): PreferenceAffinity => {
   const gains: PreferenceAffinity = {};
   
   // Base gains from quest type
   const typePrefs = questTypeToPreferences[quest.type] || [];
   typePrefs.forEach(pref => {
     gains[pref] = (gains[pref] || 0) + 1 + (quest.rank.rank * 0.2);
   });
   
   // Bonus gains from quest name keywords
   const questNameLower = quest.name.toLowerCase();
   Object.entries(keywordPreferenceMap).forEach(([keyword, prefs]) => {
     if (questNameLower.includes(keyword)) {
       prefs.forEach(pref => {
         gains[pref] = (gains[pref] || 0) + 0.5 + (quest.rank.rank * 0.1);
       });
     }
   });
   
   // Higher rank quests give more affinity
   Object.keys(gains).forEach(key => {
     gains[key] *= (1 + (quest.rank.rank - 1) * 0.1);
   });
   
   return gains;
 };
 
// Update encounter state after completing a quest
export const updateEncounterState = (
  state: CompanionEncounterState,
  quest: Quest,
  currentCompanionCount: number,
  options?: { activeFull?: boolean; reserveFull?: boolean }
): CompanionEncounterState => {
  const newState = { ...state };
  newState.questsSinceLastCompanion++;
  newState.totalQuestsCompleted++;
  
  // Calculate and apply affinity gains
  const gains = calculateAffinityGains(quest);
  Object.entries(gains).forEach(([pref, amount]) => {
    newState.affinity[pref] = (newState.affinity[pref] || 0) + amount;
  });
  
  // Don't trigger new encounters if both active and reserve pools are full
  const reserveFull = options?.reserveFull ?? false;
  const activeFull = options?.activeFull ?? false;
  
  // Check if we should trigger a special encounter
  if (!newState.activeEncounter && !reserveFull) {
    // When active is full, encounters are 75% rarer (overflow goes to reserve)
    const rateModifier = activeFull ? 0.25 : 1.0;
    const encounter = checkForSpecialEncounter(newState, rateModifier);
    if (encounter) {
      newState.activeEncounter = encounter;
      newState.encounterProgress = 0;
    }
  }
  
  // Progress active encounter
  if (newState.activeEncounter) {
    // Encounter takes 3-5 quests to complete
    newState.encounterProgress += 20 + Math.random() * 15;
  }
  
  return newState;
};
 
 // Check if conditions are met for a special encounter
 const checkForSpecialEncounter = (state: CompanionEncounterState): SpecialEncounter | null => {
   // Minimum 15 quests between companions
   if (state.questsSinceLastCompanion < 15) return null;
   
   // Find the highest affinity preference that meets threshold
   const sortedAffinities = Object.entries(state.affinity)
     .filter(([_, value]) => value >= 25) // Minimum threshold
     .sort(([, a], [, b]) => b - a);
   
   if (sortedAffinities.length === 0) return null;
   
   // 20% base chance, increases with affinity and quests since last companion
   const questBonus = Math.min((state.questsSinceLastCompanion - 15) * 0.02, 0.3);
   const affinityBonus = Math.min(sortedAffinities[0][1] / 200, 0.2);
   const encounterChance = 0.2 + questBonus + affinityBonus;
   
   if (Math.random() > encounterChance) return null;
   
   const preference = sortedAffinities[0][0] as EncounterPreference;
   return generateSpecialEncounter(preference, state.totalQuestsCompleted);
 };
 
 // Generate a special encounter for a preference
 export const generateSpecialEncounter = (
   preference: EncounterPreference,
   questsCompleted: number
 ): SpecialEncounter => {
   const template = encounterTemplates[preference];
   const nameIdx = Math.floor(Math.random() * template.names.length);
   const descIdx = Math.floor(Math.random() * template.descriptions.length);
   
   return {
     id: `encounter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
     name: template.names[nameIdx],
     description: template.descriptions[descIdx],
     requiredPreference: preference,
     affinityThreshold: 25,
     triggered: false,
     questsCompleted
   };
 };
 
 // Complete an encounter and attract a companion
 export const completeEncounter = (
   state: CompanionEncounterState
 ): { newState: CompanionEncounterState; shouldAttractCompanion: boolean; preference: EncounterPreference | null } => {
   if (!state.activeEncounter || state.encounterProgress < 100) {
     return { newState: state, shouldAttractCompanion: false, preference: null };
   }
   
   const completedEncounter = {
     ...state.activeEncounter,
     triggered: true,
     triggeredAt: Date.now()
   };
   
   const preference = completedEncounter.requiredPreference;
   
   // Reset affinity for this preference (spent on companion)
   const newAffinity = { ...state.affinity };
   newAffinity[preference] = Math.max(0, newAffinity[preference] - 30);
   
   return {
     newState: {
       ...state,
       affinity: newAffinity,
       questsSinceLastCompanion: 0,
       activeEncounter: null,
       encounterHistory: [...state.encounterHistory, completedEncounter],
       encounterProgress: 0
     },
     shouldAttractCompanion: true,
     preference
   };
 };
 
 // Get top affinities for display
 export const getTopAffinities = (affinity: PreferenceAffinity, count: number = 3): { preference: string; value: number }[] => {
   return Object.entries(affinity)
     .map(([preference, value]) => ({ preference, value }))
     .sort((a, b) => b.value - a.value)
     .slice(0, count);
 };