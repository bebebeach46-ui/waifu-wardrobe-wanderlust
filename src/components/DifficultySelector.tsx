import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Star } from "lucide-react";

interface DifficultySelectorProps {
  onSelect: (difficulty: number) => void;
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
        {difficulties.map((diff) => (
          <button
            key={diff.level}
            onClick={() => onSelect(diff.level)}
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
