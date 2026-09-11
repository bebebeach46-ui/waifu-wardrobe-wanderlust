import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Seo from "@/components/Seo";
import { getBondColor } from "@/lib/companionBondBonuses";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, BookHeart, Save, Plus, Trash2, Search } from "lucide-react";

const NOTES_KEY = "quest-idle-journal-notes";
const ENTRIES_KEY = "quest-idle-journal-entries";

type Slot = { slot: number; data: any };

type Entry = {
  id: string;
  title: string;
  body: string;
  tag: string;
  createdAt: number;
  updatedAt: number;
};

const TAGS = ["General", "Quest", "Companion", "Enemy", "Place", "Item", "Theory", "Goal"];

const loadSlots = (): Slot[] => {
  const out: Slot[] = [];
  for (const slot of [1, 2, 3]) {
    const raw = localStorage.getItem(`quest-idle-slot-${slot}`);
    if (!raw) continue;
    try {
      out.push({ slot, data: JSON.parse(raw) });
    } catch {
      /* corrupted slot — skip */
    }
  }
  return out;
};

const loadNotes = (): Record<string, string> => {
  try {
    return JSON.parse(localStorage.getItem(NOTES_KEY) || "{}");
  } catch {
    return {};
  }
};

const loadEntries = (): Entry[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(ENTRIES_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const Journal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [slots] = useState<Slot[]>(() => loadSlots());
  const [activeSlot, setActiveSlot] = useState<number | null>(slots[0]?.slot ?? null);
  const [notes, setNotes] = useState<Record<string, string>>(() => loadNotes());
  const [selected, setSelected] = useState<string | null>(null);

  // Free-form adventure entries
  const [entries, setEntries] = useState<Entry[]>(() => loadEntries());
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [draftTag, setDraftTag] = useState("General");
  const [search, setSearch] = useState("");

  const save = useMemo(() => slots.find((s) => s.slot === activeSlot)?.data, [slots, activeSlot]);

  const companions: any[] = useMemo(() => {
    if (!save) return [];
    const active = (save.companions || []).map((c: any) => ({ ...c, roster: "Active" }));
    const reserve = (save.reserveCompanions || []).map((c: any) => ({ ...c, roster: "Reserve" }));
    return [...active, ...reserve];
  }, [save]);

  useEffect(() => {
    if (companions.length && !companions.some((c) => c.name === selected)) {
      setSelected(companions[0].name);
    }
  }, [companions, selected]);

  const current = companions.find((c) => c.name === selected);
  const noteKey = `${activeSlot}:${selected}`;

  const gameLog = useMemo(() => {
    if (!save || !selected) return [] as string[];
    const first = selected.split(" ")[0];
    const mentions = (text: string) => text.includes(selected) || (first.length > 2 && text.includes(first));

    const fromActivities = (save.activities || [])
      .filter((a: any) => typeof a?.description === "string" && mentions(a.description))
      .map((a: any) => a.description);

    const diary = Array.isArray(save.romanceDiary) ? save.romanceDiary : [];
    const fromDiary = diary
      .map((d: any) => (typeof d === "string" ? d : d?.text || d?.description || ""))
      .filter((t: string) => t && mentions(t));

    const fromEvents = (save.eventLog || [])
      .map((e: any) => (typeof e === "string" ? e : e?.text || ""))
      .filter((t: string) => t && mentions(t));

    return [...fromDiary, ...fromActivities, ...fromEvents].slice(0, 60);
  }, [save, selected]);

  const persist = (next: Record<string, string>) => {
    setNotes(next);
    localStorage.setItem(NOTES_KEY, JSON.stringify(next));
  };

  const handleChange = (value: string) => {
    persist({ ...notes, [noteKey]: value });
  };

  const persistEntries = (next: Entry[]) => {
    setEntries(next);
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(next));
  };

  const addEntry = () => {
    if (!draftTitle.trim() && !draftBody.trim()) {
      toast({ title: "Nothing to write", description: "Add a title or a few words first." });
      return;
    }
    const now = Date.now();
    const entry: Entry = {
      id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
      title: draftTitle.trim() || "Untitled entry",
      body: draftBody.trim(),
      tag: draftTag,
      createdAt: now,
      updatedAt: now,
    };
    persistEntries([entry, ...entries]);
    setDraftTitle("");
    setDraftBody("");
    toast({ title: "Entry written", description: entry.title });
  };

  const updateEntry = (id: string, patch: Partial<Entry>) => {
    persistEntries(entries.map((e) => (e.id === id ? { ...e, ...patch, updatedAt: Date.now() } : e)));
  };

  const removeEntry = (id: string) => {
    persistEntries(entries.filter((e) => e.id !== id));
    toast({ title: "Entry removed" });
  };

  const visibleEntries = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.body.toLowerCase().includes(q) ||
        e.tag.toLowerCase().includes(q)
    );
  }, [entries, search]);

  const bond = current?.relationship ?? 0;
  const bondStyle = getBondColor(bond);

  return (
    <div className="min-h-screen bg-background p-4">
      <Seo
        title="Adventure Journal — Notes on Your Whole Run"
        description="Write free-form notes on quests, places, enemies and companions, and read them beside the in-game adventure log."
        path="/journal"
      />
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} aria-label="Back to menu">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <BookHeart className="w-6 h-6" /> Adventure Journal
          </h1>
        </div>

        <Tabs defaultValue="entries">
          <TabsList className="w-full">
            <TabsTrigger value="entries" className="flex-1 text-xs">
              📓 Journal
            </TabsTrigger>
            <TabsTrigger value="bonds" className="flex-1 text-xs">
              💞 Bonds
            </TabsTrigger>
          </TabsList>

          {/* ---------------- Free-form journal ---------------- */}
          <TabsContent value="entries" className="space-y-4 mt-4">
            <Card className="p-4 space-y-3">
              <p className="text-[10px] uppercase text-muted-foreground">New entry</p>
              <Input
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                placeholder="Title — a battle, a rumour, a plan..."
                className="text-sm"
              />
              <div className="flex flex-wrap gap-1">
                {TAGS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setDraftTag(t)}
                    className={`text-[10px] px-2 py-1 rounded border transition-colors ${
                      draftTag === t ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <Textarea
                value={draftBody}
                onChange={(e) => setDraftBody(e.target.value)}
                placeholder="Write anything: what happened, what you suspect, what you plan next..."
                className="min-h-28 text-sm"
              />
              <Button size="sm" className="w-full" onClick={addEntry}>
                <Plus className="w-3 h-3 mr-1" /> Add entry
              </Button>
            </Card>

            <div className="relative">
              <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your journal"
                className="pl-7 text-sm"
              />
            </div>

            {visibleEntries.length === 0 ? (
              <Card className="p-6 text-center text-sm text-muted-foreground">
                {entries.length === 0
                  ? "Your journal is empty. Write the first page of your legend."
                  : "No entries match that search."}
              </Card>
            ) : (
              <div className="space-y-3">
                {visibleEntries.map((e) => (
                  <Card key={e.id} className="p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <Input
                        value={e.title}
                        onChange={(ev) => updateEntry(e.id, { title: ev.target.value })}
                        className="text-sm font-semibold h-8 border-transparent px-1 focus-visible:border-input"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Delete entry"
                        onClick={() => removeEntry(e.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">
                        {e.tag}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(e.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <Textarea
                      value={e.body}
                      onChange={(ev) => updateEntry(e.id, { body: ev.target.value })}
                      className="min-h-20 text-sm"
                    />
                  </Card>
                ))}
              </div>
            )}
            <p className="text-[10px] text-muted-foreground text-center">Everything you write is saved automatically.</p>
          </TabsContent>

          {/* ---------------- Companion bonds ---------------- */}
          <TabsContent value="bonds" className="space-y-4 mt-4">
            {slots.length === 0 && (
              <Card className="p-6 text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  No adventures saved yet. Start one and your companions will appear here.
                </p>
                <Button onClick={() => navigate("/")}>Back to menu</Button>
              </Card>
            )}

            {slots.length > 0 && (
              <>
                {slots.length > 1 && (
                  <Tabs value={String(activeSlot)} onValueChange={(v) => setActiveSlot(Number(v))}>
                    <TabsList className="w-full">
                      {slots.map((s) => (
                        <TabsTrigger key={s.slot} value={String(s.slot)} className="flex-1 text-xs">
                          {s.data.characterName || `Slot ${s.slot}`}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                )}

                {companions.length === 0 ? (
                  <Card className="p-6 text-center text-sm text-muted-foreground">
                    This adventurer travels alone so far — no companions to write about yet.
                  </Card>
                ) : (
                  <>
                    <Card className="p-3">
                      <p className="text-[10px] uppercase text-muted-foreground mb-2">Companions</p>
                      <div className="flex flex-wrap gap-2">
                        {companions.map((c) => {
                          const style = getBondColor(c.relationship ?? 0);
                          const isSel = c.name === selected;
                          return (
                            <button
                              key={`${c.roster}-${c.name}`}
                              onClick={() => setSelected(c.name)}
                              className={`text-xs px-2 py-1 rounded border transition-colors ${
                                isSel ? "border-primary bg-primary/10" : "border-border hover:bg-muted"
                              }`}
                              style={{ color: style.color }}
                            >
                              {c.name} ({(c.relationship ?? 0) > 0 ? "+" : ""}
                              {Math.round(c.relationship ?? 0)})
                            </button>
                          );
                        })}
                      </div>
                    </Card>

                    {current && (
                      <Card className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h2 className="text-lg font-bold" style={{ color: bondStyle.color }}>
                              {current.name}
                            </h2>
                            <p className="text-xs text-muted-foreground">
                              {current.race}
                              {current.class ? ` • ${current.class}` : ""}
                            </p>
                          </div>
                          <div className="text-right space-y-1">
                            <Badge variant="outline" style={{ color: bondStyle.color, borderColor: bondStyle.color }}>
                              Bond {bond > 0 ? "+" : ""}
                              {Math.round(bond)}
                            </Badge>
                            <p className="text-[10px] text-muted-foreground">{current.roster}</p>
                          </div>
                        </div>
                        {current.relationshipName && (
                          <p className="text-xs" style={{ color: bondStyle.color }}>
                            {current.relationshipName}
                          </p>
                        )}

                        <div>
                          <p className="text-[10px] uppercase text-muted-foreground mb-1">Your notes</p>
                          <Textarea
                            value={notes[noteKey] || ""}
                            onChange={(e) => handleChange(e.target.value)}
                            placeholder={`What do you make of ${current.name}? Hopes, suspicions, promises...`}
                            className="min-h-32 text-sm"
                          />
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-[10px] text-muted-foreground">Saved automatically as you type.</p>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() =>
                                toast({ title: "Journal saved", description: `Your notes on ${current.name} are kept.` })
                              }
                            >
                              <Save className="w-3 h-3 mr-1" /> Save
                            </Button>
                          </div>
                        </div>

                        <div>
                          <p className="text-[10px] uppercase text-muted-foreground mb-1">In-game log</p>
                          <ScrollArea className="h-48 rounded bg-muted p-2">
                            {gameLog.length === 0 ? (
                              <p className="text-xs text-muted-foreground italic">
                                Nothing recorded about {current.name} yet.
                              </p>
                            ) : (
                              <div className="space-y-1">
                                {gameLog.map((line, i) => (
                                  <p key={i} className="text-xs">
                                    • {line}
                                  </p>
                                ))}
                              </div>
                            )}
                          </ScrollArea>
                        </div>
                      </Card>
                    )}
                  </>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Journal;
