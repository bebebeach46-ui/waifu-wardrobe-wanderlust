export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'stat_boost' | 'equipment' | 'consumable' | 'companion_gift' | 'special';
  effect: any;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

const statBoosts: Omit<ShopItem, 'id'>[] = [
  {
    name: "Protein Shake of Power",
    description: "+2 Strength permanently",
    price: 500,
    type: 'stat_boost',
    effect: { stat: 'strength', value: 2 },
    rarity: 'uncommon'
  },
  {
    name: "Thieves' Training Manual",
    description: "+2 Dexterity permanently",
    price: 500,
    type: 'stat_boost',
    effect: { stat: 'dexterity', value: 2 },
    rarity: 'uncommon'
  },
  {
    name: "Constitution Elixir",
    description: "+2 Constitution permanently",
    price: 500,
    type: 'stat_boost',
    effect: { stat: 'constitution', value: 2 },
    rarity: 'uncommon'
  },
  {
    name: "Brain Food Deluxe",
    description: "+2 Intelligence permanently",
    price: 500,
    type: 'stat_boost',
    effect: { stat: 'intelligence', value: 2 },
    rarity: 'uncommon'
  },
  {
    name: "Meditation Guide",
    description: "+2 Wisdom permanently",
    price: 500,
    type: 'stat_boost',
    effect: { stat: 'wisdom', value: 2 },
    rarity: 'uncommon'
  },
  {
    name: "Charm School Diploma",
    description: "+2 Charisma permanently",
    price: 500,
    type: 'stat_boost',
    effect: { stat: 'charisma', value: 2 },
    rarity: 'uncommon'
  },
  {
    name: "Four-Leaf Clover Bundle",
    description: "+3 Luck permanently",
    price: 800,
    type: 'stat_boost',
    effect: { stat: 'luck', value: 3 },
    rarity: 'rare'
  },
  {
    name: "All Stats Tome",
    description: "+1 to all stats permanently",
    price: 2000,
    type: 'stat_boost',
    effect: { stat: 'all', value: 1 },
    rarity: 'epic'
  }
];

const equipmentUpgrades: Omit<ShopItem, 'id'>[] = [
  {
    name: "Weapon Enhancement Stone",
    description: "Upgrade your weapon",
    price: 300,
    type: 'equipment',
    effect: { slot: 'weapon' },
    rarity: 'common'
  },
  {
    name: "Armor Polish Kit",
    description: "Upgrade your armor",
    price: 350,
    type: 'equipment',
    effect: { slot: 'armor' },
    rarity: 'common'
  },
  {
    name: "Shield Reinforcement",
    description: "Upgrade your shield",
    price: 250,
    type: 'equipment',
    effect: { slot: 'shield' },
    rarity: 'common'
  },
  {
    name: "Helmet Enchantment",
    description: "Upgrade your head gear",
    price: 200,
    type: 'equipment',
    effect: { slot: 'head' },
    rarity: 'common'
  },
  {
    name: "Cloak of Mysteries",
    description: "Upgrade your cloak",
    price: 200,
    type: 'equipment',
    effect: { slot: 'cloak' },
    rarity: 'common'
  },
  {
    name: "Boot Speedifier",
    description: "Upgrade your boots",
    price: 200,
    type: 'equipment',
    effect: { slot: 'boots' },
    rarity: 'common'
  },
  {
    name: "Gauntlet Forging Kit",
    description: "Upgrade your gauntlets",
    price: 200,
    type: 'equipment',
    effect: { slot: 'gauntlets' },
    rarity: 'common'
  },
  {
    name: "Ring Enchantment Scroll",
    description: "Upgrade a random ring",
    price: 300,
    type: 'equipment',
    effect: { slot: 'ring' },
    rarity: 'uncommon'
  },
  {
    name: "Amulet Blessing",
    description: "Upgrade your amulet",
    price: 400,
    type: 'equipment',
    effect: { slot: 'amulet' },
    rarity: 'uncommon'
  }
];

const consumables: Omit<ShopItem, 'id'>[] = [
  {
    name: "EXP Booster (1 hour)",
    description: "Double EXP gain for 1 hour",
    price: 1000,
    type: 'consumable',
    effect: { type: 'exp_boost', duration: 3600000 },
    rarity: 'uncommon'
  },
  {
    name: "Gold Magnet (1 hour)",
    description: "50% more gold for 1 hour",
    price: 800,
    type: 'consumable',
    effect: { type: 'gold_boost', duration: 3600000 },
    rarity: 'uncommon'
  },
  {
    name: "Shard Detector",
    description: "2x shard drop chance for 30 minutes",
    price: 2000,
    type: 'consumable',
    effect: { type: 'shard_boost', duration: 1800000 },
    rarity: 'rare'
  },
  {
    name: "Instant Quest Completion",
    description: "Complete current quest instantly",
    price: 500,
    type: 'consumable',
    effect: { type: 'instant_quest' },
    rarity: 'common'
  },
  {
    name: "Re-roll Ticket",
    description: "Re-roll your current quest",
    price: 200,
    type: 'consumable',
    effect: { type: 'reroll_quest' },
    rarity: 'common'
  },
  {
    name: "Plot Armor (Temporary)",
    description: "Prevent one death",
    price: 3000,
    type: 'consumable',
    effect: { type: 'death_save' },
    rarity: 'epic'
  },
  {
    name: "Gacha Token",
    description: "Summon a random companion",
    price: 1500,
    type: 'consumable',
    effect: { type: 'summon_companion' },
    rarity: 'rare'
  },
  {
    name: "Status Cleanser",
    description: "Remove all negative status effects",
    price: 400,
    type: 'consumable',
    effect: { type: 'cleanse_debuffs' },
    rarity: 'common'
  }
];

const companionGifts: Omit<ShopItem, 'id'>[] = [
  {
    name: "Chocolate Box",
    description: "Increases companion relationship by 1",
    price: 300,
    type: 'companion_gift',
    effect: { relationship: 1 },
    rarity: 'common'
  },
  {
    name: "Bouquet of Flowers",
    description: "Increases companion relationship by 2",
    price: 600,
    type: 'companion_gift',
    effect: { relationship: 2 },
    rarity: 'uncommon'
  },
  {
    name: "Legendary Gift Box",
    description: "Increases companion relationship by 3",
    price: 1200,
    type: 'companion_gift',
    effect: { relationship: 3 },
    rarity: 'rare'
  },
  {
    name: "Marriage Proposal Ring",
    description: "Max out companion relationship instantly",
    price: 5000,
    type: 'companion_gift',
    effect: { relationship: 10 },
    rarity: 'legendary'
  }
];

const specialItems: Omit<ShopItem, 'id'>[] = [
  {
    name: "Random Status Effect",
    description: "Gain a random status effect (good or bad)",
    price: 150,
    type: 'special',
    effect: { type: 'random_status' },
    rarity: 'common'
  },
  {
    name: "Good Status Effect",
    description: "Gain a beneficial status effect",
    price: 400,
    type: 'special',
    effect: { type: 'good_status' },
    rarity: 'uncommon'
  },
  {
    name: "Shop Refresh",
    description: "Refresh shop inventory",
    price: 100,
    type: 'special',
    effect: { type: 'refresh_shop' },
    rarity: 'common'
  },
  {
    name: "Level Skip Ticket",
    description: "Gain one level instantly",
    price: 2500,
    type: 'special',
    effect: { type: 'level_up' },
    rarity: 'epic'
  },
  {
    name: "Mystery Box",
    description: "Random powerful effect (could be good or bad)",
    price: 1000,
    type: 'special',
    effect: { type: 'mystery' },
    rarity: 'rare'
  },
  {
    name: "Deity Favor Offering",
    description: "+10 Deity Favor",
    price: 800,
    type: 'special',
    effect: { type: 'deity_favor', value: 10 },
    rarity: 'uncommon'
  },
  {
    name: "Alignment Shifter",
    description: "Shift alignment in a random direction",
    price: 500,
    type: 'special',
    effect: { type: 'shift_alignment' },
    rarity: 'uncommon'
  }
];

const allItems = [
  ...statBoosts,
  ...equipmentUpgrades,
  ...consumables,
  ...companionGifts,
  ...specialItems
];

export const generateShopInventory = (playerLevel: number, count: number = 8): ShopItem[] => {
  const items: ShopItem[] = [];
  const availableItems = allItems.filter(item => {
    // Higher level players see more expensive/rare items
    if (playerLevel < 5 && item.price > 1000) return false;
    if (playerLevel < 10 && item.price > 2500) return false;
    return true;
  });

  // Weighted random selection based on rarity
  const rarityWeights: Record<string, number> = {
    common: 50,
    uncommon: 30,
    rare: 15,
    epic: 4,
    legendary: 1
  };

  for (let i = 0; i < count; i++) {
    const totalWeight = availableItems.reduce((sum, item) => sum + rarityWeights[item.rarity], 0);
    let random = Math.random() * totalWeight;
    
    for (const item of availableItems) {
      random -= rarityWeights[item.rarity];
      if (random <= 0) {
        items.push({
          ...item,
          id: `${item.name}-${Date.now()}-${i}`
        });
        break;
      }
    }
  }

  return items;
};

export const getRarityColor = (rarity: string): string => {
  switch (rarity) {
    case 'common': return 'text-muted-foreground';
    case 'uncommon': return 'text-primary';
    case 'rare': return 'text-accent';
    case 'epic': return 'text-purple-400';
    case 'legendary': return 'text-orange-400';
    default: return 'text-foreground';
  }
};
