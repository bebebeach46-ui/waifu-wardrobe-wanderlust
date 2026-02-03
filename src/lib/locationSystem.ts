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

const terrainFeatures = [
  "Ancient Statues", "Glowing Crystals", "Mysterious Fog", "Wandering Spirits",
  "Monster Dens", "Hidden Treasures", "Magical Barriers", "Teleport Circles",
  "Healing Springs", "Cursed Ground", "Dragon Bones", "Demon Gates",
  "Fairy Rings", "Warp Zones", "Save Points", "Boss Arenas", "Secret Paths",
  "Trap Floors", "Moving Platforms", "Puzzle Locks", "NPC Camps", "Rest Areas"
];

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
