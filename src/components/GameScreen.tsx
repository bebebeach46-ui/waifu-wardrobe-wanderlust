import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateCharacter } from "@/lib/characterGenerator";
import { generateQuest } from "@/lib/questGenerator";

interface GameScreenProps {
  worldData: any;
  saveSlot: number;
  onBack: () => void;
}

const GameScreen = ({ worldData, saveSlot, onBack }: GameScreenProps) => {
  const { toast } = useToast();
  const [character, setCharacter] = useState(() => generateCharacter(worldData));
  const [currentQuest, setCurrentQuest] = useState(() => generateQuest(worldData, 1));
  const [questProgress, setQuestProgress] = useState(0);
  const [stats, setStats] = useState({
    level: 1,
    exp: 0,
    expToNext: 100,
    gold: 0,
    questsCompleted: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setQuestProgress((prev) => {
        if (prev >= 100) {
          setStats((s) => {
            const newExp = s.exp + currentQuest.expReward;
            const levelUp = newExp >= s.expToNext;
            return {
              level: levelUp ? s.level + 1 : s.level,
              exp: levelUp ? newExp - s.expToNext : newExp,
              expToNext: levelUp ? s.expToNext + 50 : s.expToNext,
              gold: s.gold + currentQuest.goldReward,
              questsCompleted: s.questsCompleted + 1
            };
          });
          setCurrentQuest(generateQuest(worldData, stats.level));
          return 0;
        }
        return prev + (100 / currentQuest.duration);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentQuest, worldData, stats.level]);

  const handleSave = () => {
    const saveData = {
      character,
      stats,
      worldData,
      characterName: character.name,
      level: stats.level,
      timestamp: Date.now()
    };
    localStorage.setItem(`quest-idle-slot-${saveSlot}`, JSON.stringify(saveData));
    toast({
      title: "Game Saved",
      description: `Saved to slot ${saveSlot}`
    });
  };

  return (
    <Card className="p-4 space-y-4 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-bold">{worldData.name}</h2>
        <Button variant="ghost" size="icon" onClick={handleSave}>
          <Save className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-semibold">{character.name}</span>
          <span className="text-muted-foreground">Lv.{stats.level}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          {character.race} {character.class}
        </div>
        <Progress value={(stats.exp / stats.expToNext) * 100} className="h-2" />
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-muted p-2 rounded">
          <div className="text-muted-foreground">Gold</div>
          <div className="font-bold text-accent">{stats.gold}</div>
        </div>
        <div className="bg-muted p-2 rounded">
          <div className="text-muted-foreground">Quests</div>
          <div className="font-bold text-primary">{stats.questsCompleted}</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-semibold">Current Quest</div>
        <div className="bg-muted p-3 rounded space-y-2">
          <div className="font-medium">{currentQuest.name}</div>
          <div className="text-xs text-muted-foreground">{currentQuest.description}</div>
          <Progress value={questProgress} />
          <div className="flex justify-between text-xs">
            <span className="text-accent">+{currentQuest.goldReward} gold</span>
            <span className="text-primary">+{currentQuest.expReward} exp</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-semibold">Equipment</div>
        <div className="space-y-1 text-xs">
          {Object.entries(character.equipment).map(([slot, item]) => (
            <div key={slot} className="bg-muted p-2 rounded flex justify-between">
              <span className="text-muted-foreground capitalize">{slot}</span>
              <span>{item as string}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-semibold">Skills</div>
        <div className="flex flex-wrap gap-1">
          {character.skills.map((skill) => (
            <span key={skill} className="bg-primary/20 text-primary px-2 py-1 rounded text-xs">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default GameScreen;
