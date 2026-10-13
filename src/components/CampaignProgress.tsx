import { CAMPAIGN_HEIR_GOAL } from "@/lib/gameMode";
import { getBondColor } from "@/lib/companionBondBonuses";

/** Run-long counters kept for the Campaign progress screen. */
export interface RunStats {
  gradedQuests: number;
  highGradeQuests: number; // grade >= 7
  peakFame: number;
  areasVisited: number;
  saves: Record<string, number>; // Bond-10 loyalist plot interceptions by name
}
export const EMPTY_RUN_STATS: RunStats = { gradedQuests: 0, highGradeQuests: 0, peakFame: 0, areasVisited: 0, saves: {} };

const GRAND_RANKS = [
  { min: 0.9, name: "S — Mythic Legend" }, { min: 0.75, name: "A — Saga Hero" },
  { min: 0.6, name: "B — Renowned" }, { min: 0.45, name: "C — Dependable" },
  { min: 0.3, name: "D — Mediocre" }, { min: 0.15, name: "E — Bumbling" }, { min: 0, name: "F — Tavern Joke" },
];
export const grandRank = (r: RunStats) => {
  const ratio = r.gradedQuests ? r.highGradeQuests / r.gradedQuests : 0;
  return { ratio, name: (GRAND_RANKS.find(g => ratio >= g.min) || GRAND_RANKS[GRAND_RANKS.length - 1]).name };
};

interface Props {
  kind: "death" | "victory";
  run: RunStats;
  heirs: number;
  companions: any[];
  reserve: any[];
  fame: number;
  quests: number;
  level: number;
  championsDefeated: number;
  killerName?: string | null;
}

const Stat = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="rounded-md border border-border bg-muted/40 p-2">
    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
    <div className="text-lg font-bold text-foreground">{value}</div>
  </div>
);

const Name = ({ c }: { c: any }) => (
  <span className="font-semibold" style={{ color: getBondColor(c.relationship ?? 0) }}>
    {c.name} <span className="text-xs text-muted-foreground">({c.race}{c.class ? ` ${c.class}` : ""}, bond {c.relationship ?? 0})</span>
  </span>
);

export default function CampaignProgress({ kind, run, heirs, companions, reserve, fame, quests, level, championsDefeated, killerName }: Props) {
  const all = [...companions, ...reserve];
  const soulmates = all.filter(c => (c.relationship ?? 0) >= 10);
  const nemeses = all.filter(c => (c.relationship ?? 0) <= -10);
  const gr = grandRank(run);
  const byAttention = [...all].sort((a, b) => (a.questsSinceInteraction ?? 0) - (b.questsSinceInteraction ?? 0));
  const most = byAttention[0];
  const least = byAttention.length > 1 ? byAttention[byAttention.length - 1] : null;
  const notable = [...all].sort((a, b) => Math.abs(b.relationship ?? 0) - Math.abs(a.relationship ?? 0))[0];
  const killer = killerName ? all.find(c => c.name === killerName) || { name: killerName, relationship: -10, race: "?" } : null;
  const saviors = Object.entries(run.saves).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-3 text-left">
      <h3 className="text-center text-sm font-bold uppercase tracking-widest text-muted-foreground">Campaign Progress</h3>
      <div className="grid grid-cols-2 gap-2">
        <Stat label="Heirs" value={`${Math.min(heirs, CAMPAIGN_HEIR_GOAL)}/${CAMPAIGN_HEIR_GOAL}`} />
        <Stat label="Bond 10 soulmates" value={soulmates.length} />
        <Stat label="Highest fame" value={Math.max(run.peakFame, fame)} />
        <Stat label="Quests" value={quests} />
        <Stat label="Levels traversed" value={Math.max(0, level - 1)} />
        <Stat label="Areas explored" value={run.areasVisited} />
        <Stat label="Champions slain" value={championsDefeated} />
        <Stat label="Grade 7+ quests" value={`${run.highGradeQuests}/${run.gradedQuests}`} />
      </div>
      <div className="rounded-md border border-primary/40 bg-primary/10 p-3 text-center">
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Grand Rank</div>
        <div className="text-xl font-bold text-primary">{gr.name}</div>
        <div className="text-xs text-muted-foreground">{Math.round(gr.ratio * 100)}% of quests at grade 7 or higher</div>
      </div>

      {killer && (
        <div className="rounded-md border border-destructive bg-destructive/15 p-3 shadow-[0_0_24px_hsl(var(--destructive)/0.35)]">
          <div className="text-xs uppercase tracking-wide text-destructive">☠️ Slain by a Nemesis plot</div>
          <div className="mt-1 text-sm"><Name c={killer} /> finally got what she schemed for.</div>
        </div>
      )}
      {!killer && nemeses.length > 0 && (
        <div className="rounded-md border border-destructive/50 bg-destructive/5 p-3 text-sm">
          <span className="text-destructive">🖤 Nemeses still lurking:</span>{" "}
          {nemeses.map((c, i) => <span key={c.name}>{i > 0 && ", "}<Name c={c} /></span>)}
        </div>
      )}
      {saviors.length > 0 && (
        <div className="rounded-md border border-primary bg-primary/15 p-3 shadow-[0_0_24px_hsl(var(--primary)/0.35)]">
          <div className="text-xs uppercase tracking-wide text-primary">💖 Saved by a soulmate</div>
          {saviors.map(([n, count]) => {
            const c = all.find(x => x.name === n) || { name: n, relationship: 10, race: "?" };
            return <div key={n} className="mt-1 text-sm"><Name c={c} /> foiled {count} plot{count > 1 ? "s" : ""} against you.</div>;
          })}
        </div>
      )}

      {all.length > 0 && (
        <div className="space-y-1 rounded-md border border-border p-3 text-sm">
          {notable && <div>⭐ Most notable: <Name c={notable} /></div>}
          {most && <div>🥰 Most attention: <Name c={most} /></div>}
          {least && <div>🥀 Most neglected: <Name c={least} /> — ignored {least.questsSinceInteraction ?? 0} quests</div>}
        </div>
      )}
    </div>
  );
}
