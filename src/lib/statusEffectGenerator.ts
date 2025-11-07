export interface StatusEffect {
  name: string;
  type: 'good' | 'bad';
  description: string;
  icon: string;
}

const badEffects: StatusEffect[] = [
  { name: "Blind", type: "bad", description: "Can't see the obvious plot twists", icon: "👁️" },
  { name: "Diseased", type: "bad", description: "Caught the isekai flu", icon: "🤢" },
  { name: "Poisoned", type: "bad", description: "Shouldn't have eaten that suspicious mushroom", icon: "☠️" },
  { name: "Petrified", type: "bad", description: "Turned to stone by Medusa's selfie", icon: "🗿" },
  { name: "Cursed", type: "bad", description: "Someone put a hex on your gacha luck", icon: "😈" },
  { name: "Confused", type: "bad", description: "Lost in a tournament arc", icon: "😵" },
  { name: "Silenced", type: "bad", description: "Can't shout attack names", icon: "🤐" },
  { name: "Slowed", type: "bad", description: "Stuck in filler episodes", icon: "🐌" }
];

const goodEffects: StatusEffect[] = [
  { name: "Blessed", type: "good", description: "RNGesus smiles upon you", icon: "✨" },
  { name: "Haste", type: "good", description: "Fast as a speedrun", icon: "⚡" },
  { name: "Reflect", type: "good", description: "No u", icon: "🛡️" },
  { name: "Magic Shield", type: "good", description: "Plot armor activated", icon: "🔮" },
  { name: "Physical Shield", type: "good", description: "Abs of steel", icon: "💪" },
  { name: "Regeneration", type: "good", description: "HP goes brrrr", icon: "❤️‍🩹" },
  { name: "Lucky", type: "good", description: "SSR pull rate +10000%", icon: "🍀" },
  { name: "Powered Up", type: "good", description: "Training arc paid off", icon: "💥" }
];

export const getRandomStatusEffect = (type?: 'good' | 'bad'): StatusEffect => {
  if (type === 'good') {
    return goodEffects[Math.floor(Math.random() * goodEffects.length)];
  } else if (type === 'bad') {
    return badEffects[Math.floor(Math.random() * badEffects.length)];
  }
  
  const allEffects = [...badEffects, ...goodEffects];
  return allEffects[Math.floor(Math.random() * allEffects.length)];
};

export const removeRandomStatusEffect = (effects: StatusEffect[]): StatusEffect[] => {
  if (effects.length === 0) return effects;
  const index = Math.floor(Math.random() * effects.length);
  return effects.filter((_, i) => i !== index);
};
