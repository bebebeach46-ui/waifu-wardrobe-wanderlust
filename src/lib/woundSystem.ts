// Wound System - Severity 1-10 integrated with critical hits
// Inspired by roguelikes like DCSS and ToME4

export type BodyPart = 
  | "head" | "neck" | "torso" | "chest" | "abdomen"
  | "left_arm" | "right_arm" | "left_hand" | "right_hand"
  | "left_leg" | "right_leg" | "left_foot" | "right_foot"
  | "tail" | "wings" | "horns";

export type WoundSeverity = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface Wound {
  id: string;
  bodyPart: BodyPart;
  severity: WoundSeverity;
  type: WoundType;
  name: string;
  description: string;
  bleedingRate: number; // HP loss per tick (0-10)
  painLevel: number; // Affects combat effectiveness
  healingTime: number; // Ticks to heal naturally
  isFatal: boolean;
  inflictedBy?: string;
  inflictedAt: number;
  isHealed: boolean;
}

export type WoundType = 
  | "slash" | "pierce" | "blunt" | "burn" | "frost" 
  | "acid" | "lightning" | "necrotic" | "poison" | "psychic";

// Wound severity descriptions by level
const severityDescriptions: Record<WoundSeverity, { name: string; prefix: string }> = {
  1: { name: "Graze", prefix: "barely" },
  2: { name: "Scratch", prefix: "lightly" },
  3: { name: "Cut", prefix: "moderately" },
  4: { name: "Gash", prefix: "deeply" },
  5: { name: "Laceration", prefix: "severely" },
  6: { name: "Wound", prefix: "critically" },
  7: { name: "Trauma", prefix: "grievously" },
  8: { name: "Maiming", prefix: "horrifically" },
  9: { name: "Mutilation", prefix: "catastrophically" },
  10: { name: "Severing", prefix: "completely" }
};

// Body part specific wound templates
const woundTemplates: Record<BodyPart, Record<WoundType, string[]>> = {
  head: {
    slash: ["sliced across the forehead", "cut across the scalp", "gashed across the face", "cleaved through the skull"],
    pierce: ["pierced through the eye", "punctured the temple", "stabbed through the jaw", "impaled through the head"],
    blunt: ["cracked skull", "concussed", "jaw shattered", "brain hemorrhage"],
    burn: ["face scorched", "scalp burned", "eyes seared", "head immolated"],
    frost: ["face frostbitten", "ears frozen", "nose blackened", "brain frozen"],
    acid: ["face melted", "scalp dissolved", "eyes corroded", "skull exposed"],
    lightning: ["hair ignited", "brain fried", "face charred", "skull electrified"],
    necrotic: ["flesh rotting", "skin decaying", "face withering", "skull exposed"],
    poison: ["face discolored", "veins blackened", "eyes clouded", "foam at mouth"],
    psychic: ["mind shattered", "sanity fractured", "psyche broken", "brain liquefied"]
  },
  neck: {
    slash: ["throat slashed", "neck sliced", "carotid severed", "decapitated"],
    pierce: ["throat pierced", "neck punctured", "jugular torn", "spine severed"],
    blunt: ["neck bruised", "windpipe crushed", "vertebrae cracked", "neck broken"],
    burn: ["neck scorched", "throat burned", "neck charred", "head severed by flame"],
    frost: ["neck frozen", "throat iced", "neck shattered", "frozen clean through"],
    acid: ["neck corroded", "throat dissolved", "neck melted", "head severed by acid"],
    lightning: ["neck shocked", "throat burned", "spine fried", "head severed by bolt"],
    necrotic: ["neck withering", "throat rotting", "neck decaying", "head falling off"],
    poison: ["neck swelling", "throat closing", "veins bursting", "neck rupturing"],
    psychic: ["phantom pain", "nerve damage", "paralysis", "total disconnection"]
  },
  torso: {
    slash: ["slashed across chest", "abdomen cut", "ribs exposed", "disemboweled"],
    pierce: ["chest punctured", "lung pierced", "heart impaled", "run through"],
    blunt: ["ribs bruised", "sternum cracked", "internal bleeding", "organs ruptured"],
    burn: ["chest scorched", "torso charred", "organs cooked", "incinerated"],
    frost: ["torso frozen", "organs iced", "blood frozen", "shattered from cold"],
    acid: ["skin dissolving", "flesh melting", "organs exposed", "eaten away"],
    lightning: ["heart shocked", "organs fried", "exploded from within", "electrocuted"],
    necrotic: ["flesh rotting", "organs decaying", "body withering", "crumbling to dust"],
    poison: ["veins blackening", "organs failing", "blood curdling", "toxic shock"],
    psychic: ["phantom agony", "soul tearing", "life draining", "existence ending"]
  },
  chest: {
    slash: ["chest slashed", "pectorals cut", "ribs exposed", "heart exposed"],
    pierce: ["chest pierced", "lung punctured", "heart stabbed", "impaled through chest"],
    blunt: ["sternum bruised", "ribs fractured", "heart stopped", "chest caved in"],
    burn: ["chest burned", "lungs scorched", "heart seared", "chest immolated"],
    frost: ["chest frozen", "lungs iced", "heart frozen", "shattered ribcage"],
    acid: ["chest corroded", "ribs exposed", "heart dissolving", "melted through"],
    lightning: ["heart shocked", "lungs fried", "cardiac arrest", "chest exploded"],
    necrotic: ["chest decaying", "ribs rotting", "heart stopping", "crumbling away"],
    poison: ["chest tightening", "lungs failing", "heart seizing", "total organ failure"],
    psychic: ["heartache manifest", "chest crushing", "soul torn", "existence unraveling"]
  },
  abdomen: {
    slash: ["gut slashed", "intestines nicked", "abdomen opened", "disemboweled"],
    pierce: ["stomach punctured", "intestines pierced", "liver impaled", "run through"],
    blunt: ["gut bruised", "organs damaged", "internal rupture", "organs pulverized"],
    burn: ["belly burned", "intestines cooked", "organs boiled", "eviscerated by flame"],
    frost: ["abdomen frozen", "organs iced", "gut shattered", "frozen solid"],
    acid: ["stomach corroded", "intestines dissolving", "organs melting", "eaten from within"],
    lightning: ["gut shocked", "organs fried", "stomach burst", "exploded"],
    necrotic: ["belly rotting", "intestines decaying", "organs liquefying", "crumbling"],
    poison: ["gut swelling", "organs failing", "toxic buildup", "rupturing from poison"],
    psychic: ["gut-wrenching pain", "phantom evisceration", "soul rending", "ceased to exist"]
  },
  left_arm: {
    slash: ["arm slashed", "bicep cut", "arm gashed", "arm severed"],
    pierce: ["arm pierced", "forearm punctured", "elbow shattered", "arm impaled"],
    blunt: ["arm bruised", "bone fractured", "arm broken", "arm pulverized"],
    burn: ["arm scorched", "skin charred", "muscle cooked", "arm incinerated"],
    frost: ["arm frozen", "fingers blackened", "arm shattered", "arm crumbled"],
    acid: ["arm corroded", "skin melting", "bone exposed", "arm dissolved"],
    lightning: ["arm shocked", "nerves fried", "arm charred", "arm exploded"],
    necrotic: ["arm withering", "flesh rotting", "arm falling off", "arm crumbled"],
    poison: ["arm swelling", "veins blackening", "tissue dying", "arm unusable"],
    psychic: ["phantom limb pain", "arm numb", "motor control lost", "arm disconnected"]
  },
  right_arm: {
    slash: ["arm slashed", "bicep cut", "arm gashed", "arm severed"],
    pierce: ["arm pierced", "forearm punctured", "elbow shattered", "arm impaled"],
    blunt: ["arm bruised", "bone fractured", "arm broken", "arm pulverized"],
    burn: ["arm scorched", "skin charred", "muscle cooked", "arm incinerated"],
    frost: ["arm frozen", "fingers blackened", "arm shattered", "arm crumbled"],
    acid: ["arm corroded", "skin melting", "bone exposed", "arm dissolved"],
    lightning: ["arm shocked", "nerves fried", "arm charred", "arm exploded"],
    necrotic: ["arm withering", "flesh rotting", "arm falling off", "arm crumbled"],
    poison: ["arm swelling", "veins blackening", "tissue dying", "arm unusable"],
    psychic: ["phantom limb pain", "arm numb", "motor control lost", "arm disconnected"]
  },
  left_hand: {
    slash: ["hand cut", "fingers sliced", "palm gashed", "hand severed"],
    pierce: ["hand pierced", "palm punctured", "fingers impaled", "hand pinned"],
    blunt: ["hand bruised", "fingers broken", "bones crushed", "hand pulverized"],
    burn: ["hand burned", "fingers charred", "palm seared", "hand incinerated"],
    frost: ["hand frozen", "fingers blackened", "hand shattered", "crumbled to ice"],
    acid: ["hand corroded", "fingers melting", "palm dissolving", "hand gone"],
    lightning: ["hand shocked", "nerves fried", "hand charred", "fingers exploded"],
    necrotic: ["hand withering", "fingers falling off", "hand rotting", "hand crumbled"],
    poison: ["hand swelling", "fingers blackening", "tissue dying", "hand unusable"],
    psychic: ["phantom grip", "hand numb", "fine motor lost", "hand disconnected"]
  },
  right_hand: {
    slash: ["hand cut", "fingers sliced", "palm gashed", "hand severed"],
    pierce: ["hand pierced", "palm punctured", "fingers impaled", "hand pinned"],
    blunt: ["hand bruised", "fingers broken", "bones crushed", "hand pulverized"],
    burn: ["hand burned", "fingers charred", "palm seared", "hand incinerated"],
    frost: ["hand frozen", "fingers blackened", "hand shattered", "crumbled to ice"],
    acid: ["hand corroded", "fingers melting", "palm dissolving", "hand gone"],
    lightning: ["hand shocked", "nerves fried", "hand charred", "fingers exploded"],
    necrotic: ["hand withering", "fingers falling off", "hand rotting", "hand crumbled"],
    poison: ["hand swelling", "fingers blackening", "tissue dying", "hand unusable"],
    psychic: ["phantom grip", "hand numb", "fine motor lost", "hand disconnected"]
  },
  left_leg: {
    slash: ["leg slashed", "thigh cut", "leg gashed", "leg severed"],
    pierce: ["leg pierced", "thigh punctured", "knee shattered", "leg impaled"],
    blunt: ["leg bruised", "bone fractured", "leg broken", "leg pulverized"],
    burn: ["leg scorched", "skin charred", "muscle cooked", "leg incinerated"],
    frost: ["leg frozen", "toes blackened", "leg shattered", "leg crumbled"],
    acid: ["leg corroded", "skin melting", "bone exposed", "leg dissolved"],
    lightning: ["leg shocked", "nerves fried", "leg charred", "leg exploded"],
    necrotic: ["leg withering", "flesh rotting", "leg falling off", "leg crumbled"],
    poison: ["leg swelling", "veins blackening", "tissue dying", "leg unusable"],
    psychic: ["phantom step", "leg numb", "mobility lost", "leg disconnected"]
  },
  right_leg: {
    slash: ["leg slashed", "thigh cut", "leg gashed", "leg severed"],
    pierce: ["leg pierced", "thigh punctured", "knee shattered", "leg impaled"],
    blunt: ["leg bruised", "bone fractured", "leg broken", "leg pulverized"],
    burn: ["leg scorched", "skin charred", "muscle cooked", "leg incinerated"],
    frost: ["leg frozen", "toes blackened", "leg shattered", "leg crumbled"],
    acid: ["leg corroded", "skin melting", "bone exposed", "leg dissolved"],
    lightning: ["leg shocked", "nerves fried", "leg charred", "leg exploded"],
    necrotic: ["leg withering", "flesh rotting", "leg falling off", "leg crumbled"],
    poison: ["leg swelling", "veins blackening", "tissue dying", "leg unusable"],
    psychic: ["phantom step", "leg numb", "mobility lost", "leg disconnected"]
  },
  left_foot: {
    slash: ["foot cut", "toes sliced", "heel gashed", "foot severed"],
    pierce: ["foot pierced", "sole punctured", "toes impaled", "foot pinned"],
    blunt: ["foot bruised", "toes broken", "bones crushed", "foot pulverized"],
    burn: ["foot burned", "toes charred", "sole seared", "foot incinerated"],
    frost: ["foot frozen", "toes blackened", "foot shattered", "crumbled to ice"],
    acid: ["foot corroded", "toes melting", "sole dissolving", "foot gone"],
    lightning: ["foot shocked", "nerves fried", "foot charred", "toes exploded"],
    necrotic: ["foot withering", "toes falling off", "foot rotting", "foot crumbled"],
    poison: ["foot swelling", "toes blackening", "tissue dying", "foot unusable"],
    psychic: ["phantom steps", "foot numb", "balance lost", "foot disconnected"]
  },
  right_foot: {
    slash: ["foot cut", "toes sliced", "heel gashed", "foot severed"],
    pierce: ["foot pierced", "sole punctured", "toes impaled", "foot pinned"],
    blunt: ["foot bruised", "toes broken", "bones crushed", "foot pulverized"],
    burn: ["foot burned", "toes charred", "sole seared", "foot incinerated"],
    frost: ["foot frozen", "toes blackened", "foot shattered", "crumbled to ice"],
    acid: ["foot corroded", "toes melting", "sole dissolving", "foot gone"],
    lightning: ["foot shocked", "nerves fried", "foot charred", "toes exploded"],
    necrotic: ["foot withering", "toes falling off", "foot rotting", "foot crumbled"],
    poison: ["foot swelling", "toes blackening", "tissue dying", "foot unusable"],
    psychic: ["phantom steps", "foot numb", "balance lost", "foot disconnected"]
  },
  tail: {
    slash: ["tail nicked", "tail cut", "tail gashed", "tail severed"],
    pierce: ["tail pricked", "tail punctured", "tail impaled", "tail skewered"],
    blunt: ["tail bruised", "tail bent", "tail broken", "tail crushed"],
    burn: ["tail singed", "tail burned", "tail charred", "tail incinerated"],
    frost: ["tail chilled", "tail frozen", "tail shattered", "tail crumbled"],
    acid: ["tail irritated", "tail corroded", "tail melting", "tail dissolved"],
    lightning: ["tail tingling", "tail shocked", "tail fried", "tail exploded"],
    necrotic: ["tail withering", "tail rotting", "tail falling off", "tail gone"],
    poison: ["tail numbing", "tail swelling", "tail dying", "tail unusable"],
    psychic: ["phantom tail", "tail numb", "balance off", "tail disconnected"]
  },
  wings: {
    slash: ["wing scraped", "wing cut", "wing membrane torn", "wing severed"],
    pierce: ["wing pricked", "wing punctured", "wing bone broken", "wing impaled"],
    blunt: ["wing bruised", "wing bent", "wing broken", "wing crushed"],
    burn: ["wing singed", "feathers burned", "wing charred", "wing incinerated"],
    frost: ["wing chilled", "wing frozen", "wing shattered", "wing crumbled"],
    acid: ["wing irritated", "wing corroded", "wing melting", "wing dissolved"],
    lightning: ["wing tingling", "wing shocked", "wing fried", "wing exploded"],
    necrotic: ["wing withering", "wing rotting", "wing falling off", "wing gone"],
    poison: ["wing numbing", "wing swelling", "wing dying", "flight impossible"],
    psychic: ["phantom flight", "wing numb", "coordination lost", "wings disconnected"]
  },
  horns: {
    slash: ["horn scraped", "horn chipped", "horn cracked", "horn severed"],
    pierce: ["horn pricked", "horn chipped", "horn broken", "horn shattered"],
    blunt: ["horn bruised", "horn dented", "horn cracked", "horn crushed"],
    burn: ["horn singed", "horn scorched", "horn charred", "horn incinerated"],
    frost: ["horn chilled", "horn frozen", "horn shattered", "horn crumbled"],
    acid: ["horn irritated", "horn corroded", "horn melting", "horn dissolved"],
    lightning: ["horn tingling", "horn shocked", "horn exploded", "horn gone"],
    necrotic: ["horn dulling", "horn decaying", "horn crumbling", "horn gone"],
    poison: ["horn discolored", "horn weakening", "horn brittle", "horn falling"],
    psychic: ["horn ache", "horn numb", "sensitivity lost", "horn disconnected"]
  }
};

// Fatal wound locations at severity 10
const fatalLocations: BodyPart[] = ["head", "neck", "chest", "torso", "abdomen"];

// Neck severity 10 is ALWAYS a fatal decapitation regardless of other factors
export const isInstantDecapitation = (bodyPart: BodyPart, severity: WoundSeverity): boolean => {
  return bodyPart === "neck" && severity === 10;
};

// Check if a wound causes a permanent status effect (blindness, lost limb)
export const getPermanentCondition = (wound: Wound): { name: string; description: string; icon: string } | null => {
  // Severity 8+ on head can cause blindness
  if (wound.bodyPart === "head" && wound.severity >= 8 && 
      (wound.type === "slash" || wound.type === "acid" || wound.type === "burn" || wound.type === "lightning")) {
    if (Math.random() < 0.4) {
      return { name: "Blinded", description: "Eyes destroyed — the world is darkness now", icon: "🕶️" };
    }
  }
  
  // Severity 9-10 on limbs = lost limb
  const limbParts: BodyPart[] = ["left_arm", "right_arm", "left_hand", "right_hand", "left_leg", "right_leg", "left_foot", "right_foot"];
  if (limbParts.includes(wound.bodyPart) && wound.severity >= 9) {
    const partName = wound.bodyPart.replace('_', ' ');
    return { name: `Lost ${partName}`, description: `${partName} severed — only the most powerful healing can restore it`, icon: "🦴" };
  }
  
  // Severity 10 on wings = lost wings
  if (wound.bodyPart === "wings" && wound.severity >= 9) {
    return { name: "Wings Destroyed", description: "Grounded forever — unless a miracle intervenes", icon: "🪽" };
  }
  
  // Severity 10 on tail
  if (wound.bodyPart === "tail" && wound.severity >= 9) {
    return { name: "Lost Tail", description: "Balance permanently compromised", icon: "🦎" };
  }
  
  return null;
};

// Get random body part based on race (some races have extra parts)
export const getBodyPartsForRace = (race: string): BodyPart[] => {
  const baseParts: BodyPart[] = [
    "head", "neck", "torso", "chest", "abdomen",
    "left_arm", "right_arm", "left_hand", "right_hand",
    "left_leg", "right_leg", "left_foot", "right_foot"
  ];
  
  // Add race-specific parts
  if (race.toLowerCase().includes("tail") || 
      race.toLowerCase().includes("cat") || 
      race.toLowerCase().includes("fox") ||
      race.toLowerCase().includes("wolf") ||
      race.toLowerCase().includes("dragon") ||
      race.toLowerCase().includes("demon") ||
      race.toLowerCase().includes("lamia") ||
      race.toLowerCase().includes("manticore")) {
    baseParts.push("tail");
  }
  
  if (race.toLowerCase().includes("wing") || 
      race.toLowerCase().includes("angel") ||
      race.toLowerCase().includes("harpy") ||
      race.toLowerCase().includes("phoenix") ||
      race.toLowerCase().includes("valkyrie") ||
      race.toLowerCase().includes("fairy") ||
      race.toLowerCase().includes("pixie") ||
      race.toLowerCase().includes("imp") ||
      race.toLowerCase().includes("succubus") ||
      race.toLowerCase().includes("tengu")) {
    baseParts.push("wings");
  }
  
  if (race.toLowerCase().includes("horn") || 
      race.toLowerCase().includes("oni") ||
      race.toLowerCase().includes("demon") ||
      race.toLowerCase().includes("minotaur") ||
      race.toLowerCase().includes("dragon")) {
    baseParts.push("horns");
  }
  
  return baseParts;
};

// Calculate wound severity based on damage, critical hit, and other factors
export const calculateWoundSeverity = (
  damage: number,
  isCritical: boolean,
  isBackstab: boolean,
  monsterRank: number,
  playerLevel: number
): WoundSeverity => {
  // Base severity from damage (normalized to 1-10)
  let severity = Math.ceil(damage / 15); // 15 damage = severity 1
  
  // Critical hits increase severity by 2-4
  if (isCritical) {
    severity += 2 + Math.floor(Math.random() * 3);
  }
  
  // Backstabs are precise - higher chance of severe wounds
  if (isBackstab) {
    severity += 1 + Math.floor(Math.random() * 2);
  }
  
  // Monster rank affects wound severity
  const rankDiff = monsterRank - Math.floor(playerLevel / 5);
  if (rankDiff > 0) {
    severity += Math.floor(rankDiff / 2);
  }
  
  // Clamp to 1-10
  return Math.max(1, Math.min(10, severity)) as WoundSeverity;
};

// Generate a wound
export const generateWound = (
  bodyPart: BodyPart,
  severity: WoundSeverity,
  woundType: WoundType,
  inflictedBy?: string
): Wound => {
  const templates = woundTemplates[bodyPart]?.[woundType] || woundTemplates.torso[woundType];
  
  // Select template based on severity (higher severity = later template)
  const templateIndex = Math.min(
    Math.floor((severity - 1) / 3), // 1-3 = 0, 4-6 = 1, 7-9 = 2, 10 = 3
    templates.length - 1
  );
  const woundDesc = templates[templateIndex];
  
  const sevInfo = severityDescriptions[severity];
  // Neck severity 10 is ALWAYS fatal (decapitation), plus other vital areas
  const isFatal = isInstantDecapitation(bodyPart, severity) || (severity === 10 && fatalLocations.includes(bodyPart));
  
  return {
    id: `wound_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    bodyPart,
    severity,
    type: woundType,
    name: `${sevInfo.name} (${bodyPart.replace('_', ' ')})`,
    description: `${sevInfo.prefix} ${woundDesc}`,
    bleedingRate: severity >= 4 ? Math.floor(severity / 2) : 0,
    painLevel: severity,
    healingTime: severity * 10, // 10-100 ticks to heal
    isFatal,
    inflictedBy,
    inflictedAt: Date.now(),
    isHealed: false
  };
};

// Roll for a random wound during combat
export const rollForWound = (
  damage: number,
  isCritical: boolean,
  isBackstab: boolean,
  monsterRank: number,
  playerLevel: number,
  playerRace: string,
  monsterName: string,
  damageType: WoundType = "slash"
): Wound | null => {
  // Base chance to receive a wound
  // Higher damage = higher chance, crits always wound
  const baseChance = Math.min(0.1 + (damage / 100), 0.5);
  const critBonus = isCritical ? 0.4 : 0;
  const backstabBonus = isBackstab ? 0.2 : 0;
  
  if (!isCritical && Math.random() > baseChance + critBonus + backstabBonus) {
    return null; // No wound this time
  }
  
  // Determine body part
  const availableParts = getBodyPartsForRace(playerRace);
  
  // Backstabs tend to hit vital areas
  let targetPart: BodyPart;
  if (isBackstab && Math.random() < 0.6) {
    const vitalParts: BodyPart[] = ["chest", "neck", "abdomen"];
    targetPart = vitalParts[Math.floor(Math.random() * vitalParts.length)];
  } else {
    targetPart = availableParts[Math.floor(Math.random() * availableParts.length)];
  }
  
  const severity = calculateWoundSeverity(damage, isCritical, isBackstab, monsterRank, playerLevel);
  
  return generateWound(targetPart, severity, damageType, monsterName);
};

// Get wound status icon
export const getWoundIcon = (severity: WoundSeverity): string => {
  if (severity >= 9) return "💀";
  if (severity >= 7) return "🩸";
  if (severity >= 5) return "🤕";
  if (severity >= 3) return "🩹";
  return "•";
};

// Get wound color class
export const getWoundColorClass = (severity: WoundSeverity): string => {
  if (severity >= 9) return "text-red-600";
  if (severity >= 7) return "text-red-500";
  if (severity >= 5) return "text-orange-500";
  if (severity >= 3) return "text-yellow-500";
  return "text-gray-400";
};

// Calculate total pain penalty (affects combat effectiveness)
export const calculatePainPenalty = (wounds: Wound[]): number => {
  const activeWounds = wounds.filter(w => !w.isHealed);
  if (activeWounds.length === 0) return 0;
  
  const totalPain = activeWounds.reduce((sum, w) => sum + w.painLevel, 0);
  // Cap at 50% penalty
  return Math.min(50, totalPain * 3);
};

// Calculate total bleeding damage per tick
export const calculateBleedingDamage = (wounds: Wound[]): number => {
  const activeWounds = wounds.filter(w => !w.isHealed);
  return activeWounds.reduce((sum, w) => sum + w.bleedingRate, 0);
};

// Heal wounds over time
export const healWounds = (wounds: Wound[], healingPower: number = 1): Wound[] => {
  return wounds.map(wound => {
    if (wound.isHealed) return wound;
    
    const newHealingTime = wound.healingTime - healingPower;
    if (newHealingTime <= 0) {
      return { ...wound, isHealed: true, healingTime: 0 };
    }
    return { ...wound, healingTime: newHealingTime };
  });
};

// Format wound for display
export const formatWound = (wound: Wound): string => {
  const icon = getWoundIcon(wound.severity);
  const sevInfo = severityDescriptions[wound.severity];
  return `${icon} [Sev ${wound.severity}] ${sevInfo.name}: ${wound.description}${wound.inflictedBy ? ` (by ${wound.inflictedBy})` : ''}`;
};

// Generate wound summary for death log
export const generateWoundSummary = (wounds: Wound[]): string => {
  if (wounds.length === 0) return "No wounds recorded";
  
  const sortedWounds = [...wounds].sort((a, b) => b.severity - a.severity);
  const fatalWound = sortedWounds.find(w => w.isFatal);
  
  let summary = "";
  
  if (fatalWound) {
    summary += `FATAL WOUND: ${formatWound(fatalWound)}\n\n`;
  }
  
  summary += `Total Wounds Sustained: ${wounds.length}\n`;
  summary += `Healed Wounds: ${wounds.filter(w => w.isHealed).length}\n`;
  summary += `Active Wounds at Death: ${wounds.filter(w => !w.isHealed).length}\n\n`;
  
  summary += "Wound History:\n";
  sortedWounds.forEach(wound => {
    summary += `  ${formatWound(wound)}${wound.isHealed ? " [HEALED]" : ""}\n`;
  });
  
  return summary;
};

// Get random damage type based on monster
export const getDamageTypeFromMonster = (monsterName: string): WoundType => {
  const name = monsterName.toLowerCase();
  
  if (name.includes("dragon") || name.includes("fire") || name.includes("flame") || name.includes("inferno")) {
    return "burn";
  }
  if (name.includes("ice") || name.includes("frost") || name.includes("cold") || name.includes("frozen")) {
    return "frost";
  }
  if (name.includes("acid") || name.includes("slime") || name.includes("ooze")) {
    return "acid";
  }
  if (name.includes("lightning") || name.includes("storm") || name.includes("thunder") || name.includes("electric")) {
    return "lightning";
  }
  if (name.includes("undead") || name.includes("lich") || name.includes("death") || name.includes("skeleton") || name.includes("zombie")) {
    return "necrotic";
  }
  if (name.includes("spider") || name.includes("snake") || name.includes("venom") || name.includes("poison")) {
    return "poison";
  }
  if (name.includes("mind") || name.includes("psychic") || name.includes("eldritch") || name.includes("aberration")) {
    return "psychic";
  }
  if (name.includes("golem") || name.includes("giant") || name.includes("ogre") || name.includes("troll")) {
    return "blunt";
  }
  if (name.includes("assassin") || name.includes("rogue") || name.includes("archer") || name.includes("piercing")) {
    return "pierce";
  }
  
  // Default to slash
  return "slash";
};
