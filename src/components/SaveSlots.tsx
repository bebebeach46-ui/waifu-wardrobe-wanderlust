import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface SaveSlotsProps {
  onSlotSelect: (slot: number) => void;
  onBack: () => void;
  isLoadingExisting?: boolean;
}

const SaveSlots = ({ onSlotSelect, onBack, isLoadingExisting = false }: SaveSlotsProps) => {
  const slots = [1, 2, 3];

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-bold">
          {isLoadingExisting ? "Load Game" : "Select Save Slot"}
        </h2>
      </div>
      <div className="space-y-3">
        {slots.map((slot) => {
          const saveData = localStorage.getItem(`quest-idle-slot-${slot}`);
          return (
            <Button
              key={slot}
              variant="outline"
              className="w-full h-auto p-4 justify-start"
              onClick={() => onSlotSelect(slot)}
              disabled={isLoadingExisting && !saveData}
            >
              <div className="text-left">
                <div className="font-bold">Slot {slot}</div>
                {saveData ? (
                  <div className="text-sm text-muted-foreground">
                    Level {JSON.parse(saveData).level} - {JSON.parse(saveData).characterName}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">Empty</div>
                )}
              </div>
            </Button>
          );
        })}
      </div>
    </Card>
  );
};

export default SaveSlots;
