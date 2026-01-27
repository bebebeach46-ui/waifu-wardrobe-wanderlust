import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Save, Heart, Skull, Sparkles, Shield, Cloud, Hammer, TrendingUp, Crown, ShoppingCart, BookOpen, Star } from "lucide-react";
import { Shop } from "@/components/Shop";
import { ShopItem } from "@/lib/shopGenerator";
import { CodexComponent } from "@/components/Codex";
import { createEmptyCodex, addDiscovery, Codex, generateLoreEntry } from "@/lib/codexSystem";
import { useToast } from "@/hooks/use-toast";
import { generateCharacter } from "@/lib/characterGenerator";
import { generateQuest } from "@/lib/questGenerator";
import { generateCompanion, getRelationshipName, calculateCompatibility, getBondLevelCap, generateMilestone, generateChild, RelationshipMilestone, ChildInfo, generateCompanionAge } from "@/lib/companionGenerator";
import { generateShopName } from "@/lib/skillGenerator";
import { generateSummon } from "@/lib/summonGenerator";
import { getRandomStatusEffect, StatusEffect } from "@/lib/statusEffectGenerator";
import { generateEventLog, Event } from "@/lib/eventLogGenerator";
import { generateDeity, getRandomAlignment, shiftAlignment, getAlignmentCompatibility, Alignment } from "@/lib/deityGenerator";
import { getRandomWeather, weatherRequiresRest, Weather } from "@/lib/weatherGenerator";
import { getRandomGatheringActivity, getRandomCraftingActivity, shouldGatherMaterials, shouldCraft, Material } from "@/lib/materialsGenerator";
import { generateRankedSkills, gainSkillExperience, RankedSkill } from "@/lib/skillRankGenerator";
import { checkEarlyDeath, checkRichRetirement, checkLegendaryFate, getNormalDeath, FateOutcome } from "@/lib/fateGenerator";
import { trackActivity, trackMonsterKill, trackCombatLog, generateActivitySummary, generateMonstersKilledLog, ActivityLog, MonsterKill, CombatLog } from "@/lib/activityTracker";
import { generateRandomDeathCause, generateEpitaph, DeathCause } from "@/lib/deathCauseGenerator";
import { getMonsterByRank, rollForShard, getShardsNeededForSummon, canSummon } from "@/lib/monsterRankSystem";
import { Wound, rollForWound, healWounds, calculatePainPenalty, calculateBleedingDamage, generateWoundSummary, getWoundIcon, getDamageTypeFromMonster, formatWound } from "@/lib/woundSystem";
import { checkCriticalHit, calculateAttack } from "@/lib/combatSystem";

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
  const [offspringData, setOffspringData] = useState<ChildInfo | null>(savedData?.offspringData || null);
  const [children, setChildren] = useState<ChildInfo[]>(() => savedData?.children || []);
  const [romanceDiary, setRomanceDiary] = useState<RelationshipMilestone[]>(() => savedData?.romanceDiary || []);
  const [married, setMarried] = useState<any>(savedData?.married || null);
  const [statusEffects, setStatusEffects] = useState<StatusEffect[]>(() => savedData?.statusEffects || []);
  const [summons, setSummons] = useState<any[]>(() => savedData?.summons || []);
  const [eventLog, setEventLog] = useState<Event[]>(() => savedData?.eventLog || []);
  const [deity, setDeity] = useState(() => savedData?.deity || generateDeity());
  const [alignment, setAlignment] = useState<Alignment>(() => savedData?.alignment || getRandomAlignment());
  const [weather, setWeather] = useState<Weather>(() => savedData?.weather || getRandomWeather());
  const [materials, setMaterials] = useState<Material[]>(() => savedData?.materials || []);
  const [lifeSkills, setLifeSkills] = useState<RankedSkill[]>(() => savedData?.lifeSkills || generateRankedSkills(3));
  const [activities, setActivities] = useState<ActivityLog[]>(() => savedData?.activities || []);
  const [monstersKilled, setMonstersKilled] = useState<MonsterKill[]>(() => savedData?.monstersKilled || []);
  const [combatLog, setCombatLog] = useState<CombatLog[]>(() => savedData?.combatLog || []);
  const [fateOutcome, setFateOutcome] = useState<FateOutcome | null>(null);
  const [deathCause, setDeathCause] = useState<DeathCause | null>(null);
  const [lastEncounter, setLastEncounter] = useState<{ monsterName: string; monsterRank: number } | null>(null);
  const [wounds, setWounds] = useState<Wound[]>(() => savedData?.wounds || []);
  const [fatalWound, setFatalWound] = useState<Wound | null>(null);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isCodexOpen, setIsCodexOpen] = useState(false);
  const [activeEffects, setActiveEffects] = useState<any[]>(() => savedData?.activeEffects || []);
  const [codex, setCodex] = useState<Codex>(() => savedData?.codex || createEmptyCodex());
  const [hasGrandVisionCrystal, setHasGrandVisionCrystal] = useState(() => {
    const completions = localStorage.getItem('difficulty_completions');
    return completions ? JSON.parse(completions).length > 0 : false;
  });
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
  
  // Migrate old companions to have bondCap and compatibility
  useEffect(() => {
    const needsMigration = companions.some(c => c.bondCap === undefined || c.compatibility === undefined);
    if (needsMigration) {
      setCompanions(companions.map((comp, index) => {
        if (comp.bondCap === undefined || comp.compatibility === undefined) {
          const compatibility = comp.compatibility !== undefined ? comp.compatibility : 
            calculateCompatibility(comp, character.race, character.class, lifeSkills);
          const bondCap = comp.bondCap !== undefined ? comp.bondCap : 
            getBondLevelCap(index, compatibility, companions);
          
          return {
            ...comp,
            compatibility,
            bondCap
          };
        }
        return comp;
      }));
    }
  }, []);

  // Track initial character data in codex
  useEffect(() => {
    if (!savedData?.codex) {
      // Track initial equipment
      Object.entries(character.equipment).forEach(([slot, item]) => {
        setCodex(prev => addDiscovery(prev, 'item', `${slot}_${item}`, 
          item as string, 
          `${slot} equipment`,
          { slot, type: 'equipment' }
        ));
      });

      // Track initial spells
      character.spells.forEach((spell: string) => {
        setCodex(prev => addDiscovery(prev, 'spell', spell, spell, 
          `Spell learned from starting class`,
          { source: 'character_creation' }
        ));
      });

      // Track initial skills
      character.skills.forEach((skill: string) => {
        setCodex(prev => addDiscovery(prev, 'skill', skill, skill, 
          `Skill learned from starting class`,
          { source: 'character_creation' }
        ));
      });
    }
  }, []); // Only run once on mount

  // Event log generator (every 2 minutes for deep immersion)
  useEffect(() => {
    if (isDead) return;
    
    const eventInterval = setInterval(() => {
      const newEvent = generateEventLog();
      setEventLog(prev => [newEvent, ...prev].slice(0, 10)); // Keep last 10 events
      
      // Track event in codex
      setCodex(prev => addDiscovery(prev, 'event', `event_${Date.now()}`, 
        "World Event", 
        newEvent.text,
        { sentiment: newEvent.sentiment }
      ));
      
      // 30% chance to discover lore
      if (Math.random() < 0.3) {
        const loreEntry = generateLoreEntry(worldData);
        setCodex(prev => addDiscovery(prev, 'lore', loreEntry.id, loreEntry.name, loreEntry.description));
      }
    }, 120000); // 2 minutes
    
    return () => clearInterval(eventInterval);
  }, [isDead, worldData]);

  // Clean up expired consumable effects
  useEffect(() => {
    if (isDead) return;
    
    const effectCleanup = setInterval(() => {
      const now = Date.now();
      setActiveEffects(prev => {
        const remaining = prev.filter(effect => !effect.endTime || effect.endTime > now);
        if (remaining.length < prev.length) {
          toast({
            title: "Buff Expired",
            description: "Some effects have worn off"
          });
        }
        return remaining;
      });
    }, 1000);
    
    return () => clearInterval(effectCleanup);
  }, [isDead, toast]);

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
          
          // Get difficulty for this world
          const gameDifficulty = worldData.difficulty || 2;
          
          // Calculate dynamic death chance based on difficulty and level
          // This prevents instant deaths at low levels while maintaining challenge
          // 
          // Examples:
          // - Level 1, Difficulty 1 (Basic), 0 quests: ~0.03% per quest
          // - Level 1, Difficulty 5 (Impossible), 0 quests: ~1.33% per quest
          // - Level 10, Difficulty 2 (Adventurer), 50 quests: ~0.6% per quest
          // - Level 20+, Difficulty 3 (Hero), 100 quests: ~1.8% per quest
          //
          // Base death chance by difficulty (scaled per 100 quests for balance)
          const baseDifficultyRates = [0, 0.001, 0.005, 0.01, 0.02, 0.04]; // Index 0 unused, 1-5 for difficulties
          const baseRate = baseDifficultyRates[gameDifficulty];
          
          // Level protection: reduce death chance significantly at low levels
          // At level 1: 33% of base rate
          // At level 10: 67% of base rate  
          // At level 20+: 100% of base rate
          const levelProtection = Math.min(1, (stats.level + 10) / 30);
          
          // Quest scaling: increases risk over time
          // Every 50 quests adds 20% more risk
          const questScaling = 1 + (stats.questsCompleted / 50) * 0.2;
          
          // Final death chance calculation
          const deathChance = baseRate * levelProtection * questScaling;
          
          // Generate monster with rank system (needed for death cause even if we die)
          const monster = getMonsterByRank(stats.level);
          const monsterName = monster.name;
          
          // Track last encounter for death cause
          setLastEncounter({ monsterName, monsterRank: monster.rank.rank });
          
          // Random normal death check
          if (Math.random() < deathChance) {
            // Generate detailed death cause
            const activeStatus = statusEffects.length > 0 ? statusEffects[0].name : undefined;
            const cause = generateRandomDeathCause({
              monsterName,
              monsterRank: monster.rank.rank,
              playerLevel: stats.level,
              location: currentQuest.name,
              activeStatus,
              questName: currentQuest.name
            });
            setDeathCause(cause);
            handleDeath();
            return prev;
          }
          
          // === WOUND SYSTEM INTEGRATION ===
          // Calculate combat result with critical hits
          const combatResult = calculateAttack({
            stats: { ...character.stats },
            class: character.class,
            level: stats.level
          }, false);
          
          // Monster attacks back - roll for wounds
          const monsterDamage = Math.floor(Math.random() * (10 + monster.rank.rank * 5)) + monster.rank.rank * 2;
          const monsterCrit = checkCriticalHit(10 + monster.rank.rank * 2); // Monster dex scales with rank
          const damageType = getDamageTypeFromMonster(monsterName);
          
          // Roll for wound from monster attack
          const newWound = rollForWound(
            monsterDamage,
            monsterCrit,
            false, // monsters don't backstab (usually)
            monster.rank.rank,
            stats.level,
            character.race,
            monsterName,
            damageType
          );
          
          if (newWound) {
            setWounds(prev => [...prev, newWound]);
            
            // Check for fatal wound (severity 10 on vital area)
            if (newWound.isFatal) {
              setFatalWound(newWound);
              const cause = generateRandomDeathCause({
                monsterName,
                monsterRank: monster.rank.rank,
                playerLevel: stats.level,
                location: currentQuest.name,
                activeStatus: statusEffects.length > 0 ? statusEffects[0].name : undefined,
                questName: currentQuest.name
              });
              setDeathCause(cause);
              
              toast({
                title: `💀 FATAL WOUND!`,
                description: `${newWound.description} by ${monsterName}!`,
                variant: "destructive",
                duration: 5000
              });
              
              handleDeath();
              return prev;
            }
            
            // Non-fatal wound notification
            const icon = getWoundIcon(newWound.severity);
            toast({
              title: `${icon} Wounded! (Severity ${newWound.severity})`,
              description: `${newWound.name}: ${newWound.description}`,
              duration: 3000
            });
            
            setActivities(prev => trackActivity(prev, "combat", `Received ${newWound.name} from ${monsterName}`));
          }
          
          // Heal wounds slightly after successful combat (natural recovery)
          setWounds(prev => healWounds(prev, 1));
          
          // Track monster in codex
          setCodex(prev => addDiscovery(prev, 'monster', monsterName, monsterName, 
            `Rank ${monster.rank.rank} ${monster.rank.name} - ${monster.rank.description}`,
            { rank: monster.rank.rank, rankName: monster.rank.name }
          ));
          
          // Track combat and quest in activities
          setMonstersKilled(prev => trackMonsterKill(prev, monsterName, monster.rank.rank));
          setActivities(prev => trackActivity(prev, "combat", `Defeated Rank ${monster.rank.rank} ${monsterName} in ${currentQuest.name}${combatResult.critical ? ' (CRIT!)' : ''}`));
          
          // Check if vision crystal is active or grand vision crystal unlocked
          const hasVision = activeEffects.some(e => e.type === 'vision_crystal' && e.endTime > Date.now()) || hasGrandVisionCrystal;
          const playerMaxHp = 100 + (stats.level * 10);
          const bleedingDamage = calculateBleedingDamage(wounds);
          const painPenalty = calculatePainPenalty(wounds);
          const playerCurrentHp = Math.floor(playerMaxHp * (0.6 + Math.random() * 0.4)) - bleedingDamage;
          const enemyMaxHp = 50 + (monster.rank.rank * 20);
          
          // Combat log with wound info
          const woundInfo = newWound ? ` | Received: ${newWound.name} (Sev ${newWound.severity})` : '';
          const critInfo = combatResult.critical ? ' [CRITICAL HIT!]' : '';
          
          if (hasVision) {
            setCombatLog(prev => trackCombatLog(
              prev,
              `⚔️ Defeated ${monsterName} (Rank ${monster.rank.rank})${critInfo}${woundInfo}`,
              playerCurrentHp,
              0,
              combatResult.damage,
              { playerMaxHp, enemyMaxHp, monsterRank: monster.rank.rank }
            ));
          } else {
            setCombatLog(prev => trackCombatLog(
              prev,
              `⚔️ Defeated ${monsterName} (Rank ${monster.rank.rank})${newWound ? ` | ${getWoundIcon(newWound.severity)} Wounded` : ''}`,
              undefined,
              undefined,
              undefined
            ));
          }
          
          // Roll for shard drop (only rank 5+)
          const shardDropped = rollForShard(monster.rank) ? 1 : 0;
          if (shardDropped > 0) {
            toast({
              title: "✨ RARE SHARD DROPPED!",
              description: `A shard dropped from the Rank ${monster.rank.rank} ${monster.rank.name}!`,
              duration: 5000
            });
          }
          
          // Vision crystal drop from rank 2+
          if (monster.rank.rank >= 2 && Math.random() < 0.15) { // 15% chance
            toast({
              title: "💎 Vision Crystal Dropped!",
              description: "Use it to see detailed combat information",
              duration: 3000
            });
            setStats(s => ({ ...s, gold: s.gold + 50 })); // Add gold equivalent
          }
          
          // Calculate rewards with rank multipliers and difficulty bonus
          const difficultyMultipliers = [0, 1.0, 1.2, 1.5, 2.0, 3.0]; // Index 0 unused, 1-5 for difficulties
          const difficultyBonus = difficultyMultipliers[gameDifficulty];
          
          const treasureFound = Math.floor((Math.random() * 50 + 10) * monster.rank.goldMultiplier * difficultyBonus);
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
              const newItem = `Enhanced ${character.equipment[slot]}`;
              
              setCharacter(c => ({
                ...c,
                equipment: {
                  ...c.equipment,
                  [slot]: newItem
                }
              }));
              
              // Track upgraded equipment in codex
              setCodex(prev => addDiscovery(prev, 'item', `${slot}_${newItem}`, 
                newItem, 
                `${slot} equipment`,
                { slot, type: 'equipment', upgraded: true }
              ));
              
              toast({
                title: "Equipment Upgraded!",
                description: `Upgraded ${slot}!`
              });
            }
          }
          
          // Quest completion: 15% chance for companion reward if party not full
          if (Math.random() < 0.15 && companions.length < 3) {
            const characterWithSkills = { ...character, skills: lifeSkills };
            const newCompanion = generateCompanion(worldData, characterWithSkills, companions);
            setCompanions(c => [...c, newCompanion]);
            
            // Track companion in codex
            setCodex(prev => addDiscovery(prev, 'companion', `${newCompanion.name}_${newCompanion.race}`, 
              newCompanion.name, 
              newCompanion.description,
              { race: newCompanion.race, class: newCompanion.class, gender: newCompanion.gender, alignment: newCompanion.alignment, compatibility: newCompanion.compatibility }
            ));
            
            const compatibilityDesc = newCompanion.compatibility >= 5 ? "highly compatible" :
                                     newCompanion.compatibility >= 3 ? "somewhat compatible" : "interested";
            
            toast({
              title: "🌟 Companion Earned!",
              description: <span className="text-stat-increase">{newCompanion.name} ({compatibilityDesc}) joined your party! Bond Cap: {newCompanion.bondCap}</span>,
              duration: 5000
            });
            
            setActivities(prev => trackActivity(prev, "relationship", `${newCompanion.name} joined as a companion (Compatibility: ${newCompanion.compatibility})`));
          }
          
          // Update companion relationships with bond cap enforcement
          setCompanions(comps => comps.map(comp => {
            // Ensure old companions have bondCap
            const bondCap = comp.bondCap || 10;
            const cappedRelationship = Math.min(bondCap, comp.relationship + (Math.random() * comp.progressionRate));
            const newRel = Math.min(bondCap, cappedRelationship);
            const oldLevel = Math.floor(comp.relationship);
            const newLevel = Math.floor(newRel);
            const oldName = getRelationshipName(comp.relationship);
            const newName = getRelationshipName(newRel);
            
            // Track relationship milestones (like VN scene unlocks)
            if (newLevel > oldLevel && newLevel >= 2) {
              const milestone = generateMilestone(newLevel, comp.name, comp.race);
              if (milestone) {
                setRomanceDiary(prev => [...prev, milestone]);
                toast({
                  title: `💕 ${milestone.name}`,
                  description: `${comp.name}: ${milestone.description}`,
                  duration: 5000
                });
                setActivities(prev => trackActivity(prev, "relationship", `${milestone.name} with ${comp.name}: ${milestone.description}`));
              }
            }
            
            if (oldName !== newName) {
              toast({
                title: `${comp.name} relationship increased!`,
                description: <span className="text-stat-increase">Now {newName}</span>
              });
            }
            
            // Bond cap warning
            if (newRel >= bondCap - 0.5 && comp.relationship < bondCap - 0.5) {
              toast({
                title: `${comp.name} Bond Capped`,
                description: `Bond level capped at ${bondCap} (Compatibility: ${comp.compatibility || 'N/A'})`,
                variant: "default"
              });
            }
            
            // Marriage and child at max relationship (only if bond cap is 10)
            if (newRel >= 10 && bondCap === 10 && !married && comp.relationship < 10) {
              setMarried(comp);
              toast({
                title: "💍 Marriage!",
                description: `${comp.name} and ${character.name} are now married!`
              });
              // Generate child using proper function
              const child = generateChild(character.name, character.race, comp.name, comp.race);
              setOffspringData(child);
              setChildren(prev => [...prev, child]);
              setHasOffspring(true);
              
              toast({
                title: `👶 ${child.gender === "Male" ? "Son" : "Daughter"} Born!`,
                description: `${child.name} has been born! Traits: ${child.traits.join(", ")}`,
                duration: 8000
              });
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
            // Apply active effect multipliers and difficulty bonus
            const expMultiplier = activeEffects.some(e => e.type === 'exp_boost' && e.endTime > Date.now()) ? 2 : 1;
            const goldMultiplier = activeEffects.some(e => e.type === 'gold_boost' && e.endTime > Date.now()) ? 1.5 : 1;
            const shardMultiplier = activeEffects.some(e => e.type === 'shard_boost' && e.endTime > Date.now()) ? 2 : 1;
            
            const newExp = s.exp + Math.floor(currentQuest.expReward * monster.rank.expMultiplier * expMultiplier * difficultyBonus);
            const levelUp = newExp >= s.expToNext;
            const adjustedShardDrop = Math.floor(shardDropped * shardMultiplier);
            const newShards = s.shards + adjustedShardDrop;
            const adjustedGold = Math.floor(goldGained * goldMultiplier * difficultyBonus);
            
            if (levelUp) {
              toast({
                title: "Level Up!",
                description: <span className="text-stat-increase">Now Level {s.level + 1}</span>
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
                gold: s.gold + adjustedGold,
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
              gold: s.gold + adjustedGold,
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
  }, [currentQuest, worldData, stats.level, treasure, companions, isDead, shopName, character.equipment, toast, married, statusEffects, activeEffects]);

  const handleDeath = () => {
    // Check for death save (plot armor)
    const hasDeathSave = activeEffects.some(e => e.type === 'death_save');
    if (hasDeathSave) {
      setActiveEffects(prev => prev.filter(e => e.type !== 'death_save'));
      toast({
        title: "💫 Plot Armor Activated!",
        description: <span className="text-event-positive">You survived! The plot armor has been consumed.</span>,
        duration: 5000
      });
      return;
    }

    // Generate death cause if not already set (for fate deaths)
    if (!deathCause && fateOutcome) {
      // Fate outcomes have their own descriptions
      setDeathCause({
        cause: fateOutcome.type,
        shortDesc: fateOutcome.shortDesc || fateOutcome.type,
        fullDesc: fateOutcome.description,
        ironic: fateOutcome.type === "death" && stats.questsCompleted < 5
      });
    } else if (!deathCause) {
      // Fallback death cause
      const activeStatus = statusEffects.length > 0 ? statusEffects[0].name : undefined;
      const cause = generateRandomDeathCause({
        monsterName: lastEncounter?.monsterName,
        monsterRank: lastEncounter?.monsterRank,
        playerLevel: stats.level,
        location: currentQuest.name,
        activeStatus,
        questName: currentQuest.name
      });
      setDeathCause(cause);
    }

    // Track difficulty completion and unlock grand vision crystal
    const currentDifficulty = worldData.difficulty || 2;
    const completions = localStorage.getItem('difficulty_completions');
    const completedDifficulties = completions ? JSON.parse(completions) : [];
    
    if (!completedDifficulties.includes(currentDifficulty)) {
      completedDifficulties.push(currentDifficulty);
      localStorage.setItem('difficulty_completions', JSON.stringify(completedDifficulties));
      
      if (!hasGrandVisionCrystal) {
        setHasGrandVisionCrystal(true);
        toast({
          title: "🏆 GRAND VISION CRYSTAL UNLOCKED!",
          description: "You can now see detailed combat logs in all future playthroughs!",
          duration: 8000
        });
      }
    }
    
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
    
    const causeShort = deathCause?.shortDesc || "Unknown causes";
    toast({
      title: `💀 ${causeShort}`,
      description: "Death log downloaded",
      variant: "destructive"
    });
  };
  
  const generateDeathLog = () => {
    const companionList = companions.length > 0 
      ? companions.map(c => `  - ${c.name} (Age: ${c.age || '?'}, ${c.relationshipName || 'Unknown'} ${Math.floor(c.relationship || 0)}/${c.bondCap || 10}, ${c.race} ${c.class}, Compatibility: ${c.compatibility ?? 'N/A'}, Alignment: ${c.alignment || 'Unknown'})`).join('\n')
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
    
    // Romance diary section
    const romanceDiaryList = romanceDiary.length > 0
      ? romanceDiary.map(m => `  [Lv${m.level}] ${m.name} with ${m.companionName} (${m.companionRace})\n       "${m.description}"`).join('\n\n')
      : '  No romantic moments recorded';
    
    // Children section
    const childrenList = children.length > 0
      ? children.map(c => `  - ${c.name} (${c.gender})\n     Parents: ${c.parentName} (${c.parentRace}) & ${c.otherParentName} (${c.otherParentRace})\n     Traits: ${c.traits.join(', ')}`).join('\n\n')
      : '  No children';
    
    const marriageInfo = married ? `\nMarriage:\n  Spouse: ${married.name} (Age: ${married.age || '?'}, ${married.race}, Alignment: ${married.alignment})` : '';
    
    // Generate epitaph with death cause
    const epitaph = deathCause 
      ? generateEpitaph(character.name, deathCause, stats.level, stats.questsCompleted)
      : `Here lies ${character.name}\nCause of death unknown`;
    
    const fateDesc = fateOutcome ? `\nFate: ${fateOutcome.description}` : '';
    
    // Detailed death cause section
    const deathDetails = deathCause ? `
═══════════════════════════════════════════════════════════
CAUSE OF DEATH
═══════════════════════════════════════════════════════════

${epitaph}

Death Type: ${deathCause.cause.toUpperCase()}
${deathCause.killer ? `Killed By: ${deathCause.killer}` : ''}
${deathCause.damageType ? `Damage Type: ${deathCause.damageType}` : ''}
${deathCause.location ? `Location: ${deathCause.location}` : ''}
${deathCause.ironic ? '\n⚠️ THIS DEATH WAS PARTICULARLY EMBARRASSING ⚠️' : ''}
${fateDesc}` : '';
    
    return `═══════════════════════════════════════════════════════════
QUEST IDLE - DEATH LOG
═══════════════════════════════════════════════════════════

Character: ${character.name}
Age: ${character.age || 'Unknown'}
Gender: ${character.gender}
Race: ${character.race}
Class: ${character.class}
Alignment: ${alignment}
Generation: ${stats.generation}${marriageInfo}
${deathDetails}

═══════════════════════════════════════════════════════════
💕 ROMANCE DIARY - SCENE UNLOCKS
═══════════════════════════════════════════════════════════

Companions Encountered: ${companions.length}
Deepest Relationship: ${companions.length > 0 ? Math.max(...companions.map(c => Math.floor(c.relationship || 0))) : 0}/10
Total Milestones Unlocked: ${romanceDiary.length}

Romance Milestones:
${romanceDiaryList}

═══════════════════════════════════════════════════════════
👶 CHILDREN & LEGACY
═══════════════════════════════════════════════════════════

${childrenList}

${hasOffspring && offspringData ? `\n🌟 HEIR AVAILABLE: ${offspringData.name} (${offspringData.gender}) can continue the adventure!` : ''}

═══════════════════════════════════════════════════════════
CHARACTER DETAILS
═══════════════════════════════════════════════════════════

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

═══════════════════════════════════════════════════════════
WOUND HISTORY
═══════════════════════════════════════════════════════════

${generateWoundSummary(wounds)}

═══════════════════════════════════════════════════════════
COMBAT HISTORY
═══════════════════════════════════════════════════════════

Monsters Slain:
${generateMonstersKilledLog(monstersKilled)}

Recent Combat Log:
${combatLog.slice(0, 10).map(c => `  ${c.description}${c.damage ? ` (${c.damage} dmg)` : ''}`).join('\n') || '  No combat recorded'}

Activity Summary:
${generateActivitySummary(activities)}

═══════════════════════════════════════════════════════════
WORLD STATE
═══════════════════════════════════════════════════════════

Last Weather: ${weather.name} - ${weather.description}

World Information:
  Name: ${worldData.name}
  Timeline: ${worldData.timeline}
  Terrain: ${worldData.terrain}
  Main Faction: ${worldData.mainFaction}
  Difficulty: ${['', 'Basic Quest', 'Adventurer', 'Hero\'s Trial', 'Legendary', 'Impossible'][worldData.difficulty || 2]}

Last Quest: ${currentQuest.name}

Death occurred at: ${new Date().toLocaleString()}

═══════════════════════════════════════════════════════════
"${deathCause?.ironic ? 'The bards will remember this... unfortunately.' : 'The adventure ends, but the legend lives on...'}"
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
      children,
      romanceDiary,
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
      activeEffects,
      codex,
      combatLog,
      wounds,
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
    if (!offspringData) return;
    
    // Generate child character starting at age 18
    const childCharacter = generateCharacter(worldData, { startingAge: 18 });
    childCharacter.name = offspringData.name;
    childCharacter.gender = offspringData.gender;
    // Child inherits a mix of parent races (display as primary race from player)
    childCharacter.race = character.race;
    
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
    setChildren([]);
    setRomanceDiary([]);
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
    setDeathCause(null);
    setCombatLog([]);
    setWounds([]);
    setFatalWound(null);
    setCurrentQuest(generateQuest(worldData, 1));
    setQuestProgress(0);
    setIsDead(false);
    setDeathLog("");
    
    toast({
      title: "A New Generation Begins",
      description: `Playing as ${offspringData.name} (Age 18), Generation ${stats.generation + 1}`
    });
  };
  
  const handleShopPurchase = (item: ShopItem) => {
    if (stats.gold < item.price) return;

    // Deduct gold
    setStats(s => ({ ...s, gold: s.gold - item.price }));

    // Apply item effect based on type
    switch (item.type) {
      case 'stat_boost':
        setCharacter(c => {
          const newStats = { ...c.stats };
          if (item.effect.stat === 'all') {
            Object.keys(newStats).forEach(stat => {
              newStats[stat as keyof typeof newStats] += item.effect.value;
            });
          } else {
            newStats[item.effect.stat as keyof typeof newStats] += item.effect.value;
          }
          return { ...c, stats: newStats };
        });
        toast({
          title: "Stat Increased!",
          description: <span className="text-stat-increase">{item.name} applied</span>
        });
        break;

      case 'equipment':
        setCharacter(c => {
          const slot = item.effect.slot === 'ring' 
            ? (Math.random() < 0.5 ? 'ring1' : 'ring2') 
            : item.effect.slot;
          const newItem = `Enhanced ${c.equipment[slot]}`;
          
          // Track upgraded equipment in codex
          setCodex(prev => addDiscovery(prev, 'item', `${slot}_${newItem}`, 
            newItem, 
            `${slot} equipment - ${item.name}`,
            { slot, type: 'equipment', upgraded: true, source: 'shop' }
          ));
          
          return {
            ...c,
            equipment: {
              ...c.equipment,
              [slot]: newItem
            }
          };
        });
        toast({
          title: "Equipment Upgraded!",
          description: item.name
        });
        break;

      case 'consumable':
        switch (item.effect.type) {
          case 'exp_boost':
          case 'gold_boost':
          case 'shard_boost':
            setActiveEffects(prev => [...prev, {
              type: item.effect.type,
              endTime: Date.now() + item.effect.duration
            }]);
            toast({
              title: "Buff Active!",
              description: <span className="text-event-positive">{item.description}</span>,
              duration: 5000
            });
            break;

          case 'instant_quest':
            setQuestProgress(100);
            toast({
              title: "Quest Completed!",
              description: "Instant completion"
            });
            break;

          case 'reroll_quest':
            setCurrentQuest(generateQuest(worldData, stats.level));
            setQuestProgress(0);
            toast({
              title: "Quest Re-rolled!",
              description: "New quest generated"
            });
            break;

          case 'death_save':
            setActiveEffects(prev => [...prev, { type: 'death_save' }]);
            toast({
              title: "Plot Armor Activated!",
              description: <span className="text-event-positive">You will survive the next death</span>,
              duration: 5000
            });
            break;

          case 'summon_companion':
            if (companions.length < 3) {
              const characterWithSkills = { ...character, skills: lifeSkills };
              const newCompanion = generateCompanion(worldData, characterWithSkills, companions);
              setCompanions(c => [...c, newCompanion]);
              
              // Track companion in codex
              setCodex(prev => addDiscovery(prev, 'companion', `${newCompanion.name}_${newCompanion.race}`, 
                newCompanion.name, 
                newCompanion.description,
                { race: newCompanion.race, class: newCompanion.class, gender: newCompanion.gender, alignment: newCompanion.alignment, compatibility: newCompanion.compatibility }
              ));
              
              const compatibilityDesc = newCompanion.compatibility >= 5 ? "highly compatible" :
                                       newCompanion.compatibility >= 3 ? "somewhat compatible" : "interested";
              
              toast({
                title: "🌟 Companion Summoned!",
                description: <span className="text-stat-increase">{newCompanion.name} ({compatibilityDesc}) joined! Bond Cap: {newCompanion.bondCap}</span>,
                duration: 5000
              });
              
              setActivities(prev => trackActivity(prev, "relationship", `${newCompanion.name} was summoned (Compatibility: ${newCompanion.compatibility})`));
            } else {
              toast({
                title: "Party Full!",
                description: "Max 3 companions reached",
                variant: "destructive"
              });
            }
            break;

          case 'cleanse_debuffs':
            setStatusEffects(prev => prev.filter(e => e.type === 'good'));
            toast({
              title: "Debuffs Cleansed!",
              description: "All negative effects removed"
            });
            break;
            
          case 'vision_crystal':
            setActiveEffects(prev => [...prev, { type: 'vision_crystal', endTime: Date.now() + item.effect.duration }]);
            toast({
              title: "💎 Vision Crystal Activated!",
              description: "You can now see detailed combat information for 1 hour"
            });
            break;
        }
        break;

      case 'companion_gift':
        if (companions.length > 0) {
          const randomIndex = Math.floor(Math.random() * companions.length);
          setCompanions(comps => comps.map((comp, i) => {
            if (i === randomIndex) {
              const bondCap = comp.bondCap || 10;
              const newRel = Math.min(bondCap, comp.relationship + item.effect.relationship);
              return {
                ...comp,
                relationship: newRel,
                relationshipName: getRelationshipName(newRel)
              };
            }
            return comp;
          }));
          toast({
            title: "Gift Given!",
            description: <span className="text-stat-increase">{companions[randomIndex].name} relationship increased</span>
          });
        } else {
          toast({
            title: "No Companions!",
            description: "You need companions to give gifts to",
            variant: "destructive"
          });
        }
        break;

      case 'special':
        switch (item.effect.type) {
          case 'random_status':
            const newEffect = getRandomStatusEffect();
            setStatusEffects(prev => [...prev, newEffect]);
            toast({
              title: `${newEffect.icon} ${newEffect.name}!`,
              description: newEffect.description
            });
            break;

          case 'good_status':
            const goodEffect = getRandomStatusEffect('good');
            setStatusEffects(prev => [...prev, goodEffect]);
            toast({
              title: `${goodEffect.icon} ${goodEffect.name}!`,
              description: goodEffect.description
            });
            break;

          case 'refresh_shop':
            toast({
              title: "Shop Refreshed!",
              description: "New items available"
            });
            break;

          case 'level_up':
            setStats(s => ({
              ...s,
              level: s.level + 1,
              exp: 0,
              expToNext: s.expToNext + 50
            }));
            toast({
              title: "Level Up!",
              description: <span className="text-stat-increase">Gained a level instantly!</span>
            });
            break;

          case 'mystery':
            const mysteryEffects = [
              () => {
                setStats(s => ({ ...s, gold: s.gold + 2000 }));
                toast({ title: "💰 Jackpot!", description: "+2000 gold!" });
              },
              () => {
                setStats(s => ({ ...s, gold: Math.max(0, s.gold - 500) }));
                toast({ title: "💸 Cursed!", description: <span className="text-stat-loss">-500 gold</span> });
              },
              () => {
                const allStats = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma', 'luck'];
                const randomStat = allStats[Math.floor(Math.random() * allStats.length)];
                setCharacter(c => ({
                  ...c,
                  stats: { ...c.stats, [randomStat]: c.stats[randomStat as keyof typeof c.stats] + 5 }
                }));
                toast({ title: "✨ Blessed!", description: <span className="text-stat-increase">+5 {randomStat}</span> });
              },
              () => {
                setStats(s => ({ ...s, level: s.level + 2, exp: 0 }));
                toast({ title: "🎆 Power Surge!", description: <span className="text-stat-increase">+2 levels!</span> });
              },
              () => {
                const badEffect = getRandomStatusEffect('bad');
                setStatusEffects(prev => [...prev, badEffect]);
                toast({ title: "💀 Cursed!", description: <span className="text-event-negative">{badEffect.name}</span> });
              }
            ];
            mysteryEffects[Math.floor(Math.random() * mysteryEffects.length)]();
            break;

          case 'deity_favor':
            setDeity(d => ({ ...d, favor: Math.min(100, d.favor + item.effect.value) }));
            toast({
              title: "Deity Favor Increased!",
              description: <span className="text-stat-increase">+{item.effect.value} favor</span>
            });
            break;

          case 'shift_alignment':
            const newAlignment = shiftAlignment(alignment);
            setAlignment(newAlignment);
            toast({
              title: "Alignment Shifted!",
              description: `Now ${newAlignment}`
            });
            break;
        }
        break;
    }
  };

  const handleShopRefresh = () => {
    if (stats.gold >= 100) {
      setStats(s => ({ ...s, gold: s.gold - 100 }));
      toast({
        title: "Shop Refreshed",
        description: "New inventory available"
      });
    }
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
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsCodexOpen(true)} title="Discovery Codex">
            <BookOpen className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsShopOpen(true)}>
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSave}>
            <Save className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-semibold">{character.name}</span>
          <span className="text-muted-foreground">Lv.{stats.level}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          {character.race} {character.class}{character.secondClass ? ` / ${character.secondClass}` : ''}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Difficulty:</span>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => {
              const difficulty = worldData.difficulty || 2;
              const difficultyColors = ["", "text-green-500", "text-blue-500", "text-yellow-500", "text-orange-500", "text-red-500"];
              return (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < difficulty
                      ? `${difficultyColors[difficulty]} fill-current`
                      : "text-muted-foreground"
                  }`}
                />
              );
            })}
          </div>
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
            <span className="text-stat-increase">+{currentQuest.goldReward} gold</span>
            <span className="text-stat-increase">+{currentQuest.expReward} exp</span>
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
            <Heart className="w-4 h-4" /> Companions ({companions.length}/3)
          </div>
          <div className="space-y-2">
            {companions.map((comp, i) => {
              const bondCap = comp.bondCap || 10;
              const compatibility = comp.compatibility !== undefined ? comp.compatibility : 'N/A';
              return (
                <div key={i} className="bg-muted p-2 rounded space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-sm">{comp.name}</div>
                      <div className="text-xs text-muted-foreground">{comp.description}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded block mb-1">
                        {comp.relationshipName} ({Math.floor(comp.relationship)}/{bondCap})
                      </span>
                      {compatibility !== 'N/A' && (
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          compatibility >= 5 ? 'bg-green-500/20 text-green-500' :
                          compatibility >= 3 ? 'bg-yellow-500/20 text-yellow-500' :
                          'bg-orange-500/20 text-orange-500'
                        }`}>
                          ⚡{compatibility}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Likes: {comp.preferences.join(', ')}
                  </div>
                  <Progress value={(comp.relationship / bondCap) * 100} className="h-1" />
                </div>
              );
            })}
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

      {combatLog.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-semibold flex items-center gap-2">
            Combat Log
            {(activeEffects.some(e => e.type === 'vision_crystal' && e.endTime > Date.now()) || hasGrandVisionCrystal) && (
              <span className="text-xs text-primary">💎 {hasGrandVisionCrystal ? 'Grand Vision' : 'Vision Active'}</span>
            )}
          </div>
          <div className="bg-muted p-2 rounded space-y-1 max-h-32 overflow-y-auto">
            {combatLog.slice(0, 10).map((log, i) => (
              <div key={i} className="text-xs">
                <div>{log.description}</div>
                {log.playerHp !== undefined && (
                  <div className="text-muted-foreground ml-2">
                    HP: {log.playerHp}/{log.details?.playerMaxHp} | Enemy: {log.enemyHp}/{log.details?.enemyMaxHp} | DMG: {log.damage}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {eventLog.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-semibold">Event Log</div>
          <div className="bg-muted p-2 rounded space-y-1 max-h-32 overflow-y-auto">
            {eventLog.map((event, i) => (
              <div 
                key={i} 
                className={`text-xs ${
                  event.sentiment === 'negative' ? 'text-event-negative' :
                  event.sentiment === 'neutral' ? 'text-event-neutral' :
                  'text-event-positive'
                }`}
              >
                • {event.text}
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

      {activeEffects.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-semibold flex items-center gap-1">
            <Sparkles className="w-4 h-4" /> Active Buffs
          </div>
          <div className="flex flex-wrap gap-1">
            {activeEffects.map((effect, i) => (
              <span 
                key={i} 
                className="bg-accent/20 text-accent px-2 py-1 rounded text-xs"
              >
                {effect.type.replace('_', ' ').toUpperCase()}
                {effect.endTime && ` (${Math.ceil((effect.endTime - Date.now()) / 1000 / 60)}m)`}
              </span>
            ))}
          </div>
        </div>
      )}

      <Shop
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        shopName={shopName}
        playerGold={stats.gold}
        playerLevel={stats.level}
        onPurchase={handleShopPurchase}
        onRefresh={handleShopRefresh}
      />

      {isCodexOpen && (
        <CodexComponent
          codex={codex}
          onClose={() => setIsCodexOpen(false)}
        />
      )}
    </Card>
  );
};

export default GameScreen;
