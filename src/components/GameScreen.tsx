import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Save, Heart, Skull, Sparkles, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateCharacter } from "@/lib/characterGenerator";
import { generateQuest } from "@/lib/questGenerator";
import { generateCompanion, getRelationshipName } from "@/lib/companionGenerator";
import { generateShopName } from "@/lib/skillGenerator";
import { generateSummon } from "@/lib/summonGenerator";
import { getRandomStatusEffect, removeRandomStatusEffect, StatusEffect } from "@/lib/statusEffectGenerator";
import { generateEventLog } from "@/lib/eventLogGenerator";

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
  const [companions, setCompanions] = useState<any[]>([]);
  const [treasure, setTreasure] = useState(0);
  const [shopName] = useState(generateShopName());
  const [isDead, setIsDead] = useState(false);
  const [deathLog, setDeathLog] = useState("");
  const [hasOffspring, setHasOffspring] = useState(false);
  const [offspringData, setOffspringData] = useState<any>(null);
  const [married, setMarried] = useState<any>(null);
  const [statusEffects, setStatusEffects] = useState<StatusEffect[]>([]);
  const [summons, setSummons] = useState<any[]>([]);
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [stats, setStats] = useState({
    level: 1,
    exp: 0,
    expToNext: 100,
    gold: 0,
    questsCompleted: 0,
    enemiesDefeated: 0,
    treasureFound: 0,
    shards: 0,
    generation: 1
  });

  // Event log generator (every 2-3 minutes)
  useEffect(() => {
    if (isDead) return;
    
    const eventInterval = setInterval(() => {
      const newEvent = generateEventLog();
      setEventLog(prev => [newEvent, ...prev].slice(0, 10)); // Keep last 10 events
    }, Math.random() * 60000 + 120000); // 2-3 minutes
    
    return () => clearInterval(eventInterval);
  }, [isDead]);

  useEffect(() => {
    if (isDead) return;
    
    const interval = setInterval(() => {
      setQuestProgress((prev) => {
        if (prev >= 100) {
          // Random death chance (1% per quest)
          if (Math.random() < 0.01) {
            handleDeath();
            return prev;
          }
          
          const treasureFound = Math.floor(Math.random() * 50) + 10;
          const enemiesKilled = Math.floor(Math.random() * 5) + 1;
          const shardsFound = Math.random() < 0.3 ? Math.floor(Math.random() * 5) + 1 : 0;
          
          setTreasure(t => t + treasureFound);
          
          // Random shop visit (20% chance)
          const shouldVisitShop = Math.random() < 0.2 && treasure > 50;
          let goldGained = currentQuest.goldReward;
          
          if (shouldVisitShop) {
            goldGained += treasure;
            setTreasure(0);
            toast({
              title: `Visited ${shopName}`,
              description: `Sold treasure for ${treasure} gold!`
            });
            
            // Random equipment upgrade (50% chance when at shop)
            if (Math.random() < 0.5) {
              const slots = Object.keys(character.equipment);
              const slot = slots[Math.floor(Math.random() * slots.length)];
              setCharacter(c => ({
                ...c,
                equipment: {
                  ...c.equipment,
                  [slot]: `Enhanced ${c.equipment[slot]}`
                }
              }));
              toast({
                title: "Equipment Upgraded!",
                description: `Upgraded ${slot}!`
              });
            }
          }
          
          // Random companion encounter (10% chance)
          if (Math.random() < 0.1 && companions.length < 5) {
            const newCompanion = generateCompanion(worldData);
            setCompanions(c => [...c, newCompanion]);
            toast({
              title: "New Companion!",
              description: `${newCompanion.name} joined your party!`
            });
          }
          
          // Update companion relationships and check for marriage
          setCompanions(comps => comps.map(comp => {
            const newRel = Math.min(10, comp.relationship + (Math.random() * comp.progressionRate));
            const oldName = getRelationshipName(comp.relationship);
            const newName = getRelationshipName(newRel);
            
            if (oldName !== newName) {
              toast({
                title: `${comp.name} relationship increased!`,
                description: `Now ${newName}`
              });
            }
            
            // Marriage proposal at max relationship
            if (newRel >= 10 && !married && comp.relationship < 10) {
              setMarried(comp);
              toast({
                title: "💍 Marriage!",
                description: `${comp.name} and ${character.name} are now married!`
              });
              // Generate offspring
              const childGender = Math.random() < 0.5 ? "Male" : "Female";
              const childName = childGender === "Male" ? 
                ["Aldrin Jr.", "Rex II", "Storm Jr.", "Ash II"][Math.floor(Math.random() * 4)] :
                ["Nova Jr.", "Kira II", "Raven Jr.", "Vex II"][Math.floor(Math.random() * 4)];
              setOffspringData({
                name: childName,
                gender: childGender,
                parent1: character.name,
                parent2: comp.name
              });
              setHasOffspring(true);
            }
            
            return {
              ...comp,
              relationship: newRel,
              relationshipName: newName
            };
          }));
          
          // Random status effects (20% chance to add, 15% to remove)
          if (Math.random() < 0.2) {
            const newEffect = getRandomStatusEffect();
            setStatusEffects(prev => {
              if (prev.find(e => e.name === newEffect.name)) return prev;
              return [...prev, newEffect];
            });
            toast({
              title: `${newEffect.icon} ${newEffect.name}!`,
              description: newEffect.description
            });
          }
          if (Math.random() < 0.15 && statusEffects.length > 0) {
            const removed = statusEffects[Math.floor(Math.random() * statusEffects.length)];
            setStatusEffects(prev => prev.filter(e => e.name !== removed.name));
            toast({
              title: `${removed.name} wore off`,
              description: "Effect removed"
            });
          }
          
          // Shard collection and summon
          if (shardsFound > 0) {
            toast({
              title: "✨ Shards Found!",
              description: `Collected ${shardsFound} shard${shardsFound > 1 ? 's' : ''}!`
            });
          }
          
          setStats((s) => {
            const newExp = s.exp + currentQuest.expReward;
            const levelUp = newExp >= s.expToNext;
            const newShards = s.shards + shardsFound;
            
            // Check for summon (every 100 shards)
            if (newShards >= 100) {
              const newSummon = generateSummon();
              setSummons(prev => [...prev, newSummon]);
              toast({
                title: "🌟 SUMMON ACQUIRED!",
                description: newSummon.name,
                duration: 5000
              });
              return {
                level: levelUp ? s.level + 1 : s.level,
                exp: levelUp ? newExp - s.expToNext : newExp,
                expToNext: levelUp ? s.expToNext + 50 : s.expToNext,
                gold: s.gold + goldGained,
                questsCompleted: s.questsCompleted + 1,
                enemiesDefeated: s.enemiesDefeated + enemiesKilled,
                treasureFound: s.treasureFound + treasureFound,
                shards: newShards - 100,
                generation: s.generation
              };
            }
            
            return {
              level: levelUp ? s.level + 1 : s.level,
              exp: levelUp ? newExp - s.expToNext : newExp,
              expToNext: levelUp ? s.expToNext + 50 : s.expToNext,
              gold: s.gold + goldGained,
              questsCompleted: s.questsCompleted + 1,
              enemiesDefeated: s.enemiesDefeated + enemiesKilled,
              treasureFound: s.treasureFound + treasureFound,
              shards: newShards,
              generation: s.generation
            };
          });
          setCurrentQuest(generateQuest(worldData, stats.level));
          return 0;
        }
        return prev + (100 / currentQuest.duration);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentQuest, worldData, stats.level, treasure, companions, isDead, shopName, character.equipment, toast, married, statusEffects]);

  const handleDeath = () => {
    setIsDead(true);
    const log = generateDeathLog();
    setDeathLog(log);
    
    // Download log file
    const blob = new Blob([log], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${character.name}_death_log.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "You Died!",
      description: "Death log downloaded",
      variant: "destructive"
    });
  };
  
  const generateDeathLog = () => {
    const companionList = companions.length > 0 
      ? companions.map(c => `  - ${c.name} (${c.relationshipName}, ${c.race} ${c.class})`).join('\n')
      : '  None';
    
    const summonList = summons.length > 0
      ? summons.map(s => `  - ${s.name} (Power: ${s.power})`).join('\n')
      : '  None';
    
    const statusList = statusEffects.length > 0
      ? statusEffects.map(e => `  - ${e.icon} ${e.name}: ${e.description}`).join('\n')
      : '  None';
    
    const marriageInfo = married ? `\nMarriage:\n  Spouse: ${married.name}\n  Offspring: ${hasOffspring ? offspringData.name : 'None'}` : '';
    
    return `═══════════════════════════════════════════════════════════
QUEST IDLE - DEATH LOG
═══════════════════════════════════════════════════════════

Character: ${character.name}
Gender: ${character.gender}
Race: ${character.race}
Class: ${character.class}
Generation: ${stats.generation}${marriageInfo}

Final Level: ${stats.level}
Final Stats:
  STR: ${character.stats.str}  CON: ${character.stats.con}  DEX: ${character.stats.dex}
  AGI: ${character.stats.agi}  WIS: ${character.stats.wis}  CHA: ${character.stats.cha}

Achievements:
  Quests Completed: ${stats.questsCompleted}
  Enemies Defeated: ${stats.enemiesDefeated}
  Gold Earned: ${stats.gold}
  Treasure Found: ${stats.treasureFound}
  Shards Collected: ${stats.shards}

Equipment:
  Weapon: ${character.equipment.weapon}
  Armor: ${character.equipment.armor}
  Accessory: ${character.equipment.accessory}

Physical Skills:
${character.skills.map((s: string) => `  - ${s}`).join('\n')}

Magic Spells:
${character.spells.map((s: string) => `  - ${s}`).join('\n')}

Active Status Effects:
${statusList}

Companions:
${companionList}

Summons:
${summonList}

World Information:
  Name: ${worldData.name}
  Timeline: ${worldData.timeline}
  Terrain: ${worldData.terrain}
  Main Faction: ${worldData.mainFaction}

Last Quest: ${currentQuest.name}

Death occurred at: ${new Date().toLocaleString()}

"The adventure ends, but the legend lives on..."
═══════════════════════════════════════════════════════════`;
  };

  const handleSave = () => {
    const saveData = {
      character,
      stats,
      worldData,
      companions,
      treasure,
      married,
      hasOffspring,
      offspringData,
      statusEffects,
      summons,
      eventLog,
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
  
  const handleContinueAsOffspring = () => {
    const childCharacter = generateCharacter(worldData);
    childCharacter.name = offspringData.name;
    childCharacter.gender = offspringData.gender;
    
    // Start fresh but keep generation count
    setCharacter(childCharacter);
    setStats({
      level: 1,
      exp: 0,
      expToNext: 100,
      gold: 0,
      questsCompleted: 0,
      enemiesDefeated: 0,
      treasureFound: 0,
      shards: 0,
      generation: stats.generation + 1
    });
    setCompanions([]);
    setTreasure(0);
    setMarried(null);
    setHasOffspring(false);
    setOffspringData(null);
    setStatusEffects([]);
    setSummons([]);
    setEventLog([]);
    setCurrentQuest(generateQuest(worldData, 1));
    setQuestProgress(0);
    setIsDead(false);
    setDeathLog("");
    
    toast({
      title: "A New Generation Begins",
      description: `Playing as ${offspringData.name}, Generation ${stats.generation + 1}`
    });
  };
  
  if (isDead) {
    return (
      <Card className="p-8 space-y-4 text-center">
        <Skull className="w-16 h-16 mx-auto text-destructive" />
        <h2 className="text-2xl font-bold text-destructive">Game Over</h2>
        <p className="text-muted-foreground">Your death log has been downloaded.</p>
        <pre className="text-xs text-left bg-muted p-4 rounded max-h-[60vh] overflow-y-auto whitespace-pre-wrap">
          {deathLog}
        </pre>
        <div className="flex gap-2 justify-center">
          {hasOffspring && (
            <Button onClick={handleContinueAsOffspring} variant="default">
              Continue as {offspringData.name}
            </Button>
          )}
          <Button onClick={onBack} variant={hasOffspring ? "outline" : "default"}>
            Return to Menu
          </Button>
        </div>
      </Card>
    );
  }

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

      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="bg-muted p-2 rounded">
          <div className="text-muted-foreground">Gold</div>
          <div className="font-bold text-accent">{stats.gold}</div>
        </div>
        <div className="bg-muted p-2 rounded">
          <div className="text-muted-foreground">Quests</div>
          <div className="font-bold text-primary">{stats.questsCompleted}</div>
        </div>
        <div className="bg-muted p-2 rounded">
          <div className="text-muted-foreground">Shards</div>
          <div className="font-bold text-primary">{stats.shards}/100</div>
        </div>
      </div>
      
      {stats.generation > 1 && (
        <div className="text-xs text-center text-muted-foreground">
          Generation {stats.generation}
        </div>
      )}

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
        <div className="text-sm font-semibold">Stats (Flavor)</div>
        <div className="grid grid-cols-3 gap-1 text-xs">
          <div className="bg-muted p-1 rounded">STR: {character.stats.str}</div>
          <div className="bg-muted p-1 rounded">CON: {character.stats.con}</div>
          <div className="bg-muted p-1 rounded">DEX: {character.stats.dex}</div>
          <div className="bg-muted p-1 rounded">AGI: {character.stats.agi}</div>
          <div className="bg-muted p-1 rounded">WIS: {character.stats.wis}</div>
          <div className="bg-muted p-1 rounded">CHA: {character.stats.cha}</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-semibold">Physical Skills</div>
        <div className="flex flex-wrap gap-1">
          {character.skills.map((skill: string) => (
            <span key={skill} className="bg-primary/20 text-primary px-2 py-1 rounded text-xs">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-semibold">Magic Spells</div>
        <div className="flex flex-wrap gap-1">
          {character.spells.map((spell: string) => (
            <span key={spell} className="bg-accent/20 text-accent px-2 py-1 rounded text-xs">
              {spell}
            </span>
          ))}
        </div>
      </div>

      {companions.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-semibold flex items-center gap-1">
            <Heart className="w-4 h-4" /> Companions
          </div>
          <div className="space-y-2">
            {companions.map((comp, i) => (
              <div key={i} className="bg-muted p-2 rounded space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-sm">{comp.name}</div>
                    <div className="text-xs text-muted-foreground">{comp.description}</div>
                  </div>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                    {comp.relationshipName} ({Math.floor(comp.relationship)}/10)
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Likes: {comp.preferences.join(', ')}
                </div>
                <Progress value={(comp.relationship / 10) * 100} className="h-1" />
              </div>
            ))}
          </div>
        </div>
      )}

      {statusEffects.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-semibold flex items-center gap-1">
            <Shield className="w-4 h-4" /> Status Effects
          </div>
          <div className="flex flex-wrap gap-1">
            {statusEffects.map((effect, i) => (
              <span 
                key={i} 
                className={`px-2 py-1 rounded text-xs ${
                  effect.type === 'good' 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-destructive/20 text-destructive'
                }`}
                title={effect.description}
              >
                {effect.icon} {effect.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {summons.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-semibold flex items-center gap-1">
            <Sparkles className="w-4 h-4" /> Summons
          </div>
          <div className="space-y-2">
            {summons.map((summon, i) => (
              <div key={i} className="bg-gradient-to-r from-primary/20 to-accent/20 p-2 rounded">
                <div className="font-bold text-sm">{summon.name}</div>
                <div className="text-xs text-muted-foreground">{summon.description}</div>
                <div className="text-xs text-accent mt-1">
                  {summon.ability} (Power: {summon.power})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {married && (
        <div className="bg-primary/10 p-2 rounded">
          <div className="text-xs text-muted-foreground">💍 Married to</div>
          <div className="font-medium text-sm">{married.name}</div>
          {hasOffspring && (
            <div className="text-xs text-primary mt-1">
              Child: {offspringData.name} ({offspringData.gender})
            </div>
          )}
        </div>
      )}

      {eventLog.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-semibold">Recent Events</div>
          <div className="bg-muted p-2 rounded space-y-1 max-h-32 overflow-y-auto">
            {eventLog.map((event, i) => (
              <div key={i} className="text-xs text-muted-foreground">
                • {event}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-muted p-2 rounded">
        <div className="text-xs text-muted-foreground">Favorite Shop</div>
        <div className="font-medium text-sm">{shopName}</div>
        <div className="text-xs text-accent mt-1">Treasure: {treasure} gold worth</div>
      </div>
    </Card>
  );
};

export default GameScreen;
