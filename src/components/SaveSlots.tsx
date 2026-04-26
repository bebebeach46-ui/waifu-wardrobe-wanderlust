import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SaveSlotsProps {
  onSlotSelect: (slot: number) => void;
  onBack: () => void;
  isLoadingExisting?: boolean;
}

const formatTimestamp = (ts: number | undefined): string => {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleString();
};

const SaveSlots = ({ onSlotSelect, onBack, isLoadingExisting = false }: SaveSlotsProps) => {
  const slots = [1, 2, 3];
  const [confirmSlot, setConfirmSlot] = useState<number | null>(null);
  const [confirmData, setConfirmData] = useState<any>(null);

  const handleClick = (slot: number, parsed: any | null) => {
    // When starting a NEW adventure, warn before overwriting an existing save.
    if (!isLoadingExisting && parsed) {
      setConfirmSlot(slot);
      setConfirmData(parsed);
      return;
    }
    onSlotSelect(slot);
  };

  const confirmOverwrite = () => {
    if (confirmSlot !== null) {
      // Wipe the existing save so the new adventure starts clean.
      localStorage.removeItem(`quest-idle-slot-${confirmSlot}`);
      const slot = confirmSlot;
      setConfirmSlot(null);
      setConfirmData(null);
      onSlotSelect(slot);
    }
  };

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

      {!isLoadingExisting && (
        <div className="text-xs text-muted-foreground bg-muted/50 border border-border rounded p-2">
          Saves persist until your hero dies. Picking an occupied slot will ask before overwriting.
        </div>
      )}

      <div className="space-y-3">
        {slots.map((slot) => {
          const raw = localStorage.getItem(`quest-idle-slot-${slot}`);
          let parsed: any = null;
          try { parsed = raw ? JSON.parse(raw) : null; } catch { parsed = null; }
          const occupied = !!parsed;

          return (
            <Button
              key={slot}
              variant={occupied ? "secondary" : "outline"}
              className="w-full h-auto p-4 justify-start"
              onClick={() => handleClick(slot, parsed)}
              disabled={isLoadingExisting && !occupied}
            >
              <div className="text-left w-full">
                <div className="flex items-center justify-between">
                  <div className="font-bold">Slot {slot}</div>
                  {occupied && !isLoadingExisting && (
                    <span className="text-[10px] text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Occupied
                    </span>
                  )}
                </div>
                {occupied ? (
                  <div className="text-sm text-muted-foreground">
                    Lv {parsed.level ?? "?"} — {parsed.characterName ?? "Unknown"}
                    {parsed.timestamp && (
                      <div className="text-[10px] text-muted-foreground/80">
                        Last saved {formatTimestamp(parsed.timestamp)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">Empty</div>
                )}
              </div>
            </Button>
          );
        })}
      </div>

      <AlertDialog open={confirmSlot !== null} onOpenChange={(o) => !o && setConfirmSlot(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" /> Overwrite save?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Slot {confirmSlot} already holds{" "}
              <span className="font-semibold text-foreground">
                Lv {confirmData?.level ?? "?"} {confirmData?.characterName ?? "your hero"}
              </span>
              {confirmData?.timestamp && (
                <> (last saved {formatTimestamp(confirmData.timestamp)})</>
              )}.
              Starting a new adventure here will permanently erase that hero. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep existing save</AlertDialogCancel>
            <AlertDialogAction onClick={confirmOverwrite} className="bg-destructive hover:bg-destructive/90">
              Erase &amp; start new
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default SaveSlots;
