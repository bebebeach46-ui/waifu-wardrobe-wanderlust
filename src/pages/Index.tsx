import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import WorldGenerator from "@/components/WorldGenerator";
import GameScreen from "@/components/GameScreen";
import SaveSlots from "@/components/SaveSlots";

const Index = () => {
  const [screen, setScreen] = useState<"menu" | "slots" | "world" | "game">("menu");
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [worldData, setWorldData] = useState<any>(null);

  const handleNewGame = () => {
    setScreen("slots");
  };

  const handleSlotSelect = (slot: number) => {
    setSelectedSlot(slot);
    setScreen("world");
  };

  const handleWorldGenerated = (world: any) => {
    setWorldData(world);
    setScreen("game");
  };

  const handleBackToMenu = () => {
    setScreen("menu");
    setSelectedSlot(null);
    setWorldData(null);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {screen === "menu" && (
          <Card className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold text-primary">Quest Idle</h1>
              <p className="text-muted-foreground">An Automated Adventure</p>
            </div>
            <div className="space-y-3">
              <Button onClick={handleNewGame} className="w-full" size="lg">
                New Adventure
              </Button>
              <Button variant="secondary" className="w-full" size="lg">
                Continue
              </Button>
              <Button variant="outline" className="w-full" size="lg" onClick={() => window.location.href = "/leaderboard"}>
                Leaderboards
              </Button>
              <Button variant="outline" className="w-full" size="lg" onClick={() => window.location.href = "/auth"}>
                Sign In / Sign Up
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                Settings
              </Button>
            </div>
          </Card>
        )}

        {screen === "slots" && (
          <SaveSlots onSlotSelect={handleSlotSelect} onBack={handleBackToMenu} />
        )}

        {screen === "world" && selectedSlot !== null && (
          <WorldGenerator onWorldGenerated={handleWorldGenerated} onBack={handleBackToMenu} />
        )}

        {screen === "game" && worldData && selectedSlot !== null && (
          <GameScreen 
            worldData={worldData} 
            saveSlot={selectedSlot}
            onBack={handleBackToMenu}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
