import { tickCompanionAge } from "@/lib/companionGenerator";

export const DEATH_CAUSE_ICON: Record<string, string> = {
  old_age: "💀", betrayal: "🗡️", assassination: "🔪", ambush: "🏹",
  heroic_sacrifice: "🛡️", peaceful_passing: "🕊️",
};

export const DEATH_CAUSE_TITLE: Record<string, string> = {
  old_age: "Companion Passed Away", betrayal: "Betrayal!", assassination: "Assassination Attempt!",
  ambush: "Ambush!", heroic_sacrifice: "Heroic Sacrifice", peaceful_passing: "A Peaceful End",
};

export interface CompanionDeath { cause: string; narrative: string }

/** Age every companion by `years`; danger only applies to companions in the field (reserve uses 0). */
export function ageRoster<C extends { name: string }>(roster: C[], years: number, danger: number) {
  const survivors: C[] = [];
  const deaths: CompanionDeath[] = [];
  for (const c of roster) {
    const r = tickCompanionAge(c as any, years, danger);
    if (r.died) {
      deaths.push({
        cause: r.cause || "old_age",
        narrative: r.narrative || `${c.name} died at age ${r.companion.age}`,
      });
    } else survivors.push(r.companion as C);
  }
  return { survivors, deaths };
}
