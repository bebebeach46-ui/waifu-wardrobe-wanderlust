import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Trophy, Skull, Clock, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Seo from "@/components/Seo";

type LeaderboardEntry = {
  id: string;
  username: string;
  value: number;
  metadata: any;
  updated_at: string;
};

const Leaderboard = () => {
  const navigate = useNavigate();
  const [deaths, setDeaths] = useState<LeaderboardEntry[]>([]);
  const [longestLife, setLongestLife] = useState<LeaderboardEntry[]>([]);
  const [bizarreEquipment, setBizarreEquipment] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboards();
  }, []);

  const loadLeaderboards = async () => {
    try {
      const [deathsData, longestData, bizarreData] = await Promise.all([
        supabase
          .from("leaderboards")
          .select("*")
          .eq("category", "most_deaths")
          .order("value", { ascending: false })
          .limit(10),
        supabase
          .from("leaderboards")
          .select("*")
          .eq("category", "longest_life")
          .order("value", { ascending: false })
          .limit(10),
        supabase
          .from("leaderboards")
          .select("*")
          .eq("category", "bizarre_equipment")
          .order("value", { ascending: false })
          .limit(10),
      ]);

      if (deathsData.data) setDeaths(deathsData.data);
      if (longestData.data) setLongestLife(longestData.data);
      if (bizarreData.data) setBizarreEquipment(bizarreData.data);
    } catch (error) {
      console.error("Error loading leaderboards:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderLeaderboard = (data: LeaderboardEntry[], icon: React.ReactNode, valueLabel: string) => (
    <div className="space-y-2">
      {data.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No entries yet. Be the first!</p>
      ) : (
        data.map((entry, index) => (
          <Card key={entry.id} className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                index === 1 ? 'bg-gray-400/20 text-gray-400' :
                index === 2 ? 'bg-orange-500/20 text-orange-500' :
                'bg-muted text-muted-foreground'
              }`}>
                {index + 1}
              </div>
              <div>
                <div className="font-semibold">{entry.username}</div>
                {entry.metadata && (
                  <div className="text-xs text-muted-foreground">
                    {entry.metadata.details}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {icon}
              <span className="font-bold">{entry.value} {valueLabel}</span>
            </div>
          </Card>
        ))
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading leaderboards...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Leaderboards
          </h1>
          <div className="w-10" />
        </div>

        <Tabs defaultValue="deaths" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="deaths">Most Deaths</TabsTrigger>
            <TabsTrigger value="longest">Longest Life</TabsTrigger>
            <TabsTrigger value="bizarre">Bizarre</TabsTrigger>
          </TabsList>

          <TabsContent value="deaths" className="mt-4">
            {renderLeaderboard(deaths, <Skull className="h-4 w-4 text-destructive" />, "deaths")}
          </TabsContent>

          <TabsContent value="longest" className="mt-4">
            {renderLeaderboard(longestLife, <Clock className="h-4 w-4 text-primary" />, "quests")}
          </TabsContent>

          <TabsContent value="bizarre" className="mt-4">
            {renderLeaderboard(bizarreEquipment, <Sparkles className="h-4 w-4 text-accent" />, "score")}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Leaderboard;
