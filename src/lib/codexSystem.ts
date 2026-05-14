export interface CodexEntry {
  id: string;
  name: string;
  type: 'companion' | 'item' | 'spell' | 'skill' | 'monster' | 'event' | 'lore';
  description: string;
  discovered: boolean;
  discoveryCount: number;
  firstDiscoveredAt?: number;
  lastSeenAt?: number;
  rarity?: string;
  details?: Record<string, any>;
}

export interface Codex {
  companions: Record<string, CodexEntry>;
  items: Record<string, CodexEntry>;
  spells: Record<string, CodexEntry>;
  skills: Record<string, CodexEntry>;
  monsters: Record<string, CodexEntry>;
  events: Record<string, CodexEntry>;
  lore: Record<string, CodexEntry>;
}

export const createEmptyCodex = (): Codex => ({
  companions: {},
  items: {},
  spells: {},
  skills: {},
  monsters: {},
  events: {},
  lore: {}
});

export const addDiscovery = (
  codex: Codex,
  type: CodexEntry['type'],
  id: string,
  name: string,
  description: string,
  details?: Record<string, any>
): Codex => {
  // Safety check: ensure codex and id are valid
  if (!codex || !id || !type) {
    console.warn('addDiscovery called with invalid parameters:', { codex: !!codex, id, type });
    return codex || createEmptyCodex();
  }

  const categoryKey = type + 's' as keyof Codex;
  
  // Ensure the category exists
  if (!codex[categoryKey]) {
    codex = {
      ...codex,
      [categoryKey]: {}
    };
  }
  
  const category = codex[categoryKey] as Record<string, CodexEntry>;
  const now = Date.now();
  
  // Safety check for category access
  if (!category) {
    console.warn('Category not found in codex:', categoryKey);
    return codex;
  }
  
  if (category[id]) {
    category[id] = {
      ...category[id],
      discoveryCount: (category[id].discoveryCount || 0) + 1,
      lastSeenAt: now
    };
  } else {
    category[id] = {
      id,
      name,
      type,
      description,
      discovered: true,
      discoveryCount: 1,
      firstDiscoveredAt: now,
      lastSeenAt: now,
      details
    };
  }
  
  return { ...codex };
};

export const getCodexStats = (codex: Codex) => {
  const stats = {
    companions: Object.keys(codex.companions).length,
    items: Object.keys(codex.items).length,
    spells: Object.keys(codex.spells).length,
    skills: Object.keys(codex.skills).length,
    monsters: Object.keys(codex.monsters).length,
    events: Object.keys(codex.events).length,
    lore: Object.keys(codex.lore).length,
    total: 0
  };
  
  stats.total = stats.companions + stats.items + stats.spells + stats.skills + stats.monsters + stats.events + stats.lore;
  
  return stats;
};

export const generateLoreEntry = (worldData: any): { id: string; name: string; description: string } => {
  const loreTypes = [
    { prefix: "ancient_prophecy", name: "Ancient Prophecy", template: (w: any) => `A prophecy foretells: "${w.prophecy || 'Great change comes to the realm'}"` },
    { prefix: "historical_event", name: "Historical Event", template: (w: any) => `In the ${w.timeline || 'ancient'} era, a legendary event occurred that shaped this world.` },
    { prefix: "deity_tale", name: "Tale of the Gods", template: (w: any) => `${w.deity?.name || 'The gods'} once walked among mortals, leaving behind ${w.deity?.artifact || 'sacred artifacts'}.` },
    { prefix: "legendary_hero", name: "Legendary Hero", template: () => `Stories speak of a hero who achieved impossible feats through sheer determination.` },
    { prefix: "cursed_land", name: "Cursed Land", template: () => `These lands are said to be cursed by ancient magic, where reality bends in strange ways.` },
    { prefix: "lost_civilization", name: "Lost Civilization", template: (w: any) => `Ruins of a ${w.timeline || 'ancient'} civilization hint at technology far beyond current understanding.` },
    { prefix: "magical_phenomenon", name: "Magical Phenomenon", template: (w: any) => `The ${w.weather || 'strange'} weather patterns are caused by unstable magical ley lines.` },
    { prefix: "monster_origin", name: "Monster Origins", template: () => `Ancient texts describe how the first monsters came to be through failed experiments and dark rituals.` },
    { prefix: "forbidden_knowledge", name: "Forbidden Knowledge", template: () => `This knowledge was sealed away by the ancients, deemed too dangerous for mortal minds.` },
    { prefix: "world_creation", name: "World Creation Myth", template: (w: any) => `In the beginning, ${w.deity?.name || 'the First One'} shaped reality from pure chaos.` },
    { prefix: "scandalous_affair", name: "Scandalous Affair", template: (w: any) => `Court records hint at a torrid liaison between ${w.deity?.name || 'a high priestess'} and a mortal hero. The chamber maids never recovered.` },
    { prefix: "fertility_rite", name: "Forgotten Fertility Rite", template: () => `Once a year, the village abandons its clothes and inhibitions in honor of an old, very enthusiastic god.` },
    { prefix: "love_curse", name: "Love-Curse Legend", template: () => `A spurned witch enchanted these lands so that any kiss lasts three days—willing or not.` },
    { prefix: "thirsty_goddess", name: "Tale of the Thirsty Goddess", template: (w: any) => `${w.deity?.name || 'A certain goddess'} is said to descend each spring in search of "worthy companionship." Inns triple their rates.` },
    { prefix: "harem_dynasty", name: "Harem Dynasty", template: () => `An empire once ruled by a single hero and forty consorts. The succession war involved a lot of pillows.` },
    { prefix: "succubus_pact", name: "The Succubus Pact", template: () => `A whole bloodline traded their souls for charm, beauty, and stamina. Their descendants are still impossible to refuse.` },
    { prefix: "honeymoon_ruins", name: "Honeymoon Ruins", template: () => `A castle built for one royal wedding night. They never came out. The masonry is suspiciously enthusiastic.` }
  ];
  
  const loreType = loreTypes[Math.floor(Math.random() * loreTypes.length)];
  const id = `${loreType.prefix}_${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id,
    name: loreType.name,
    description: loreType.template(worldData)
  };
};
