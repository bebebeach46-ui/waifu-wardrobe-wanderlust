import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Save, Heart, Skull, Sparkles, Shield, Cloud, Hammer, TrendingUp, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateCharacter } from "@/lib/characterGenerator";
import { generateQuest } from "@/lib/questGenerator";
import { generateCompanion, getRelationshipName } from "@/lib/companionGenerator";
import { generateShopName } from "@/lib/skillGenerator";
import { generateSummon } from "@/lib/summonGenerator";
import { getRandomStatusEffect, StatusEffect } from "@/lib/statusEffectGenerator";
import { generateEventLog } from "@/lib/eventLogGenerator";
import { generateDeity, getRandomAlignment, shiftAlignment, getAlignmentCompatibility, Alignment } from "@/lib/deityGenerator";
import { getRandomWeather, weatherRequiresRest, Weather } from "@/lib/weatherGenerator";
import { getRandomGatheringActivity, getRandomCraftingActivity, shouldGatherMaterials, shouldCraft, Material } from "@/lib/materialsGenerator";
import { generateRankedSkills, gainSkillExperience, RankedSkill } from "@/lib/skillRankGenerator";
import { checkEarlyDeath, checkRichRetirement, checkLegendaryFate, getNormalDeath } from "@/lib/fateGenerator";
import { trackActivity, trackMonsterKill, generateActivitySummary, generateMonstersKilledLog, ActivityLog, MonsterKill } from "@/lib/activityTracker";
import { getMonsterByRank, rollForShard, getShardsNeededForSummon, canSummon } from "@/lib/monsterRankSystem";

interface GameScreenProps {
  worldData: any;
  saveSlot: number;
  onBack: () => void;
}

const GameScreen = ({ worldData, saveSlot, onBack }: GameScreenProps) => {
  const { toast } = useToast();
  
  // Load save data if it exists
  const loadSaveData = () => {
    const saveData = localStorage.getItem(`quest-idle-slot-${saveSlot}`);
    if (saveData) {
      try {
        return JSON.parse(saveData);
      } catch (e) {
        console.error("Failed to load save data:", e);
        return null;
      }
    }
    return null;
  };
  
  const savedData = loadSaveData();
  
  const [character, setCharacter] = useState(() => savedData?.character || generateCharacter(worldData));
  const [currentQuest, setCurrentQuest] = useState(() => savedData?.currentQuest || generateQuest(worldData, 1));
  const [questProgress, setQuestProgress] = useState(0);
  const [companions, setCompanions] = useState<any[]>(() => savedData?.companions || []);
  const [treasure, setTreasure] = useState(savedData?.treasure || 0);
  const [shopName] = useState(savedData?.shopName || generateShopName());
  const [isDead, setIsDead] = useState(false);
  const [deathLog, setDeathLog] = useState("");
  const [hasOffspring, setHasOffspring] = useState(savedData?.hasOffspring || false);
  const [offspringData, setOffspringData] = useState<any>(savedData?.offspringData || null);
  const [married, setMarried] = useState<any>(savedData?.married || null);
  const [statusEffects, setStatusEffects] = useState<StatusEffect[]>(() => savedData?.statusEffects || []);
  const [summons, setSummons] = useState<any[]>(() => savedData?.summons || []);
  const [eventLog, setEventLog] = useState<string[]>(() => savedData?.eventLog || []);
  const [deity, setDeity] = useState(() => savedData?.deity || generateDeity());
  const [alignment, setAlignment] = useState<Alignment>(() => savedData?.alignment || getRandomAlignment());
  const [weather, setWeather] = useState<Weather>(() => savedData?.weather || getRandomWeather());
  const [materials, setMaterials] = useState<Material[]>(() => savedData?.materials || []);
  const [lifeSkills, setLifeSkills] = useState<RankedSkill[]>(() => savedData?.lifeSkills || generateRankedSkills(3));
  const [activities, setActivities] = useState<ActivityLog[]>(() => savedData?.activities || []);
  const [monstersKilled, setMonstersKilled] = useState<MonsterKill[]>(() => savedData?.monstersKilled || []);
  const [fateOutcome, setFateOutcome] = useState<any>(null);
  const [stats, setStats] = useState(savedData?.stats || {
    level: 1,
    exp: 0,
    expToNext: 100,
    gold: 0,
    questsCompleted: 0,
    enemiesDefeated: 0,
    treasureFound: 0,
    shards: 0,
    generation: 1,
    totalDeaths: 0
  });

  // Event log generator (every 2 minutes for deep immersion)
  useEffect(() => {
    if (isDead) return;
    
    const eventInterval = setInterval(() => {
      const newEvent = generateEventLog();
      setEventLog(prev => [newEvent, ...prev].slice(0, 10)); // Keep last 10 events
    }, 120000); // 2 minutes
    
    return () => clearInterval(eventInterval);
  }, [isDead]);

  useEffect(() => {
    if (isDead) return;
    
    const interval = setInterval(() => {
      setQuestProgress((prev) => {
        if (prev >= 100) {
          // Check for special fates
          const earlyDeath = checkEarlyDeath(stats.questsCompleted);
          const richRetirement = checkRichRetirement(stats.gold, stats.questsCompleted);
          const legendaryFate = checkLegendaryFate(stats.level, stats.questsCompleted);
          
          if (earlyDeath || richRetirement || legendaryFate) {
            const fate = earlyDeath || richRetirement || legendaryFate;
            setFateOutcome(fate);
            handleDeath();
            return prev;
          }
          
          // Random normal death chance (1% per quest)
          if (Math.random() < 0.01) {
            const normalDeath = getNormalDeath();
            handleDeath();
            return prev;
          }
          
          // Generate monster with rank system
          const monster = getMonsterByRank(stats.level);
          const monsterName = monster.name;
          
          // Track combat and quest in activities
          setMonstersKilled(prev => trackMonsterKill(prev, monsterName, monster.rank.rank));
          setActivities(prev => trackActivity(prev, "combat", `Defeated Rank ${monster.rank.rank} ${monsterName} in ${currentQuest.name}`));
          
          // Roll for shard drop (only rank 5+)
          const shardDropped = rollForShard(monster.rank) ? 1 : 0;
          if (shardDropped > 0) {
            toast({
              title: "✨ RARE SHARD DROPPED!",
              description: `A shard dropped from the Rank ${monster.rank.rank} ${monster.rank.name}!`,
              duration: 5000
            });
          }
          
          // Calculate rewards with rank multipliers
          const treasureFound = Math.floor((Math.random() * 50 + 10) * monster.rank.goldMultiplier);
          const enemiesKilled = Math.floor(Math.random() * 5) + 1;
          
          // Weather changes
          if (Math.random() < 0.2) {
            const newWeather = getRandomWeather();
            setWeather(newWeather);
            setActivities(prev => trackActivity(prev, "event", `Weather changed to ${newWeather.name}`));
          }
          
          // Materials gathering
          if (shouldGatherMaterials()) {
            const gathering = getRandomGatheringActivity();
            setMaterials(prev => {
              const existing = prev.find(m => m.name === gathering.material);
              if (existing) {
                return prev.map(m => m.name === gathering.material ? {...m, amount: m.amount + gathering.amount} : m);
              }
              return [...prev, {name: gathering.material, amount: gathering.amount}];
            });
            setActivities(prev => trackActivity(prev, "gather", gathering.description));
            
            // Gain skill experience
            const skillName = gathering.action.includes("Fish") ? "Fishing" : 
                            gathering.action.includes("Mine") ? "Mining" :
                            gathering.action.includes("Chop") ? "Carpentry" : "Herbalism";
            setLifeSkills(prev => prev.map(s => s.name === skillName ? gainSkillExperience(s, 10) : s));
          }
          
          // Alignment shifts
          if (Math.random() < 0.15) {
            const newAlignment = shiftAlignment(alignment);
            if (newAlignment !== alignment) {
              setAlignment(newAlignment);
              setActivities(prev => trackActivity(prev, "event", `Alignment shifted to ${newAlignment}`));
            }
          }
          
          // Deity favor changes
          if (Math.random() < 0.2) {
            const favorChange = Math.random() < 0.5 ? 5 : -5;
            setDeity(prev => ({...prev, favor: Math.max(0, Math.min(100, prev.favor + favorChange))}));
          }
          
          
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
                description: <span className="text-stat-gain">{newCompanion.name} joined your party!</span>
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
                description: <span className="text-stat-gain">Now {newName}</span>
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
          
          setStats((s) => {
            const newExp = s.exp + Math.floor(currentQuest.expReward * monster.rank.expMultiplier);
            const levelUp = newExp >= s.expToNext;
            const newShards = s.shards + shardDropped;
            
            if (levelUp) {
              toast({
                title: "Level Up!",
                description: <span className="text-stat-gain">Now Level {s.level + 1}</span>
              });
            }
            
            // Check for summon (every 10000 shards - extremely rare!)
            if (canSummon(newShards)) {
              const newSummon = generateSummon();
              setSummons(prev => [...prev, newSummon]);
              toast({
                title: "🌟 LEGENDARY SUMMON ACQUIRED!",
                description: `${newSummon.name} - You collected 10,000 shards!`,
                duration: 10000
              });
              return {
                level: levelUp ? s.level + 1 : s.level,
                exp: levelUp ? newExp - s.expToNext : newExp,
                expToNext: levelUp ? s.expToNext + 50 : s.expToNext,
                gold: s.gold + goldGained,
                questsCompleted: s.questsCompleted + 1,
                enemiesDefeated: s.enemiesDefeated + enemiesKilled,
                treasureFound: s.treasureFound + treasureFound,
                shards: newShards - getShardsNeededForSummon(),
                generation: s.generation,
                totalDeaths: s.totalDeaths
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
              generation: s.generation,
              totalDeaths: s.totalDeaths
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
      ? companions.map(c => `  - ${c.name} (${c.relationshipName}, ${c.race} ${c.class}, Alignment: ${c.alignment})`).join('\n')
      : '  None';
    
    const summonList = summons.length > 0
      ? summons.map(s => `  - ${s.name} (Power: ${s.power})`).join('\n')
      : '  None';
    
    const statusList = statusEffects.length > 0
      ? statusEffects.map(e => `  - ${e.icon} ${e.name}: ${e.description}`).join('\n')
      : '  None';
    
    const skillsList = lifeSkills.map(s => `  - ${s.name} (${s.rank}, ${s.experience} exp)`).join('\n');
    
    const materialsList = materials.length > 0
      ? materials.map(m => `  - ${m.name}: ${m.amount}`).join('\n')
      : '  None';
    
    const marriageInfo = married ? `\nMarriage:\n  Spouse: ${married.name} (Alignment: ${married.alignment})\n  Offspring: ${hasOffspring ? offspringData.name : 'None'}` : '';
    
    const fateDesc = fateOutcome ? `\n\nFate: ${fateOutcome.description}` : '';
    
    return `═══════════════════════════════════════════════════════════
QUEST IDLE - DEATH LOG
═══════════════════════════════════════════════════════════

Character: ${character.name}
Gender: ${character.gender}
Race: ${character.race}
Class: ${character.class}
Alignment: ${alignment}
Generation: ${stats.generation}${marriageInfo}

Deity Worshipped:
  Name: ${deity.name}
  Domain: ${deity.domain}
  Personality: ${deity.personality}
  Alignment: ${deity.alignment}
  Favor: ${deity.favor}/100

Final Level: ${stats.level}
Final Stats:
  STR: ${character.stats.strength}  DEX: ${character.stats.dexterity}  CON: ${character.stats.constitution}
  INT: ${character.stats.intelligence}  WIS: ${character.stats.wisdom}  CHA: ${character.stats.charisma}
  LUCK: ${character.stats.luck}

Achievements:
  Quests Completed: ${stats.questsCompleted}
  Enemies Defeated: ${stats.enemiesDefeated}
  Gold Earned: ${stats.gold}
  Treasure Found: ${stats.treasureFound}
  Shards Collected: ${stats.shards}
  Total Deaths This Lineage: ${stats.totalDeaths + 1}

Equipment:
  Weapon: ${character.equipment.weapon}
  Shield: ${character.equipment.shield}
  Armor: ${character.equipment.armor}
  Head: ${character.equipment.head}
  Cloak: ${character.equipment.cloak}
  Boots: ${character.equipment.boots}
  Gauntlets: ${character.equipment.gauntlets}
  Ring 1: ${character.equipment.ring1}
  Ring 2: ${character.equipment.ring2}
  Amulet: ${character.equipment.amulet}
  Ammo: ${character.equipment.ammo}

Physical Skills:
${character.skills.map((s: string) => `  - ${s}`).join('\n')}

Magic Spells:
${character.spells.map((s: string) => `  - ${s}`).join('\n')}

Life Skills:
${skillsList}

Materials Collected:
${materialsList}

Active Status Effects:
${statusList}

Companions:
${companionList}

Summons:
${summonList}

Monsters Slain:
${generateMonstersKilledLog(monstersKilled)}

Activity Summary:
${generateActivitySummary(activities)}

Last Weather: ${weather.name} - ${weather.description}

World Information:
  Name: ${worldData.name}
  Timeline: ${worldData.timeline}
  Terrain: ${worldData.terrain}
  Main Faction: ${worldData.mainFaction}

Last Quest: ${currentQuest.name}${fateDesc}

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
      deity,
      alignment,
      weather,
      materials,
      lifeSkills,
      activities,
      monstersKilled,
      currentQuest,
      shopName,
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
      generation: stats.generation + 1,
      totalDeaths: stats.totalDeaths
    });
    setCompanions([]);
    setTreasure(0);
    setMarried(null);
    setHasOffspring(false);
    setOffspringData(null);
    setStatusEffects([]);
    setSummons([]);
    setEventLog([]);
    setDeity(generateDeity());
    setAlignment(getRandomAlignment());
    setWeather(getRandomWeather());
    setMaterials([]);
    setLifeSkills(generateRankedSkills(3));
    setActivities([]);
    setMonstersKilled([]);
    setFateOutcome(null);
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
          {character.race} {character.class}{character.secondClass ? ` / ${character.secondClass}` : ''}
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
          <div className="text-muted-foreground text-xs">Shards (Rare!)</div>
          <div className="font-bold text-primary text-xs">{stats.shards}/{getShardsNeededForSummon()}</div>
          <Progress value={(stats.shards / getShardsNeededForSummon()) * 100} className="h-1 mt-1" />
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
            <span className="text-stat-gain">+{currentQuest.goldReward} gold</span>
            <span className="text-stat-gain">+{currentQuest.expReward} exp</span>
          </div>
          <div className="text-xs text-muted-foreground border-t border-border pt-2 mt-2">
            💀 Fighting monsters Rank 1-{Math.min(10, Math.max(1, Math.floor(stats.level / 8) + 1))}
            <br />
            ✨ Shards drop from Rank 5+ (Powerful or higher)
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
        <div className="text-sm font-semibold">Stats</div>
        <div className="grid grid-cols-4 gap-1 text-xs">
          <div className="bg-muted p-1 rounded">STR: {character.stats.strength}</div>
          <div className="bg-muted p-1 rounded">DEX: {character.stats.dexterity}</div>
          <div className="bg-muted p-1 rounded">CON: {character.stats.constitution}</div>
          <div className="bg-muted p-1 rounded">INT: {character.stats.intelligence}</div>
          <div className="bg-muted p-1 rounded">WIS: {character.stats.wisdom}</div>
          <div className="bg-muted p-1 rounded">CHA: {character.stats.charisma}</div>
          <div className="bg-muted p-1 rounded">LUK: {character.stats.luck}</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-semibold">Equipment</div>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div className="bg-muted p-1 rounded truncate" title={character.equipment.weapon}>⚔️ {character.equipment.weapon}</div>
          <div className="bg-muted p-1 rounded truncate" title={character.equipment.shield}>🛡️ {character.equipment.shield}</div>
          <div className="bg-muted p-1 rounded truncate" title={character.equipment.armor}>🦺 {character.equipment.armor}</div>
          <div className="bg-muted p-1 rounded truncate" title={character.equipment.head}>👑 {character.equipment.head}</div>
          <div className="bg-muted p-1 rounded truncate" title={character.equipment.cloak}>🧥 {character.equipment.cloak}</div>
          <div className="bg-muted p-1 rounded truncate" title={character.equipment.boots}>👢 {character.equipment.boots}</div>
          <div className="bg-muted p-1 rounded truncate" title={character.equipment.gauntlets}>🥊 {character.equipment.gauntlets}</div>
          <div className="bg-muted p-1 rounded truncate" title={character.equipment.ring1}>💍 {character.equipment.ring1}</div>
          <div className="bg-muted p-1 rounded truncate" title={character.equipment.ring2}>💍 {character.equipment.ring2}</div>
          <div className="bg-muted p-1 rounded truncate" title={character.equipment.amulet}>📿 {character.equipment.amulet}</div>
          <div className="bg-muted p-1 rounded truncate" title={character.equipment.ammo}>🎯 {character.equipment.ammo}</div>
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
          {character.spells.map((spell: any, i: number) => (
            <span 
              key={i} 
              className="bg-accent/20 text-accent px-2 py-1 rounded text-xs"
              title={`Save: ${spell.save} | Fail: ${(spell.failChance * 100).toFixed(0)}%`}
            >
              {spell.name}
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

      <div className="space-y-2">
        <div className="text-sm font-semibold flex items-center gap-1">
          <Crown className="w-4 h-4" /> Deity & Alignment
        </div>
        <div className="bg-muted p-2 rounded space-y-1">
          <div className="text-xs">
            <span className="text-muted-foreground">Worshipping:</span> {deity.name}
          </div>
          <div className="text-xs text-muted-foreground">
            {deity.domain} • {deity.personality}
          </div>
          <div className="text-xs">
            <span className="text-muted-foreground">Deity Alignment:</span> {deity.alignment}
          </div>
          <div className="text-xs">
            <span className="text-muted-foreground">Favor:</span> {deity.favor}/100
          </div>
          <Progress value={deity.favor} className="h-1" />
          <div className="text-xs mt-1">
            <span className="text-muted-foreground">Your Alignment:</span> {alignment}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-semibold flex items-center gap-1">
          <Cloud className="w-4 h-4" /> Weather
        </div>
        <div className="bg-muted p-2 rounded">
          <div className="font-medium text-sm">{weather.icon} {weather.name}</div>
          <div className="text-xs text-muted-foreground">{weather.description}</div>
          <div className="text-xs text-primary mt-1">{weather.effect}</div>
        </div>
      </div>

      {lifeSkills.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-semibold flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> Life Skills
          </div>
          <div className="space-y-1">
            {lifeSkills.map((skill, i) => (
              <div key={i} className="bg-muted p-2 rounded">
                <div className="flex justify-between text-xs">
                  <span>{skill.name}</span>
                  <span className="text-primary">{skill.rank}</span>
                </div>
                <Progress value={(skill.experience % 100)} className="h-1 mt-1" />
              </div>
            ))}
          </div>
        </div>
      )}

      {materials.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-semibold flex items-center gap-1">
            <Hammer className="w-4 h-4" /> Materials
          </div>
          <div className="flex flex-wrap gap-1">
            {materials.map((mat, i) => (
              <span key={i} className="bg-accent/20 text-accent px-2 py-1 rounded text-xs">
                {mat.name}: {mat.amount}
              </span>
            ))}
          </div>
        </div>
      )}

      {monstersKilled.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-semibold flex items-center gap-1">
            <Skull className="w-4 h-4" /> Monster Kills ({monstersKilled.reduce((sum, m) => sum + m.count, 0)} Total)
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {monstersKilled
              .sort((a, b) => b.count - a.count)
              .slice(0, 10)
              .map((monster, i) => (
                <div key={i} className="bg-muted p-1 rounded text-xs flex justify-between">
                  <span>{monster.name}</span>
                  <span className="text-primary">
                    x{monster.count} {monster.rank && `(R${monster.rank})`}
                  </span>
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
