type EventSentiment = 'negative' | 'neutral' | 'positive';

interface Event {
  text: string;
  sentiment: EventSentiment;
}

const events: Event[] = [
  { text: "Accidentally triggered a death flag. Narrator is concerned.", sentiment: 'negative' },
  { text: "Found a mysterious glowing object. Probably not important.", sentiment: 'neutral' },
  { text: "Met a talking cat. Didn't sign the contract.", sentiment: 'positive' },
  { text: "Discovered a hidden hot spring. Fan service increased.", sentiment: 'positive' },
  { text: "Triggered a random encounter. It's actually just a merchant.", sentiment: 'neutral' },
  { text: "Entered a tournament arc. Will take several episodes.", sentiment: 'neutral' },
  { text: "Met a tsundere. They definitely don't like you. B-baka!", sentiment: 'negative' },
  { text: "Found a convenient plot device. Will use later.", sentiment: 'positive' },
  { text: "Stepped on a landmine. Not the explosive kind.", sentiment: 'negative' },
  { text: "Witnessed a training montage. Muscles increased temporarily.", sentiment: 'positive' },
  { text: "Received a letter from the Demon Lord. It's just spam.", sentiment: 'neutral' },
  { text: "Accidentally became a hero. Again.", sentiment: 'neutral' },
  { text: "Found a legendary sword in a stone. It was just decoration.", sentiment: 'negative' },
  { text: "Met the final boss in a coffee shop. Awkward small talk ensued.", sentiment: 'neutral' },
  { text: "Discovered a secret dungeon. It's actually a Starbucks.", sentiment: 'neutral' },
  { text: "Triggered a beach episode. Plot progression halted.", sentiment: 'neutral' },
  { text: "Found a save point. The universe is self-aware.", sentiment: 'positive' },
  { text: "Met a mysterious cloaked figure. It was just a really short guy.", sentiment: 'neutral' },
  { text: "Discovered the power of friendship. +0 to all stats.", sentiment: 'neutral' },
  { text: "Entered a trap. Gender unchanged, disappointingly.", sentiment: 'negative' },
  { text: "Found a gacha machine. Wallet started crying.", sentiment: 'negative' },
  { text: "Met Truck-kun. Survived somehow.", sentiment: 'positive' },
  { text: "Discovered a plot hole. Ignored it professionally.", sentiment: 'neutral' },
  { text: "Triggered a flashback sequence. Lost 5 minutes.", sentiment: 'negative' },
  { text: "Found the chosen one. It wasn't you.", sentiment: 'negative' },
  { text: "Discovered a hidden boss. Noped out immediately.", sentiment: 'negative' },
  { text: "Met a childhood friend. Lost the main girl position.", sentiment: 'negative' },
  { text: "Found a mysterious egg. Not touching that.", sentiment: 'neutral' },
  { text: "Triggered a cooking mini-game. Burned water.", sentiment: 'negative' },
  { text: "Met a loli. FBI open up!", sentiment: 'negative' },
  { text: "Discovered power levels. They're over 9000!", sentiment: 'positive' },
  { text: "Found a transformation sequence. Takes 3 episodes.", sentiment: 'neutral' },
  { text: "Met a rival. They have cooler hair.", sentiment: 'negative' },
  { text: "Discovered a harem route. Confusion intensified.", sentiment: 'neutral' },
  { text: "Found a cheat skill. It's farming.", sentiment: 'neutral' },
  { text: "Met a goddess. She's useless.", sentiment: 'negative' },
  { text: "Discovered a dungeon. It's full of slimes.", sentiment: 'neutral' },
  { text: "Found a rare drop. It's vendor trash.", sentiment: 'negative' },
  { text: "Met a generic elf. She likes forests.", sentiment: 'neutral' },
  { text: "Discovered a dragon. It wants to be your waifu.", sentiment: 'positive' },
  { text: "Found a magic academy. Everyone is OP except you.", sentiment: 'negative' },
  { text: "Met a vampire. Sparkles disappointingly absent.", sentiment: 'neutral' },
  { text: "Discovered a ninja village. Everyone saw you coming.", sentiment: 'negative' },
  { text: "Found a mecha. No instruction manual included.", sentiment: 'neutral' },
  { text: "Met a zombie. It wants brains. Yours are safe.", sentiment: 'neutral' },
  { text: "Discovered a time loop. Déjà vu intensifies.", sentiment: 'neutral' },
  { text: "Found a guild. Registration paperwork is endless.", sentiment: 'negative' },
  { text: "Met a deity. They're into mobile games.", sentiment: 'neutral' },
  { text: "Discovered a prophecy. You're not in it.", sentiment: 'negative' },
  { text: "Found a legendary treasure. It's a cabbage.", sentiment: 'negative' }
];

export type { Event };

export const generateEventLog = (): Event => {
  return events[Math.floor(Math.random() * events.length)];
};
