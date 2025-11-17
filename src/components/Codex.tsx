import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Codex, getCodexStats } from "@/lib/codexSystem";
import { BookOpen, Users, Sword, Sparkles, Wrench, Skull, Calendar, Scroll } from "lucide-react";

interface CodexProps {
  codex: Codex;
  onClose: () => void;
}

export const CodexComponent = ({ codex, onClose }: CodexProps) => {
  const stats = getCodexStats(codex);

  const renderEntries = (entries: Record<string, any>) => {
    const sortedEntries = Object.values(entries).sort((a: any, b: any) => 
      b.firstDiscoveredAt - a.firstDiscoveredAt
    );

    if (sortedEntries.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p>No discoveries yet. Keep exploring!</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {sortedEntries.map((entry: any) => (
          <Card key={entry.id} className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{entry.name}</CardTitle>
                <Badge variant="outline" className="text-xs">
                  Seen {entry.discoveryCount}x
                </Badge>
              </div>
              <CardDescription className="text-sm">
                {entry.description}
              </CardDescription>
            </CardHeader>
            {entry.details && Object.keys(entry.details).length > 0 && (
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground space-y-1">
                  {Object.entries(entry.details).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-semibold capitalize">{key}: </span>
                      <span>{String(value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-background/95 z-50 p-4 overflow-hidden">
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                Discovery Codex
              </CardTitle>
              <CardDescription>
                Your unique collection of discovered wonders • {stats.total} total discoveries
              </CardDescription>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕ Close
            </button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <Tabs defaultValue="companions" className="h-full flex flex-col">
            <TabsList className="grid grid-cols-7 w-full">
              <TabsTrigger value="companions" className="text-xs">
                <Users className="w-4 h-4 mr-1" />
                Companions ({stats.companions})
              </TabsTrigger>
              <TabsTrigger value="items" className="text-xs">
                <Sword className="w-4 h-4 mr-1" />
                Items ({stats.items})
              </TabsTrigger>
              <TabsTrigger value="spells" className="text-xs">
                <Sparkles className="w-4 h-4 mr-1" />
                Spells ({stats.spells})
              </TabsTrigger>
              <TabsTrigger value="skills" className="text-xs">
                <Wrench className="w-4 h-4 mr-1" />
                Skills ({stats.skills})
              </TabsTrigger>
              <TabsTrigger value="monsters" className="text-xs">
                <Skull className="w-4 h-4 mr-1" />
                Monsters ({stats.monsters})
              </TabsTrigger>
              <TabsTrigger value="events" className="text-xs">
                <Calendar className="w-4 h-4 mr-1" />
                Events ({stats.events})
              </TabsTrigger>
              <TabsTrigger value="lore" className="text-xs">
                <Scroll className="w-4 h-4 mr-1" />
                Lore ({stats.lore})
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1 mt-4">
              <TabsContent value="companions" className="mt-0">
                {renderEntries(codex.companions)}
              </TabsContent>
              <TabsContent value="items" className="mt-0">
                {renderEntries(codex.items)}
              </TabsContent>
              <TabsContent value="spells" className="mt-0">
                {renderEntries(codex.spells)}
              </TabsContent>
              <TabsContent value="skills" className="mt-0">
                {renderEntries(codex.skills)}
              </TabsContent>
              <TabsContent value="monsters" className="mt-0">
                {renderEntries(codex.monsters)}
              </TabsContent>
              <TabsContent value="events" className="mt-0">
                {renderEntries(codex.events)}
              </TabsContent>
              <TabsContent value="lore" className="mt-0">
                {renderEntries(codex.lore)}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
