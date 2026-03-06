// Location/Terrain System - Procedural exploration with regions, areas, and travel

export interface Region {
  name: string;
  type: string;
  dangerLevel: number; // 1-10
  description: string;
  areas: Area[];
  discovered: number; // timestamp
}

export interface Area {
  name: string;
  type: string;
  terrain: string;
  features: string[];
  dangerModifier: number; // -2 to +3
  discovered: number;
}

export interface TravelState {
  currentRegion: Region;
  currentArea: Area;
  direction: string;
  distanceTraveled: number;
  areasExplored: number;
  questsInCurrentArea: number;
}

// Cardinal and special directions
const directions = [
  "North", "Northeast", "East", "Southeast", "South", "Southwest", "West", "Northwest",
  "Deeper", "Higher", "Inward", "Outward", "Downward", "Upward", "Beyond", "Through"
];

// Region types with anime/fantasy themes
const regionTypes = [
  "Kingdom", "Empire", "Wasteland", "Frontier", "Depths", "Heights", "Realm", 
  "Dominion", "Territory", "Zone", "Sector", "Province", "Domain", "Expanse"
];

const regionPrefixes = [
  "Crimson", "Azure", "Golden", "Shadow", "Cursed", "Blessed", "Ancient", "Forgotten",
  "Burning", "Frozen", "Sacred", "Demonic", "Celestial", "Void", "Crystal", "Storm",
  "Dragon's", "Demon Lord's", "Hero's", "Legendary", "Mythic", "Eternal", "Twilight"
];

const regionNames = [
  "Abyss", "Sanctuary", "Citadel", "Wastes", "Gardens", "Labyrinth", "Spire",
  "Catacombs", "Haven", "Stronghold", "Nexus", "Cradle", "Throne", "Grave",
  "Horizon", "Rift", "Gate", "Veil", "Core", "Edge", "Heart", "Crown"
];

// Area types with more variety
const areaTypes = [
  "Plains", "Forest", "Mountains", "Swamp", "Desert", "Tundra", "Jungle",
  "Caves", "Ruins", "Village", "Castle", "Dungeon", "Tower", "Bridge",
  "Lake", "River", "Coast", "Volcanic", "Canyon", "Valley", "Plateau"
];

const areaModifiers = [
  "Haunted", "Ancient", "Abandoned", "Thriving", "Cursed", "Blessed", "Hidden",
  "Burning", "Frozen", "Flooded", "Corrupted", "Sacred", "Dangerous", "Peaceful",
  "Mysterious", "Legendary", "Forbidden", "Secret", "Enchanted", "Ruined"
];

const areaNames = [
  "Hollow", "Grove", "Pass", "Crossing", "Falls", "Cavern", "Spire", "Gate",
  "Bridge", "Fort", "Camp", "Shrine", "Temple", "Tomb", "Arena", "Market",
  "Oasis", "Spring", "Peak", "Depths", "Clearing", "Outpost", "Bastion"
];

// Feature effect categories
export type FeatureEffectType = "danger" | "benefit" | "shortcut" | "neutral";

export interface TerrainFeatureData {
  name: string;
  icon: string;
  effectType: FeatureEffectType;
  description: string;
  // Mechanical effects
  dangerMod?: number;        // additional danger modifier (-3 to +3)
  expMultiplier?: number;    // 0.5 to 2.0
  goldMultiplier?: number;   // 0.5 to 2.0
  healPerTick?: number;      // hp healed per quest tick (negative = damage)
  questSpeedMod?: number;    // -0.3 to +0.5 (negative = faster quests)
  encounterRateMod?: number; // -0.5 to +1.0
}

const terrainFeaturesData: TerrainFeatureData[] = [
  // === DANGERS ===
  { name: "Monster Dens", icon: "🐉", effectType: "danger", description: "Swarms of creatures lurk here — encounter rate surges", dangerMod: 2, encounterRateMod: 0.6 },
  { name: "Cursed Ground", icon: "💀", effectType: "danger", description: "Dark energy saps vitality — periodic health drain", dangerMod: 1, healPerTick: -3 },
  { name: "Trap Floors", icon: "⚠️", effectType: "danger", description: "Hidden mechanisms deal damage and slow progress", dangerMod: 1, healPerTick: -2, questSpeedMod: 0.3 },
  { name: "Demon Gates", icon: "👹", effectType: "danger", description: "Portals leak demonic energy — enemies are empowered", dangerMod: 3, expMultiplier: 1.4 },
  { name: "Wandering Spirits", icon: "👻", effectType: "danger", description: "Restless dead confuse travelers — quests take longer", questSpeedMod: 0.4, dangerMod: 1 },
  { name: "Mysterious Fog", icon: "🌫️", effectType: "danger", description: "Thick mist hides ambushes — encounters increased", encounterRateMod: 0.8, dangerMod: 1 },
  { name: "Volcanic Vents", icon: "🌋", effectType: "danger", description: "Scorching geysers erupt — constant burn damage", healPerTick: -4, dangerMod: 2, expMultiplier: 1.3 },
  { name: "Corrupted Leyline", icon: "🟣", effectType: "danger", description: "Tainted magic warps reality — unpredictable danger", dangerMod: 2, goldMultiplier: 0.7 },
  
  // === BENEFITS ===
  { name: "Healing Springs", icon: "💧", effectType: "benefit", description: "Sacred waters restore the weary — passive healing", healPerTick: 5, dangerMod: -1 },
  { name: "Ancient Statues", icon: "🗿", effectType: "benefit", description: "Blessed monuments grant wisdom — bonus experience", expMultiplier: 1.5, dangerMod: -1 },
  { name: "Fairy Rings", icon: "🧚", effectType: "benefit", description: "Enchanted circles boost fortune — more gold drops", goldMultiplier: 1.6 },
  { name: "NPC Camps", icon: "🏕️", effectType: "benefit", description: "Friendly travelers share supplies — healing & safety", healPerTick: 3, dangerMod: -2 },
  { name: "Rest Areas", icon: "⛺", effectType: "benefit", description: "Safe havens for recovery — passive healing, reduced danger", healPerTick: 4, dangerMod: -2, encounterRateMod: -0.4 },
  { name: "Glowing Crystals", icon: "💎", effectType: "benefit", description: "Resonating crystals amplify power — shard & exp boost", expMultiplier: 1.3 },
  { name: "Sacred Ground", icon: "✝️", effectType: "benefit", description: "Holy terrain repels evil — fewer encounters, more gold", encounterRateMod: -0.3, goldMultiplier: 1.3, dangerMod: -1 },
  
  // === SHORTCUTS ===
  { name: "Teleport Circles", icon: "🌀", effectType: "shortcut", description: "Arcane portals accelerate travel — quests complete faster", questSpeedMod: -0.3 },
  { name: "Secret Paths", icon: "🗝️", effectType: "shortcut", description: "Hidden routes bypass obstacles — faster quest completion", questSpeedMod: -0.25, encounterRateMod: -0.3 },
  { name: "Warp Zones", icon: "🚀", effectType: "shortcut", description: "Dimensional shortcuts — drastically faster quests", questSpeedMod: -0.4 },
  { name: "Hidden Treasures", icon: "💰", effectType: "shortcut", description: "Buried riches lie just below the surface — massive gold bonus", goldMultiplier: 2.0 },
  { name: "Dragon Bones", icon: "🦴", effectType: "shortcut", description: "Ancient dragon remains radiate power — massive exp boost", expMultiplier: 1.8 },
  
  // === NEUTRAL (flavor with minor effects) ===
  { name: "Magical Barriers", icon: "🛡️", effectType: "neutral", description: "Shimmering walls of force — mildly protective", dangerMod: -1 },
  { name: "Puzzle Locks", icon: "🧩", effectType: "neutral", description: "Mysterious mechanisms guard this area — slower but rewarding", questSpeedMod: 0.15, expMultiplier: 1.2 },
  { name: "Boss Arenas", icon: "⚔️", effectType: "neutral", description: "Marked battlegrounds — high risk, high reward", dangerMod: 2, expMultiplier: 1.5, goldMultiplier: 1.5 },
  { name: "Moving Platforms", icon: "🔄", effectType: "neutral", description: "Unstable terrain shifts underfoot — minor slowdown", questSpeedMod: 0.1 },
];

// Keep backward compat: string[] for Area.features but also export lookup
const terrainFeatures = terrainFeaturesData.map(f => f.name);

export const getFeatureData = (featureName: string): TerrainFeatureData | undefined => {
  return terrainFeaturesData.find(f => f.name === featureName);
};

export const getAreaEffects = (features: string[]): {
  totalDangerMod: number;
  expMultiplier: number;
  goldMultiplier: number;
  healPerTick: number;
  questSpeedMod: number;
  encounterRateMod: number;
} => {
  let totalDangerMod = 0;
  let expMult = 1;
  let goldMult = 1;
  let heal = 0;
  let questSpeed = 0;
  let encounterRate = 0;

  for (const name of features) {
    const data = getFeatureData(name);
    if (!data) continue;
    totalDangerMod += data.dangerMod || 0;
    if (data.expMultiplier) expMult *= data.expMultiplier;
    if (data.goldMultiplier) goldMult *= data.goldMultiplier;
    heal += data.healPerTick || 0;
    questSpeed += data.questSpeedMod || 0;
    encounterRate += data.encounterRateMod || 0;
  }

  return { totalDangerMod, expMultiplier: expMult, goldMultiplier: goldMult, healPerTick: heal, questSpeedMod: questSpeed, encounterRateMod: encounterRate };
};

export const getFeatureEffectColor = (effectType: FeatureEffectType): string => {
  switch (effectType) {
    case "danger": return "text-destructive";
    case "benefit": return "text-green-400";
    case "shortcut": return "text-primary";
    case "neutral": return "text-muted-foreground";
  }
};

export const getFeatureEffectBg = (effectType: FeatureEffectType): string => {
  switch (effectType) {
    case "danger": return "bg-destructive/15 border-destructive/30";
    case "benefit": return "bg-green-400/15 border-green-400/30";
    case "shortcut": return "bg-primary/15 border-primary/30";
    case "neutral": return "bg-muted/50 border-border";
  }
};

export const generateRegion = (worldData: any, playerLevel: number): Region => {
  const prefix = regionPrefixes[Math.floor(Math.random() * regionPrefixes.length)];
  const name = regionNames[Math.floor(Math.random() * regionNames.length)];
  const type = regionTypes[Math.floor(Math.random() * regionTypes.length)];
  
  // Danger level scales with player level but has variance
  const baseDanger = Math.min(10, Math.max(1, Math.floor(playerLevel / 5) + 1));
  const dangerVariance = Math.floor(Math.random() * 3) - 1;
  const dangerLevel = Math.min(10, Math.max(1, baseDanger + dangerVariance));
  
  const descriptions = [
    `A ${type.toLowerCase()} shrouded in mystery and danger`,
    `Legends speak of untold treasures in this ${type.toLowerCase()}`,
    `Few adventurers return from the ${prefix} ${name}`,
    `The ${type.toLowerCase()} where heroes are forged`,
    `An ancient ${type.toLowerCase()} awakened by darkness`,
    `The final frontier for those seeking glory`
  ];
  
  return {
    name: `${prefix} ${name}`,
    type,
    dangerLevel,
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    areas: [generateArea(dangerLevel)],
    discovered: Date.now()
  };
};

export const generateArea = (regionDangerLevel: number): Area => {
  const modifier = areaModifiers[Math.floor(Math.random() * areaModifiers.length)];
  const name = areaNames[Math.floor(Math.random() * areaNames.length)];
  const type = areaTypes[Math.floor(Math.random() * areaTypes.length)];
  
  // Generate 1-3 features
  const numFeatures = 1 + Math.floor(Math.random() * 3);
  const features: string[] = [];
  const shuffledFeatures = [...terrainFeatures].sort(() => Math.random() - 0.5);
  for (let i = 0; i < numFeatures; i++) {
    features.push(shuffledFeatures[i]);
  }
  
  // Danger modifier based on area type
  const dangerModifiers: Record<string, number> = {
    "Plains": -1, "Village": -2, "Castle": 1, "Dungeon": 2, "Tower": 1,
    "Ruins": 1, "Caves": 0, "Volcanic": 2, "Swamp": 1, "Tundra": 1
  };
  const dangerMod = dangerModifiers[type] || 0;
  
  return {
    name: `${modifier} ${name}`,
    type,
    terrain: `${modifier} ${type}`,
    features,
    dangerModifier: dangerMod,
    discovered: Date.now()
  };
};

export const initializeTravelState = (worldData: any, playerLevel: number): TravelState => {
  const region = generateRegion(worldData, playerLevel);
  return {
    currentRegion: region,
    currentArea: region.areas[0],
    direction: directions[Math.floor(Math.random() * directions.length)],
    distanceTraveled: 0,
    areasExplored: 1,
    questsInCurrentArea: 0
  };
};

export const shouldChangeArea = (questsInCurrentArea: number): boolean => {
  // Change area every 3-5 quests
  return questsInCurrentArea >= 3 + Math.floor(Math.random() * 3);
};

export const shouldChangeRegion = (areasExplored: number): boolean => {
  // Change region every 4-6 areas
  return areasExplored >= 4 + Math.floor(Math.random() * 3);
};

export const travelToNewArea = (
  state: TravelState, 
  worldData: any, 
  playerLevel: number
): TravelState => {
  // Check if we should enter a new region
  if (shouldChangeRegion(state.areasExplored)) {
    const newRegion = generateRegion(worldData, playerLevel);
    return {
      currentRegion: newRegion,
      currentArea: newRegion.areas[0],
      direction: directions[Math.floor(Math.random() * directions.length)],
      distanceTraveled: state.distanceTraveled + 10,
      areasExplored: 1,
      questsInCurrentArea: 0
    };
  }
  
  // Generate new area in current region
  const newArea = generateArea(state.currentRegion.dangerLevel);
  const newDirection = directions[Math.floor(Math.random() * directions.length)];
  
  return {
    ...state,
    currentArea: newArea,
    currentRegion: {
      ...state.currentRegion,
      areas: [...state.currentRegion.areas, newArea]
    },
    direction: newDirection,
    distanceTraveled: state.distanceTraveled + 1,
    areasExplored: state.areasExplored + 1,
    questsInCurrentArea: 0
  };
};

export const getDirectionIcon = (direction: string): string => {
  const icons: Record<string, string> = {
    "North": "⬆️", "Northeast": "↗️", "East": "➡️", "Southeast": "↘️",
    "South": "⬇️", "Southwest": "↙️", "West": "⬅️", "Northwest": "↖️",
    "Deeper": "🕳️", "Higher": "⛰️", "Inward": "🌀", "Outward": "💫",
    "Downward": "⏬", "Upward": "⏫", "Beyond": "✨", "Through": "🚪"
  };
  return icons[direction] || "🧭";
};

export const getRegionDangerColor = (dangerLevel: number): string => {
  if (dangerLevel <= 2) return "text-green-400";
  if (dangerLevel <= 4) return "text-yellow-400";
  if (dangerLevel <= 6) return "text-orange-400";
  if (dangerLevel <= 8) return "text-red-400";
  return "text-purple-400";
};

// Map overlay data generation
export interface MapTile {
  x: number;
  y: number;
  type: string;
  explored: boolean;
  current: boolean;
  hasQuest: boolean;
  dangerLevel: number;
}

export const generateMapOverlay = (state: TravelState): MapTile[][] => {
  const size = 5; // 5x5 grid
  const centerX = 2;
  const centerY = 2;
  
  const map: MapTile[][] = [];
  
  for (let y = 0; y < size; y++) {
    const row: MapTile[] = [];
    for (let x = 0; x < size; x++) {
      const isCurrent = x === centerX && y === centerY;
      const distance = Math.abs(x - centerX) + Math.abs(y - centerY);
      const explored = distance <= state.areasExplored % 5;
      
      row.push({
        x,
        y,
        type: isCurrent ? state.currentArea.type : 
              explored ? areaTypes[Math.floor(Math.random() * areaTypes.length)] : "???",
        explored,
        current: isCurrent,
        hasQuest: isCurrent,
        dangerLevel: isCurrent ? 
          state.currentRegion.dangerLevel + state.currentArea.dangerModifier :
          Math.floor(Math.random() * 10) + 1
      });
    }
    map.push(row);
  }
  
  return map;
};

export const getMapTileIcon = (tile: MapTile): string => {
  if (!tile.explored) return "❓";
  if (tile.current) return "📍";
  
  const icons: Record<string, string> = {
    "Plains": "🌾", "Forest": "🌲", "Mountains": "⛰️", "Swamp": "🌿",
    "Desert": "🏜️", "Tundra": "❄️", "Jungle": "🌴", "Caves": "🕳️",
    "Ruins": "🏚️", "Village": "🏘️", "Castle": "🏰", "Dungeon": "⚔️",
    "Tower": "🗼", "Bridge": "🌉", "Lake": "🌊", "River": "💧",
    "Coast": "🏖️", "Volcanic": "🌋", "Canyon": "🏜️", "Valley": "🏞️",
    "Plateau": "🗻"
  };
  
  return icons[tile.type] || "🔲";
};
