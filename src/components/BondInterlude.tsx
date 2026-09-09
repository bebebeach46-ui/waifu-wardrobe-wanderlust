import { useEffect, useState } from "react";
import { BondInterlude as Interlude } from "@/lib/bondInterludeGenerator";
import { getBondColor } from "@/lib/companionBondBonuses";
import { Button } from "@/components/ui/button";

const MIN_SECONDS = 20;

interface BondInterludeOverlayProps {
  scene: Interlude | null;
  onDismiss: () => void;
}

/**
 * Full-screen interlude. Holds the screen for at least 20 seconds so the scene
 * can actually be read; the dismiss button only unlocks once the timer expires.
 */
const BondInterludeOverlay = ({ scene, onDismiss }: BondInterludeOverlayProps) => {
  const [remaining, setRemaining] = useState(MIN_SECONDS);

  useEffect(() => {
    if (!scene) return;
    setRemaining(MIN_SECONDS);
    const t = setInterval(() => setRemaining((r) => (r > 0 ? r - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [scene?.id]);

  if (!scene) return null;

  const color = getBondColor(scene.rank);
  const romance = scene.tone === "romance";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm p-4 animate-in fade-in duration-500">
      <div
        className="w-full max-w-md rounded-lg border bg-card p-5 shadow-2xl animate-in zoom-in-95 duration-700"
        style={{ borderColor: color, boxShadow: `0 0 40px -10px ${color}` }}
      >
        <div className="text-center space-y-1">
          <div className="text-4xl">{scene.icon}</div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {romance ? "Romantic Interlude" : "Bitter Interlude"}
          </div>
          <h2 className="text-lg font-bold" style={{ color }}>
            {scene.title}
          </h2>
          <div className="text-xs" style={{ color }}>
            {scene.companionName} · {scene.race} · Bond {scene.rank >= 0 ? `+${scene.rank}` : scene.rank} {scene.rankName}
          </div>
        </div>

        <blockquote
          className="my-4 border-l-2 pl-3 text-sm italic leading-relaxed"
          style={{ borderColor: color, color }}
        >
          {scene.quote}
        </blockquote>

        <p className="text-sm leading-relaxed text-foreground/90">{scene.body}</p>

        {!romance && scene.cause && (
          <p className="mt-3 text-xs text-muted-foreground">
            <span className="font-semibold">Cause:</span> {scene.cause}
          </p>
        )}

        <div className="mt-5 flex flex-col items-center gap-2">
          <div className="h-1 w-full overflow-hidden rounded bg-muted">
            <div
              className="h-full transition-all duration-1000 ease-linear"
              style={{ width: `${((MIN_SECONDS - remaining) / MIN_SECONDS) * 100}%`, backgroundColor: color }}
            />
          </div>
          <Button
            size="sm"
            variant="outline"
            disabled={remaining > 0}
            onClick={onDismiss}
            className="w-full"
          >
            {remaining > 0 ? `Let the moment sit… ${remaining}s` : "Continue the adventure"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BondInterludeOverlay;
