import { Card } from "@/components/ui/card";
import {
  ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, Legend,
} from "recharts";

export interface BondSnapshot {
  quest: number;
  avgBond: number;
  best: number;
  worst: number;
  bonuses: number;
  maluses: number;
  perfMult: number;
  bestName?: string;
  worstName?: string;
}

interface Props {
  history: BondSnapshot[];
}

const RelationshipGraph = ({ history }: Props) => {
  if (history.length < 2) {
    return (
      <Card className="p-4 bg-card/60 border-border">
        <h3 className="text-sm font-bold mb-2">💞 Relationship History</h3>
        <p className="text-xs text-muted-foreground">
          Complete a few more quests — the chronicle of your bonds is still being written.
        </p>
      </Card>
    );
  }

  const latest = history[history.length - 1];
  const first = history[0];
  const trend = latest.avgBond - first.avgBond;
  const window = history.slice(-10);
  const recentBonuses = window.reduce((s, h) => s + h.bonuses, 0);
  const recentMaluses = window.reduce((s, h) => s + h.maluses, 0);
  const netPct = Math.round((latest.perfMult - 1) * 100);

  return (
    <div className="space-y-3">
      <Card className="p-3 bg-card/60 border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold">💞 Relationship History</h3>
          <span className={`text-xs font-bold ${trend >= 0 ? "text-stat-increase" : "text-stat-decrease"}`}>
            {trend >= 0 ? "▲" : "▼"} {trend >= 0 ? "+" : ""}{trend.toFixed(1)} avg bond
          </span>
        </div>
        <div className="h-52 -ml-3">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
              <XAxis dataKey="quest" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis domain={[-10, 10]} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
              <Bar dataKey="bonuses" name="Devotions" fill="hsl(var(--stat-increase, 142 70% 45%))" opacity={0.6} />
              <Bar dataKey="maluses" name="Betrayals" fill="hsl(var(--destructive))" opacity={0.6} />
              <Line type="monotone" dataKey="best" name="Closest" stroke="hsl(35 95% 60%)" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="avgBond" name="Average" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="worst" name="Most hostile" stroke="hsl(250 80% 65%)" dot={false} strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-2">
        <Card className="p-3 bg-card/60 border-border">
          <p className="text-[10px] uppercase text-muted-foreground">Bonuses (last 10)</p>
          <p className="text-lg font-bold text-stat-increase">+{recentBonuses}</p>
          <p className="text-[10px] text-muted-foreground truncate">
            Closest: {latest.bestName || "—"} ({latest.best})
          </p>
        </Card>
        <Card className="p-3 bg-card/60 border-border">
          <p className="text-[10px] uppercase text-muted-foreground">Declines (last 10)</p>
          <p className="text-lg font-bold text-stat-decrease">−{recentMaluses}</p>
          <p className="text-[10px] text-muted-foreground truncate">
            Most hostile: {latest.worstName || "—"} ({latest.worst})
          </p>
        </Card>
        <Card className="p-3 bg-card/60 border-border col-span-2">
          <p className="text-[10px] uppercase text-muted-foreground">Net party effect on last quest</p>
          <p className={`text-lg font-bold ${netPct >= 0 ? "text-stat-increase" : "text-stat-decrease"}`}>
            {netPct >= 0 ? "+" : ""}{netPct}% rewards
          </p>
        </Card>
      </div>
    </div>
  );
};

export default RelationshipGraph;
