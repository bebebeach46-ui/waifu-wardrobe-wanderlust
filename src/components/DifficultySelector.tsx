import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Star } from "lucide-react";
import { GameMode, CAMPAIGN_HEIR_GOAL } from "@/lib/gameMode";

interface DifficultySelectorProps {
  onSelect: (difficulty: number, mode: GameMode) => void;
  onBack: () => void;
}

const difficulties = [
  {
    level: 1,
    name: "Basic Quest",
    description: "For casual adventurers. Very low death chance, forgiving gameplay.",
    stars: 1,
    color: "text-green-500"
  },
  {
    level: 2,
    name: "Adventurer Quest",
    description: "Balanced experience. Moderate challenges with reasonable risk.",
    stars: 2,
    color: "text-blue-500"
  },
  {
    level: 3,
    name: "Hero's Quest",
    description: "Challenging gameplay. Death is a real threat for the unprepared.",
    stars: 3,
    color: "text-yellow-500"
  },
  {
    level: 4,
    name: "Legendary Quest",
    description: "Extremely difficult. Only the skilled survive. High risk, high reward.",
    stars: 4,
    color: "text-orange-500"
  },
  {
    level: 5,
    name: "Impossible Quest",
    description: "Brutal difficulty. Death lurks around every corner. For masochists only.",
    stars: 5,
    color: "text-red-500"
  }
];

export const DifficultySelector = ({ onSelect, onBack }: DifficultySelectorProps) => {
  const [mode, setMode] = useState<GameMode>("perpetual");
  const modes: { id: GameMode; name: string; text: string }[] = [
    { id: "perpetual", name: "♾️ Perpetual", text: "Deaths become close calls in the history log. Endless heirs, never ends." },
    { id: "campaign", name: "🏆 Campaign", text: `Death is real and writes a full morgue file. Raise ${CAMPAIGN_HEIR_GOAL} heirs to win.` },
  ];
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <CardTitle className="text-2xl">Select Difficulty</CardTitle>
        </div>
        <CardDescription>
          Choose your challenge level. Higher difficulty means greater danger but better rewards!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Game mode">
          {modes.map((m) => (
            <button
              key={m.id}
              role="radio"
              aria-checked={mode === m.id}
              onClick={() => setMode(m.id)}
              className={`p-3 rounded-lg border text-left transition-all ${mode === m.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}
            >
              <div className="font-bold text-sm">{m.name}</div>
              <p className="text-xs text-muted-foreground mt-1">{m.text}</p>
            </button>
          ))}
        </div>
        {difficulties.map((diff) => (
          <button
            key={diff.level}
            onClick={() => onSelect(diff.level, mode)}
            className="w-full p-4 rounded-lg border border-border hover:border-primary transition-all hover:bg-accent/50 text-left group"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                  {diff.name}
                </h3>
                <div className="flex gap-0.5 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < diff.stars
                          ? `${diff.color} fill-current`
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{diff.description}</p>
          </button>
        ))}
      </CardContent>
    </Card>
  );
};
