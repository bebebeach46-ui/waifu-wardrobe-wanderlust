export interface CombatStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  luck: number;
}

export interface CombatResult {
  hit: boolean;
  damage: number;
  critical: boolean;
  backstab: boolean;
  message: string;
}

// Critical hit system based on dexterity
export const checkCriticalHit = (dexterity: number): boolean => {
  const critChance = Math.min(0.05 + (dexterity - 10) * 0.01, 0.5); // Base 5%, +1% per dex above 10, max 50%
  return Math.random() < critChance;
};

// Backstab multiplier for rogues and thieves
export const getBackstabMultiplier = (
  characterClass: string,
  isStealthed: boolean,
  level: number = 1
): number => {
  const rogueClasses = ["Rogue", "Scavenger", "Hacker"];
  
  if (!rogueClasses.includes(characterClass)) return 1;
  if (!isStealthed) return 1;
  
  // 2nd edition D&D style: x2 at level 1-4, x3 at 5-8, x4 at 9-12, x5 at 13+
  if (level >= 13) return 5;
  if (level >= 9) return 4;
  if (level >= 5) return 3;
  return 2;
};

// Stealth check system
export const checkStealth = (
  dexterity: number,
  characterClass: string,
  enemyWisdom: number = 10
): boolean => {
  const rogueClasses = ["Rogue", "Scavenger", "Hacker"];
  const baseChance = rogueClasses.includes(characterClass) ? 0.6 : 0.3;
  
  const stealthBonus = (dexterity - 10) * 0.05;
  const detectionPenalty = (enemyWisdom - 10) * 0.03;
  
  const stealthChance = baseChance + stealthBonus - detectionPenalty;
  
  return Math.random() < Math.max(0.1, Math.min(0.9, stealthChance));
};

// Calculate attack with all modifiers
export const calculateAttack = (
  attacker: {
    stats: CombatStats;
    class: string;
    secondClass?: string | null;
    level?: number;
  },
  isStealthed: boolean = false
): CombatResult => {
  const { stats, class: primaryClass, secondClass, level = 1 } = attacker;
  
  // Base damage from strength
  const baseDamage = Math.floor(Math.random() * 10) + 1 + Math.floor((stats.strength - 10) / 2);
  
  // Check for critical hit
  const isCritical = checkCriticalHit(stats.dexterity);
  
  // Check for backstab
  const activeClass = Math.random() > 0.5 && secondClass ? secondClass : primaryClass;
  const backstabMultiplier = getBackstabMultiplier(activeClass, isStealthed, level);
  const isBackstab = backstabMultiplier > 1;
  
  // Calculate final damage
  let finalDamage = baseDamage;
  
  if (isCritical) {
    finalDamage *= 2;
  }
  
  if (isBackstab) {
    finalDamage *= backstabMultiplier;
  }
  
  // Luck can cause rerolls or bonuses
  if (stats.luck > 15 && Math.random() < 0.2) {
    finalDamage += Math.floor(Math.random() * stats.luck);
  }
  
  // Hit roll (d20 + dex modifier)
  const hitRoll = Math.floor(Math.random() * 20) + 1 + Math.floor((stats.dexterity - 10) / 2);
  const hit = hitRoll >= 10; // Simple AC 10 target
  
  let message = "";
  if (!hit) {
    message = "Attack misses like a blind otaku!";
  } else if (isCritical && isBackstab) {
    message = `CRITICAL BACKSTAB x${backstabMultiplier}! Nothing personnel, kid!`;
  } else if (isCritical) {
    message = "CRITICAL HIT! Protagonist power activated!";
  } else if (isBackstab) {
    message = `Backstab x${backstabMultiplier}! Omae wa mou shindeiru!`;
  } else {
    message = "Successful hit!";
  }
  
  return {
    hit,
    damage: hit ? finalDamage : 0,
    critical: isCritical,
    backstab: isBackstab,
    message
  };
};

// Saving throw system (2nd edition D&D style)
export const makeSavingThrow = (
  character: { stats: CombatStats; class: string; level?: number },
  saveType: "fortitude" | "reflex" | "will",
  dc: number = 15
): boolean => {
  const { stats, level = 1 } = character;
  
  let statBonus = 0;
  switch (saveType) {
    case "fortitude":
      statBonus = Math.floor((stats.constitution - 10) / 2);
      break;
    case "reflex":
      statBonus = Math.floor((stats.dexterity - 10) / 2);
      break;
    case "will":
      statBonus = Math.floor((stats.wisdom - 10) / 2);
      break;
  }
  
  const luckBonus = stats.luck > 13 ? Math.floor((stats.luck - 10) / 3) : 0;
  const levelBonus = Math.floor(level / 2);
  
  const roll = Math.floor(Math.random() * 20) + 1;
  const total = roll + statBonus + luckBonus + levelBonus;
  
  return total >= dc;
};
