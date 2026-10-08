import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { GameSettings, loadSettings, saveSettings } from "@/lib/gameSettings";
import { loadMorgueExport, saveMorgueExport, MorgueAutoExport } from "@/lib/morgueExport";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());
  const [morgue, setMorgue] = useState<MorgueAutoExport>(() => loadMorgueExport());

  useEffect(() => {
    if (open) { setSettings(loadSettings()); setMorgue(loadMorgueExport()); }
  }, [open]);

  const update = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    saveSettings(next);
  };

  const rows: { key: keyof GameSettings; label: string; hint: string }[] = [
    {
      key: "simplifiedByDefault",
      label: "Simple view by default",
      hint: "New adventures start with the compact layout.",
    },
    {
      key: "showEventTicker",
      label: "Scrolling news band",
      hint: "The rolling line of rumours at the top of the adventure.",
    },
    {
      key: "showNotifications",
      label: "Pop-up messages",
      hint: "Corner alerts for loot, romance and disasters.",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Changes save the moment you flip a switch.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {rows.map((row) => (
            <div key={row.key} className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <Label htmlFor={row.key} className="text-sm font-medium">
                  {row.label}
                </Label>
                <p className="text-xs text-muted-foreground">{row.hint}</p>
              </div>
              <Switch
                id={row.key}
                checked={settings[row.key]}
                onCheckedChange={(v) => update(row.key, v)}
              />
            </div>
          ))}
          <div className="space-y-2 pt-2 border-t border-border">
            <Label className="text-sm font-medium">Morgue files (Campaign mode)</Label>
            <p className="text-xs text-muted-foreground">What happens to the .txt record when a Campaign hero dies or wins.</p>
            <div className="grid grid-cols-2 gap-2">
              {([["device", "Save to device"], ["manual", "I'll choose"]] as const).map(([v, label]) => (
                <button
                  key={v}
                  onClick={() => { setMorgue(v); saveMorgueExport(v); }}
                  aria-pressed={morgue === v}
                  className={`p-2 rounded border text-sm ${morgue === v ? "border-primary bg-primary/10" : "border-border"}`}
                >{label}</button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Google Drive saving isn't set up yet.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
