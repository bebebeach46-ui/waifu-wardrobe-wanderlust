export interface StatusEffect {
  name: string;
  type: 'good' | 'bad';
  description: string;
  icon: string;
  duration: number; // remaining quest ticks before expiry, -1 = permanent
  isPermanent?: boolean; // only removable by high-level healing
}

// Base durations in quest ticks (before difficulty scaling)
const BASE_BUFF_DURATION = 12;
const BASE_DEBUFF_DURATION = 8;

const badEffects: Omit<StatusEffect, 'duration'>[] = [
  { name: "Blind", type: "bad", description: "Can't see the obvious plot twists", icon: "👁️" },
  { name: "Diseased", type: "bad", description: "Caught the isekai flu", icon: "🤢" },
  { name: "Poisoned", type: "bad", description: "Shouldn't have eaten that suspicious mushroom", icon: "☠️" },
  { name: "Petrified", type: "bad", description: "Turned to stone by Medusa's selfie", icon: "🗿" },
  { name: "Cursed", type: "bad", description: "Someone put a hex on your gacha luck", icon: "😈" },
  { name: "Confused", type: "bad", description: "Lost in a tournament arc", icon: "😵" },
  { name: "Silenced", type: "bad", description: "Can't shout attack names", icon: "🤐" },
  { name: "Slowed", type: "bad", description: "Stuck in filler episodes", icon: "🐌" },
  { name: "Bleeding", type: "bad", description: "Leaving a crimson trail", icon: "🩸" },
  { name: "Burning", type: "bad", description: "This is fine", icon: "🔥" },
  { name: "Frostbitten", type: "bad", description: "Extremities turning black", icon: "🥶" },
  { name: "Madness", type: "bad", description: "The whispers won't stop", icon: "🌀" },
  { name: "Weakened", type: "bad", description: "Arms feel like wet noodles", icon: "💀" },
  { name: "Hexed", type: "bad", description: "A witch's parting gift", icon: "🧿" }
];

const goodEffects: Omit<StatusEffect, 'duration'>[] = [
  { name: "Blessed", type: "good", description: "RNGesus smiles upon you", icon: "✨" },
  { name: "Haste", type: "good", description: "Fast as a speedrun", icon: "⚡" },
  { name: "Reflect", type: "good", description: "No u", icon: "🛡️" },
  { name: "Magic Shield", type: "good", description: "Plot armor activated", icon: "🔮" },
  { name: "Physical Shield", type: "good", description: "Abs of steel", icon: "💪" },
  { name: "Regeneration", type: "good", description: "HP goes brrrr", icon: "❤️‍🩹" },
  { name: "Lucky", type: "good", description: "SSR pull rate +10000%", icon: "🍀" },
  { name: "Powered Up", type: "good", description: "Training arc paid off", icon: "💥" },
  { name: "Iron Skin", type: "good", description: "Damage? Never heard of her", icon: "🪨" },
  { name: "Battle Fury", type: "good", description: "Blood pumping, vision narrowing", icon: "😤" }
];

// Difficulty scaling for status effect durations
// Index 0 unused, 1-5 for difficulty levels
// [buffMultiplier, debuffMultiplier]
const difficultyDurationScaling: Record<number, { buff: number; debuff: number }> = {
  1: { buff: 2.0, debuff: 0.5 },   // Basic: buffs last 2x, debuffs half
  2: { buff: 1.5, debuff: 0.75 },   // Adventurer: buffs last 1.5x, debuffs 75%
  3: { buff: 1.0, debuff: 1.0 },    // Hero: baseline
  4: { buff: 0.6, debuff: 1.5 },    // Legendary: buffs shorter, debuffs persist
  5: { buff: 0.3, debuff: 2.5 },    // Impossible: buffs nearly instant, debuffs linger
};

export const calculateEffectDuration = (type: 'good' | 'bad', difficulty: number): number => {
  const scaling = difficultyDurationScaling[difficulty] || difficultyDurationScaling[3];
  const base = type === 'good' ? BASE_BUFF_DURATION : BASE_DEBUFF_DURATION;
  const multiplier = type === 'good' ? scaling.buff : scaling.debuff;
  return Math.max(1, Math.round(base * multiplier));
};

export const getRandomStatusEffect = (type?: 'good' | 'bad', difficulty: number = 3): StatusEffect => {
  const pool = type === 'good' ? goodEffects 
    : type === 'bad' ? badEffects 
    : [...badEffects, ...goodEffects];
  
  const base = pool[Math.floor(Math.random() * pool.length)];
  const effectType = base.type;
  const duration = calculateEffectDuration(effectType, difficulty);
  
  return { ...base, duration };
};

// Tick down durations, removing expired effects. Permanent effects never expire.
export const tickStatusEffects = (effects: StatusEffect[]): { remaining: StatusEffect[]; expired: StatusEffect[] } => {
  const remaining: StatusEffect[] = [];
  const expired: StatusEffect[] = [];
  
  for (const effect of effects) {
    if (effect.isPermanent || effect.duration === -1) {
      remaining.push(effect);
      continue;
    }
    const updated = { ...effect, duration: effect.duration - 1 };
    if (updated.duration <= 0) {
      expired.push(effect);
    } else {
      remaining.push(updated);
    }
  }
  
  return { remaining, expired };
};

export const removeRandomStatusEffect = (effects: StatusEffect[]): StatusEffect[] => {
  // Can't randomly remove permanent effects
  const removable = effects.filter(e => !e.isPermanent && e.duration !== -1);
  if (removable.length === 0) return effects;
  const target = removable[Math.floor(Math.random() * removable.length)];
  return effects.filter(e => e !== target);
};

// Create a permanent status effect from a wound (blindness, lost limb)
export const createPermanentEffect = (name: string, description: string, icon: string): StatusEffect => {
  return {
    name,
    type: 'bad',
    description,
    icon,
    duration: -1,
    isPermanent: true
  };
};

// Check if a healing spell/skill is powerful enough to cure permanent effects
// Only level 15+ characters with high-tier healing can reverse these
export const canCurePermanentEffect = (
  effectName: string,
  healerLevel: number,
  spellName?: string
): boolean => {
  const highTierHealing = [
    "Resurrection", "Cure Wounds (And Emotional Trauma)", "Regeneration",
    "Wish (But It's Monkey's Paw)", "Divine Restoration", "Greater Restoration",
    "Miracle", "True Resurrection"
  ];
  
  if (healerLevel < 15) return false;
  if (spellName && highTierHealing.some(s => spellName.includes(s))) return true;
  // 5% base chance at level 15, +2% per level above 15
  return Math.random() < 0.05 + (healerLevel - 15) * 0.02;
};
