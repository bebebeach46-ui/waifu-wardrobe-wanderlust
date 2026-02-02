import { DeathCause } from './deathCauseGenerator';
import { Wound } from './woundSystem';
import { CombatLog } from './activityTracker';

export interface DeathNarrativeContext {
  characterName: string;
  characterClass: string;
  characterRace: string;
  characterAge?: number;
  level: number;
  questsCompleted: number;
  questName: string;
  deathCause: DeathCause | null;
  fatalWound: Wound | null;
  lastEncounter: { monsterName: string; monsterRank: number } | null;
  combatLog: CombatLog[];
  wounds: Wound[];
  companions: Array<{ name: string; relationshipName?: string; relationship?: number }>;
  alignment: string;
  weather?: { name: string; description: string };
  gold: number;
}

// Opening paragraphs based on death type
const openingParagraphs = {
  combat: [
    "The clash of steel rang through the air as {name} made their final stand. What began as just another quest through {quest} would become the battleground of their ultimate fate. The {monster} loomed before them, a creature of terrible power whose very presence seemed to drain the courage from lesser adventurers.",
    "Blood and sweat mingled as {name} fought with every ounce of strength remaining. The journey through {quest} had taken its toll, but nothing could have prepared them for this confrontation. The {monster} was no ordinary foe - it moved with predatory grace, each attack more devastating than the last.",
    "In the depths of {quest}, {name} realized too late that they had underestimated their enemy. The {monster} struck with supernatural fury, and even the most skilled Level {level} {class} could not withstand such an onslaught. This was to be their final battle."
  ],
  trap: [
    "The dungeon of {quest} held many secrets, but none so deadly as what awaited {name}. Years of adventuring had honed their instincts, yet some traps are designed to defeat even the most experienced. A moment of distraction, a single misstep, and fate sealed their doom.",
    "{name} had survived countless dangers in their career as a {class}. Monsters, bandits, and dark magic had all fallen before them. But the ancient architects of {quest} had crafted something no amount of skill could overcome.",
    "They say the most dangerous enemy is the one you never see coming. For {name}, that enemy was not a creature of flesh and blood, but cold stone and merciless mechanism."
  ],
  environment: [
    "Nature itself claimed {name} in the unforgiving wilds of {quest}. No blade could fight the elements, no spell could turn aside the fury of the world itself. The {class} who had conquered so many foes met their match in forces beyond mortal control.",
    "The land of {quest} is beautiful, but beauty often masks danger. {name} learned this truth in their final moments, as the very environment they had traversed became their executioner.",
    "Some deaths are glorious battles, sung of in taverns for generations. Others are quiet surrenders to the indifferent forces of nature. {name}'s end was the latter - a humbling reminder that even legendary adventurers are mortal."
  ],
  ironic: [
    "The bards will sing of {name}'s death for centuries - though perhaps not in the way they would have wished. In an ending that would have made the gods themselves chuckle, the Level {level} {class} met a fate both unexpected and deeply embarrassing.",
    "There is a cruel irony in the universe, and {name} experienced it firsthand. After all they had survived - the monsters, the traps, the darkness itself - their end came in a manner that defies all heroic convention.",
    "Future generations will debate whether {name}'s death was tragedy or comedy. Having conquered so much, they fell to something so mundane that even the most creative storyteller would hesitate to write it."
  ],
  status: [
    "The affliction crept through {name}'s body with terrible patience. What began as a minor ailment during their adventures in {quest} became a relentless curse that no potion or prayer could cure. The {class} fought it as they had fought all their enemies - bravely, desperately - but some battles cannot be won.",
    "Invisible enemies are often the deadliest. For {name}, it was not sword or spell that ended their journey, but a condition that slowly consumed them from within. {quest} would be their final adventure.",
    "The body has limits that even the strongest will cannot overcome. {name} had pushed past exhaustion, pain, and fear countless times. But the effects ravaging their system were beyond mortal endurance."
  ],
  fate: [
    "Fate is a fickle mistress, and she had marked {name} from the beginning. Whether destiny or mere chance, their story was always meant to end this way - in {quest}, at Level {level}, with {quests} completed adventures behind them.",
    "Some say our ends are written in the stars before we're born. If so, then {name}'s fate was a strange one indeed - a {race} {class} whose journey would conclude not in glory or failure, but in the peculiar way only fate could orchestrate.",
    "The threads of {name}'s life had been woven by forces beyond understanding. Now those threads reached their end, completing a tapestry that told of adventure, friendship, and ultimately... this moment."
  ]
};

// Middle paragraphs describing the struggle
const struggleParagraphs = [
  "Despite the overwhelming odds, {name} refused to yield. Every instinct screamed retreat, but retreat was never in their nature. They had faced death before - in the eyes of demons, at the edge of abysses, in the maw of ancient evils. Each time they had emerged victorious. Perhaps that hubris was their undoing.",
  "The {class}'s skills were formidable - {level} levels of hard-won experience, countless battles survived, innumerable enemies defeated. But skill alone could not overcome what they faced now. The universe, it seemed, had decided their time had come.",
  "Those who knew {name} would later speak of their courage in these final moments. A {race} of {age} winters, they had seen more than most see in a lifetime. They had loved ({companion_info}), they had fought, they had lived fully. Now, in their last breaths, they showed the same defiance that had defined their entire adventure.",
  "The wounds accumulated rapidly - {wound_count} in total, each one sapping more strength, more hope. Yet still {name} stood, still they fought. It was not victory they sought now, but dignity in defeat. Even in death, a true adventurer does not grovel."
];

// Closing paragraphs
const closingParagraphs = [
  "And so ends the tale of {name}, the {race} {class} who dared to challenge {quest}. They leave behind {quests} completed adventures, {gold} gold in earthly treasures, and memories that will echo through the ages. The world is diminished by their passing, but richer for having known them.",
  "In the end, {name} joined the countless adventurers who came before - those bold souls who sought glory and found eternity instead. Their {alignment} spirit will not be forgotten. Their {quests} triumphs will be celebrated. And somewhere, in some tavern, a bard is already composing their requiem.",
  "Thus concludes the chronicle of {name}. From humble beginnings to Level {level}, from their first monster slain to their {quests}th quest completed, they lived a life most can only dream of. Death may have claimed their body, but legends never truly die.",
  "The {race} known as {name} drew their last breath at age {age}, having lived more in their years than most do in centuries. Their companions will mourn, their enemies will celebrate, and the world will spin on. But in the annals of {quest}'s history, their name will forever be inscribed."
];

function selectRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getDeathType(deathCause: DeathCause | null, fatalWound: Wound | null): keyof typeof openingParagraphs {
  if (deathCause?.ironic) return 'ironic';
  if (fatalWound) return 'combat';
  
  const cause = deathCause?.cause || 'combat';
  
  if (['trap', 'fall'].includes(cause)) return 'trap';
  if (['environment', 'starvation', 'curse'].includes(cause)) return 'environment';
  if (['bleeding', 'burning', 'disease', 'madness', 'poison'].includes(cause)) return 'status';
  if (cause === 'ironic') return 'ironic';
  if (['retirement', 'legendary', 'betrayal', 'ascension'].includes(cause)) return 'fate';
  
  return 'combat';
}

function fillTemplate(template: string, context: DeathNarrativeContext): string {
  const companionInfo = context.companions.length > 0
    ? context.companions.map(c => `${c.name} at bond level ${c.relationship || 0}`).join(', ')
    : 'no companions to share their journey';
  
  const monsterName = context.lastEncounter?.monsterName || context.deathCause?.killer || 'unknown forces';
  
  return template
    .replace(/{name}/g, context.characterName)
    .replace(/{class}/g, context.characterClass)
    .replace(/{race}/g, context.characterRace)
    .replace(/{level}/g, String(context.level))
    .replace(/{age}/g, String(context.characterAge || 'unknown'))
    .replace(/{quests}/g, String(context.questsCompleted))
    .replace(/{quest}/g, context.questName)
    .replace(/{monster}/g, monsterName)
    .replace(/{alignment}/g, context.alignment)
    .replace(/{gold}/g, String(context.gold))
    .replace(/{wound_count}/g, String(context.wounds.length))
    .replace(/{companion_info}/g, companionInfo);
}

export function generateDeathNarrative(context: DeathNarrativeContext): string {
  const deathType = getDeathType(context.deathCause, context.fatalWound);
  
  // Select paragraphs
  const opening = selectRandom(openingParagraphs[deathType]);
  const struggle = selectRandom(struggleParagraphs);
  const closing = selectRandom(closingParagraphs);
  
  // Fill templates
  const openingFilled = fillTemplate(opening, context);
  const struggleFilled = fillTemplate(struggle, context);
  const closingFilled = fillTemplate(closing, context);
  
  // Build the narrative with 3 paragraphs
  const narrative = [
    openingFilled,
    '',
    struggleFilled,
    '',
    closingFilled
  ].join('\n');
  
  return narrative;
}

export function formatLastBattleActions(combatLog: CombatLog[], count: number = 5): string {
  const lastActions = combatLog.slice(0, count).reverse(); // Oldest first for narrative flow
  
  if (lastActions.length === 0) {
    return "  No combat actions were recorded before death.";
  }
  
  const actionDescriptions: string[] = [];
  
  lastActions.forEach((action, index) => {
    const actionNumber = index + 1;
    let description = `  ${actionNumber}. ${action.description}`;
    
    // Add damage info if available
    if (action.damage !== undefined && action.damage > 0) {
      description += ` [${action.damage} damage dealt]`;
    }
    
    // Add HP info if available
    if (action.playerHp !== undefined && action.details?.playerMaxHp) {
      const hpPercent = Math.round((action.playerHp / action.details.playerMaxHp) * 100);
      description += ` [HP: ${action.playerHp}/${action.details.playerMaxHp} (${hpPercent}%)]`;
    }
    
    // Add special details
    if (action.description.includes('CRITICAL')) {
      description += ' ⚡';
    }
    if (action.description.includes('Wounded')) {
      description += ' 🩸';
    }
    
    actionDescriptions.push(description);
  });
  
  return actionDescriptions.join('\n');
}

export function generateFinalMomentsSection(
  combatLog: CombatLog[],
  wounds: Wound[],
  fatalWound: Wound | null,
  deathCause: DeathCause | null,
  characterName: string
): string {
  const lines: string[] = [];
  
  // Describe final moments based on available data
  if (fatalWound) {
    lines.push(`${characterName}'s fate was sealed when they received a devastating ${fatalWound.name}.`);
    lines.push(`The ${fatalWound.severity === 10 ? 'instantly fatal' : 'mortal'} wound to the ${fatalWound.bodyPart} left no chance of survival.`);
    if (fatalWound.inflictedBy) {
      lines.push(`Inflicted by: ${fatalWound.inflictedBy}`);
    }
  } else if (deathCause) {
    lines.push(`Final moments: ${deathCause.fullDesc}`);
    if (deathCause.killer) {
      lines.push(`The killing blow came from: ${deathCause.killer}`);
    }
  }
  
  // Summarize wounds leading to death
  const activeWounds = wounds.filter(w => !w.isHealed);
  if (activeWounds.length > 0) {
    lines.push('');
    lines.push(`At the time of death, ${characterName} was suffering from ${activeWounds.length} active wound${activeWounds.length > 1 ? 's' : ''}:`);
    activeWounds.forEach(w => {
      lines.push(`  • ${w.name} (Severity ${w.severity}) - ${w.bodyPart}`);
    });
    
    const totalBleeding = activeWounds.reduce((sum, w) => sum + w.bleedingRate, 0);
    const totalPain = activeWounds.reduce((sum, w) => sum + w.painLevel, 0);
    if (totalBleeding > 0 || totalPain > 0) {
      lines.push(`  Total bleeding rate: ${totalBleeding} HP/tick | Total pain level: ${totalPain}`);
    }
  }
  
  return lines.join('\n');
}
