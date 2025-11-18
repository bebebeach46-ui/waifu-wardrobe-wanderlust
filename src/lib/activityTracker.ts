export type ActivityLog = {
  timestamp: number;
  type: "combat" | "travel" | "relationship" | "craft" | "gather" | "event" | "deity" | "fate";
  description: string;
  details?: any;
};

export type CombatLog = {
  timestamp: number;
  description: string;
  playerHp?: number;
  enemyHp?: number;
  damage?: number;
  details?: any;
};

export type MonsterKill = {
  name: string;
  count: number;
  firstKill: number;
  lastKill: number;
  rank?: number;
};

export const trackActivity = (
  activities: ActivityLog[],
  type: ActivityLog["type"],
  description: string,
  details?: any
): ActivityLog[] => {
  const newActivity: ActivityLog = {
    timestamp: Date.now(),
    type,
    description,
    details
  };
  
  return [newActivity, ...activities].slice(0, 100); // Keep last 100 activities
};

export const trackMonsterKill = (
  monsters: MonsterKill[],
  monsterName: string,
  rank?: number
): MonsterKill[] => {
  const existing = monsters.find(m => m.name === monsterName);
  const now = Date.now();
  
  if (existing) {
    return monsters.map(m =>
      m.name === monsterName
        ? { ...m, count: m.count + 1, lastKill: now, rank: rank || m.rank }
        : m
    );
  }
  
  return [...monsters, { name: monsterName, count: 1, firstKill: now, lastKill: now, rank }];
};

export const trackCombatLog = (
  combatLogs: CombatLog[],
  description: string,
  playerHp?: number,
  enemyHp?: number,
  damage?: number,
  details?: any
): CombatLog[] => {
  const newLog: CombatLog = {
    timestamp: Date.now(),
    description,
    playerHp,
    enemyHp,
    damage,
    details
  };
  
  return [newLog, ...combatLogs].slice(0, 50); // Keep last 50 combat logs
};

export const generateActivitySummary = (activities: ActivityLog[]): string => {
  const combatCount = activities.filter(a => a.type === "combat").length;
  const travelCount = activities.filter(a => a.type === "travel").length;
  const relationshipCount = activities.filter(a => a.type === "relationship").length;
  const craftCount = activities.filter(a => a.type === "craft").length;
  const gatherCount = activities.filter(a => a.type === "gather").length;
  
  return `Combat Actions: ${combatCount}\nTravel Events: ${travelCount}\nRelationship Moments: ${relationshipCount}\nCrafting Activities: ${craftCount}\nGathering Sessions: ${gatherCount}`;
};

export const generateMonstersKilledLog = (monsters: MonsterKill[]): string => {
  if (monsters.length === 0) return "  None";
  
  return monsters
    .sort((a, b) => b.count - a.count)
    .map(m => `  - ${m.name}: ${m.count} kill${m.count > 1 ? 's' : ''}${m.rank ? ` (Rank ${m.rank})` : ''}`)
    .join('\n');
};
