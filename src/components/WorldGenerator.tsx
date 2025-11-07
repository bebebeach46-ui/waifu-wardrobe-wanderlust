import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { generateWorld } from "@/lib/worldGenerator";

interface WorldGeneratorProps {
  onWorldGenerated: (world: any) => void;
  onBack: () => void;
}

const WorldGenerator = ({ onWorldGenerated, onBack }: WorldGeneratorProps) => {
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState("Initializing...");

  useEffect(() => {
    const tasks = [
      "Generating terrain...",
      "Populating civilizations...",
      "Creating factions...",
      "Spawning monsters...",
      "Building dungeons...",
      "Establishing quests...",
      "Finalizing world..."
    ];

    let taskIndex = 0;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 14.28;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const world = generateWorld();
            onWorldGenerated(world);
          }, 500);
        }
        return Math.min(newProgress, 100);
      });

      if (taskIndex < tasks.length) {
        setCurrentTask(tasks[taskIndex]);
        taskIndex++;
      }
    }, 600);

    return () => clearInterval(interval);
  }, [onWorldGenerated]);

  return (
    <Card className="p-8 space-y-6">
      <h2 className="text-2xl font-bold text-center">Generating World</h2>
      <div className="space-y-4">
        <Progress value={progress} />
        <p className="text-center text-muted-foreground">{currentTask}</p>
      </div>
    </Card>
  );
};

export default WorldGenerator;
