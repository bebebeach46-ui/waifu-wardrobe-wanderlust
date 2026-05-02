import { useMemo } from "react";
import { TravelState } from "@/lib/locationSystem";
import { Quest } from "@/lib/questGenerator";
import { CombatLog } from "@/lib/activityTracker";

interface AsciiMapProps {
  travelState: TravelState;
  currentQuest: Quest;
  questProgress: number; // 0-100
  combatLog: CombatLog[];
  companionsCount: number;
  isDead: boolean;
  fame: number;
}

// Glyph legend
// @ = hero, c = companion, # = wall, . = floor, , = grass, ~ = water,
// ^ = trap/peak, T = tree, % = rubble, * = item/treasure, $ = gold,
// = = bridge, + = door, < > stairs, & = altar/feature
// Monsters: r=rat, g=goblin, o=orc, k=kobold, D=dragon, U=undead, B=boss, S=spirit, H=hostile humanoid

const TERRAIN_GLYPHS: Record<string, { floor: string; wall: string; accent: string; bg: string }> = {
  Plains:    { floor: ",", wall: '"', accent: "*", bg: "," },
  Forest:    { floor: ".", wall: "T", accent: "T", bg: "," },
  Mountains: { floor: ".", wall: "^", accent: "^", bg: "." },
  Swamp:     { floor: "~", wall: "T", accent: ",", bg: "~" },
  Desert:    { floor: ".", wall: "n", accent: "*", bg: "." },
  Tundra:    { floor: ".", wall: "*", accent: "~", bg: "." },
  Jungle:    { floor: ",", wall: "T", accent: "%", bg: "," },
  Caves:     { floor: ".", wall: "#", accent: "*", bg: "#" },
  Ruins:     { floor: ".", wall: "#", accent: "%", bg: "%" },
  Village:   { floor: ".", wall: "#", accent: "+", bg: "." },
  Castle:    { floor: ".", wall: "#", accent: "&", bg: "#" },
  Dungeon:   { floor: ".", wall: "#", accent: "<", bg: "#" },
  Tower:     { floor: ".", wall: "#", accent: ">", bg: "." },
  Bridge:    { floor: "=", wall: "~", accent: "=", bg: "~" },
  Lake:      { floor: "~", wall: ".", accent: "~", bg: "~" },
  River:     { floor: "~", wall: ",", accent: "=", bg: "~" },
  Coast:     { floor: ".", wall: "~", accent: "~", bg: "." },
  Volcanic:  { floor: ".", wall: "^", accent: "&", bg: "%" },
  Canyon:    { floor: ".", wall: "#", accent: "^", bg: "." },
  Valley:    { floor: ",", wall: "^", accent: "T", bg: "," },
  Plateau:   { floor: ".", wall: "^", accent: "^", bg: "." },
};

const FEATURE_GLYPHS: Record<string, string> = {
  "Healing Springs": "≈",
  "Ancient Statues": "&",
  "Fairy Rings": "o",
  "NPC Camps": "Ω",
  "Rest Areas": "▲",
  "Glowing Crystals": "*",
  "Sacred Ground": "+",
  "Teleport Circles": "○",
  "Secret Paths": "/",
  "Warp Zones": "Φ",
  "Hidden Treasures": "$",
  "Dragon Bones": "Y",
  "Magical Barriers": "‖",
  "Puzzle Locks": "?",
  "Boss Arenas": "X",
  "Moving Platforms": "≡",
  "Monster Dens": "ω",
  "Cursed Ground": "x",
  "Trap Floors": "^",
  "Demon Gates": "Π",
  "Wandering Spirits": "S",
  "Mysterious Fog": "·",
  "Volcanic Vents": "v",
  "Corrupted Leyline": "z",
};

const MONSTER_GLYPH = (name: string): string => {
  const n = name.toLowerCase();
  if (/dragon|wyrm|drake/.test(n)) return "D";
  if (/goblin|gob/.test(n)) return "g";
  if (/orc/.test(n)) return "o";
  if (/kobold/.test(n)) return "k";
  if (/rat|vermin|pest/.test(n)) return "r";
  if (/spirit|ghost|wraith|specter/.test(n)) return "S";
  if (/undead|zombie|skeleton|lich/.test(n)) return "U";
  if (/demon|fiend|devil/.test(n)) return "&";
  if (/elf|vampire|rakshasa|champion|lord|king|queen/.test(n)) return "H";
  if (/wolf|beast|bear|cat/.test(n)) return "C";
  if (/slime|ooze|jelly/.test(n)) return "j";
  if (/spider|insect|bug/.test(n)) return "s";
  return "M";
};

// Seeded PRNG so the map is stable per area
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const WIDTH = 30;
const HEIGHT = 14;

interface Cell {
  glyph: string;
  cls: string;
}

const AsciiMap = ({
  travelState,
  currentQuest,
  questProgress,
  combatLog,
  companionsCount,
  isDead,
}: AsciiMapProps) => {
  const map = useMemo(() => {
    const area = travelState.currentArea;
    const region = travelState.currentRegion;
    const danger = region.dangerLevel + area.dangerModifier;
    const seed = hashString(`${region.name}|${area.name}|${area.terrain}`);
    const rand = mulberry32(seed);
    const terrain = TERRAIN_GLYPHS[area.type] || TERRAIN_GLYPHS.Plains;

    // Initialize grid with floor
    const grid: Cell[][] = [];
    for (let y = 0; y < HEIGHT; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < WIDTH; x++) {
        row.push({ glyph: terrain.floor, cls: "text-muted-foreground/60" });
      }
      grid.push(row);
    }

    // Border walls
    for (let x = 0; x < WIDTH; x++) {
      grid[0][x] = { glyph: terrain.wall, cls: "text-muted-foreground" };
      grid[HEIGHT - 1][x] = { glyph: terrain.wall, cls: "text-muted-foreground" };
    }
    for (let y = 0; y < HEIGHT; y++) {
      grid[y][0] = { glyph: terrain.wall, cls: "text-muted-foreground" };
      grid[y][WIDTH - 1] = { glyph: terrain.wall, cls: "text-muted-foreground" };
    }

    // Scatter terrain accents (clumps of trees/rocks/water)
    const accentCount = 18 + Math.floor(rand() * 14);
    for (let i = 0; i < accentCount; i++) {
      const cx = 1 + Math.floor(rand() * (WIDTH - 2));
      const cy = 1 + Math.floor(rand() * (HEIGHT - 2));
      const size = 1 + Math.floor(rand() * 3);
      for (let dy = -size; dy <= size; dy++) {
        for (let dx = -size; dx <= size; dx++) {
          if (rand() < 0.45) {
            const x = cx + dx;
            const y = cy + dy;
            if (x > 0 && x < WIDTH - 1 && y > 0 && y < HEIGHT - 1) {
              grid[y][x] = { glyph: terrain.accent, cls: "text-muted-foreground/80" };
            }
          }
        }
      }
    }

    // Carve a winding path from west side (entrance <) to east side (exit >)
    // representing the player's journey through the area
    const startY = 2 + Math.floor(rand() * (HEIGHT - 4));
    const endY = 2 + Math.floor(rand() * (HEIGHT - 4));
    const path: Array<{ x: number; y: number }> = [];
    let py = startY;
    for (let px = 1; px < WIDTH - 1; px++) {
      const t = (px - 1) / (WIDTH - 3);
      const targetY = Math.round(startY + (endY - startY) * t);
      const wobble = (rand() - 0.5) * 1.6;
      py = Math.max(1, Math.min(HEIGHT - 2, Math.round(targetY + wobble)));
      path.push({ x: px, y: py });
      grid[py][px] = { glyph: ".", cls: "text-amber-400/70" };
      // widen path occasionally
      if (rand() < 0.3 && py + 1 < HEIGHT - 1) {
        grid[py + 1][px] = { glyph: ".", cls: "text-amber-400/50" };
      }
    }

    // Entrance / exit markers
    grid[path[0].y][0] = { glyph: "<", cls: "text-primary" };
    grid[path[path.length - 1].y][WIDTH - 1] = { glyph: ">", cls: "text-primary" };

    // Place feature glyphs along edges of path
    const features = area.features || [];
    features.forEach((feat, idx) => {
      const glyph = FEATURE_GLYPHS[feat] || "&";
      const ratio = (idx + 1) / (features.length + 1);
      const anchor = path[Math.floor(path.length * ratio)];
      const offX = anchor.x + Math.floor((rand() - 0.5) * 4);
      const offY = anchor.y + (rand() < 0.5 ? -2 : 2);
      const fx = Math.max(1, Math.min(WIDTH - 2, offX));
      const fy = Math.max(1, Math.min(HEIGHT - 2, offY));
      grid[fy][fx] = { glyph, cls: "text-cyan-400" };
    });

    // Sprinkle danger/treasure based on danger level
    const dangerSpots = Math.max(2, Math.min(8, danger));
    for (let i = 0; i < dangerSpots; i++) {
      const x = 2 + Math.floor(rand() * (WIDTH - 4));
      const y = 1 + Math.floor(rand() * (HEIGHT - 2));
      if (grid[y][x].glyph === terrain.floor || grid[y][x].glyph === terrain.accent) {
        grid[y][x] = { glyph: rand() < 0.3 ? "$" : "^", cls: rand() < 0.3 ? "text-yellow-400" : "text-destructive/80" };
      }
    }

    // Player position based on quest progress along the path
    const progressIdx = Math.max(
      0,
      Math.min(path.length - 1, Math.floor((questProgress / 100) * (path.length - 1)))
    );
    const playerPos = path[progressIdx];

    // Draw breadcrumb trail (already-walked path)
    for (let i = 0; i <= progressIdx; i++) {
      const p = path[i];
      if (grid[p.y][p.x].glyph === ".") {
        grid[p.y][p.x] = { glyph: "·", cls: "text-amber-300/90" };
      }
    }

    // Companions are no longer rendered on the map (too cumbersome to track)

    // Detect recent combat from log
    const inCombat =
      combatLog.length > 0 &&
      /attack|strike|hit|cast|slash|engages|combat|wounded|crit/i.test(
        combatLog[0]?.description || ""
      );

    // Place enemy glyph next to player if in combat
    if (inCombat && !isDead) {
      const enemyName = combatLog[0]?.description || "Monster";
      const eg = MONSTER_GLYPH(enemyName);
      const dirs = [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
        { x: 1, y: 1 },
        { x: 1, y: -1 },
      ];
      for (const d of dirs) {
        const ex = playerPos.x + d.x;
        const ey = playerPos.y + d.y;
        if (ex > 0 && ex < WIDTH - 1 && ey > 0 && ey < HEIGHT - 1) {
          grid[ey][ex] = { glyph: eg, cls: "text-red-400 font-bold animate-pulse" };
          break;
        }
      }
    }

    // Hero glyph last (highest z)
    grid[playerPos.y][playerPos.x] = {
      glyph: isDead ? "%" : "@",
      cls: isDead ? "text-destructive font-bold" : "text-yellow-300 font-bold animate-pulse",
    };

    return grid;
  }, [
    travelState.currentArea.name,
    travelState.currentArea.type,
    travelState.currentArea.features,
    travelState.currentRegion.name,
    travelState.currentRegion.dangerLevel,
    questProgress,
    combatLog,
    companionsCount,
    isDead,
  ]);

  const inCombat =
    combatLog.length > 0 &&
    /attack|strike|hit|cast|slash|engages|combat|wounded|crit/i.test(
      combatLog[0]?.description || ""
    );

  return (
    <div className="bg-black/80 border border-border rounded p-2 font-mono text-[10px] leading-[12px] overflow-x-auto">
      <div className="flex items-center justify-between mb-1 text-[10px] text-muted-foreground">
        <span>
          📍 {travelState.currentArea.name} ({travelState.currentArea.type})
        </span>
        <span className={inCombat ? "text-destructive font-bold animate-pulse" : "text-primary"}>
          {inCombat ? "⚔ COMBAT" : "TRAVEL"}
        </span>
      </div>
      <pre className="select-none whitespace-pre">
        {map.map((row, y) => (
          <div key={y} className="flex">
            {row.map((cell, x) => (
              <span key={x} className={cell.cls} style={{ width: "0.7em", display: "inline-block", textAlign: "center" }}>
                {cell.glyph}
              </span>
            ))}
          </div>
        ))}
      </pre>
      <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-0.5 text-[9px] text-muted-foreground">
        <div><span className="text-yellow-300 font-bold">@</span> hero</div>
        
        <div><span className="text-red-400 font-bold">M</span> enemy</div>
        <div><span className="text-yellow-400">$</span> loot</div>
        <div><span className="text-destructive/80">^</span> hazard</div>
        <div><span className="text-cyan-400">&</span> feature</div>
        <div><span className="text-primary">{"<>"}</span> entrance/exit</div>
        <div><span className="text-amber-300">·</span> trail</div>
      </div>
    </div>
  );
};

export default AsciiMap;
