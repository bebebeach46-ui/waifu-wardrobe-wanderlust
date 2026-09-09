/**
 * BOND INTERLUDE GENERATOR
 * ------------------------
 * Every bond rank the hero climbs earns a short romantic interlude.
 * Every rank he loses earns a bitter one — an insult, a misread gift,
 * a botched quest that soured them.
 *
 * Scenes reference the companion's actual race anatomy (tails, wings, ears,
 * scales, horns), their gift preferences and their skill inclinations, so no
 * two companions get the same interlude.
 */

export type InterludeTone = "romance" | "hostile";

export type BondInterlude = {
  id: string;
  tone: InterludeTone;
  companionName: string;
  race: string;
  rank: number;
  rankName: string;
  title: string;
  quote: string;
  body: string;
  cause?: string;
  icon: string;
};

/** Anatomy phrases pulled from the race name itself. */
const featurePhrases = (race: string): string[] => {
  const r = (race || "").toLowerCase();
  const f: string[] = [];
  const add = (...xs: string[]) => f.push(...xs);

  if (/neko|cat|bakeneko|nekomata|bastet/.test(r)) add("twitching ears", "restless tail", "rough little tongue", "slit-pupil stare");
  if (/inu|dog|wolf|okami|were(fox|wolf)|skinwalker|anubis/.test(r)) add("pinned-back ears", "thumping tail", "warm scruff", "low throat-rumble");
  if (/kitsune|fox|tanuki|raccoon|squirrel/.test(r)) add("many tails", "brush of fur across your wrist", "sly flicked ear");
  if (/usagi|bunny|mouse/.test(r)) add("long trembling ears", "frantic heartbeat", "soft nose");
  if (/dragon|draugr|naga|apophis|lamia|siren|scaled|serpent|snake/.test(r)) add("warm scales", "coiling tail", "ridged spine", "slitted golden eyes");
  if (/wing|harpy|tengu|valkyrie|fairy|pixie|imp|succubus|phoenix|angel/.test(r)) add("half-spread wings", "primary feathers", "wingtips curling around you", "membranous wings shivering");
  if (/horn|oni|minotaur|ogre|incubus|yuki|cambion/.test(r)) add("polished horns", "horn-tips warm under your palm", "heavy brow");
  if (/tusk|orc|goblin/.test(r)) add("chipped tusks", "grin full of teeth");
  if (/slime|dryad|alraune|plant|flower/.test(r)) add("petal-soft edges", "sap-sweet skin", "shifting translucent form");
  if (/mermaid|selkie|kappa|fish/.test(r)) add("wet gleaming fins", "cool salt-damp skin", "webbed fingers");
  if (/vampire|dhampir|moroi|striga/.test(r)) add("cold fingertips", "fangs pressed to her own lip", "pulseless quiet");
  if (/ghost|shade|wraith|banshee|ethereal|translucent/.test(r)) add("almost-there hands", "chill that passes through you", "voice arriving before her mouth moves");
  if (/android|cyborg|homunculus|golem|stitched|patchwork|revenant/.test(r)) add("humming seams", "warm plating", "careful stitched hands");
  if (/spider|arachne|jorogumo/.test(r)) add("many patient eyes", "silk-spinning fingers", "chitin-smooth limbs");
  if (/centaur|holstaur|manticore|sphinx|chimera|lion/.test(r)) add("flicking tail", "powerful flanks", "mane heavy with road dust");
  if (/frost|ice|wight|wendigo|ghoul|plague|hag|bone|zombie|jiangshi|abyssal/.test(r)) add("frost-veined throat", "cold-mottled hands", "sunken beautiful face");
  if (/elf/.test(r)) add("sharp swept ears", "unhurried immortal patience");

  if (f.length === 0) add("callused hands", "scarred jaw", "steady breathing");
  return f;
};

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const romanceQuotes = [
  (n: string) => `"Don't look at me like that, ${n}. I'll start believing it."`,
  () => `"I have buried every person I let this close. And still — here you are."`,
  () => `"When you fell, I did not think about the quest. That frightens me."`,
  () => `"Say my name again. Slower. The way you did in the dark."`,
  () => `"I sharpened your blade tonight. I sharpened it twice. I had nothing else to do with my hands."`,
  () => `"You smell like smoke and bad decisions. I've decided I like both."`,
  () => `"If the gods want you, they can come through me first."`,
  () => `"I don't want a share of the gold. I want the seat beside you at the fire."`,
  () => `"Everyone else looks at what I am. You look at me."`,
  () => `"One day you'll ask me to stay. Ask badly. I'll still say yes."`,
];

const hostileQuotes = [
  () => `"I have counted every insult. There is a number now, and it is large."`,
  () => `"You looked straight through me. Again. One day you'll look and I won't be there."`,
  () => `"Keep your gold. It buys nothing back."`,
  () => `"I bled for that quest, and you called it adequate."`,
  () => `"I remember when your name meant something to me. That was the worst part."`,
  () => `"Sleep lightly, hero."`,
  () => `"You'd mourn a dead horse longer than you'd mourn me."`,
  () => `"Do not touch me. Not with those hands. Not tonight."`,
  () => `"I am not your follower. I am your creditor."`,
  () => `"The next time you fall, I will simply watch."`,
];

const romanceScenes = [
  (n: string, f: string, p: string) =>
    `Camp burns low. ${n} sits closer than the fire requires, ${f} brushing your arm each time she pretends to shift. She has hidden something in your pack — ${p.toLowerCase()}, badly wrapped, chosen with painful care.`,
  (n: string, f: string, p: string) =>
    `She corners you behind the supply tent, ${f} betraying her completely, and demands to know whether you noticed she carried your wounded weight three miles. You did. She wanted ${p.toLowerCase()}; she settles for your hand in hers.`,
  (n: string, f: string, p: string) =>
    `Rain. One cloak. ${n} does not offer hers — she simply steps under yours, ${f} pressed to your ribs, and talks about ${p.toLowerCase()} until neither of you is listening to the words.`,
  (n: string, f: string, p: string) =>
    `${n} bandages a wound you would have ignored, cursing you the whole time, ${f} shaking. Afterward she leaves ${p.toLowerCase()} on your bedroll and denies it for a week.`,
  (n: string, f: string, p: string) =>
    `Watch-shift, hours before dawn. ${n} lets her guard down for exactly one breath — ${f}, a confession half-swallowed — then threatens you with death if you repeat it. She still hums the song you traded her for ${p.toLowerCase()}.`,
  (n: string, f: string, p: string) =>
    `She hauls you off the field by the collar, snarling, ${f} slick with someone else's blood. In the dark of the wagon she asks for nothing but your pulse under her palm. Later: ${p.toLowerCase()}, pressed into your hands as if it were an apology.`,
];

const hostileScenes = [
  (n: string, f: string, c: string) =>
    `${n} does not raise her voice. She simply sets down your ration, ${f} rigid, and states the grievance: ${c}. Then she eats alone, upwind, where you can see her and cannot reach her.`,
  (n: string, f: string, c: string) =>
    `The gift comes back. ${n} drops it at your boots — wrong colour, wrong meaning, wrong hands — ${f} taut with an insult she is too proud to voice. ${c}`,
  (n: string, f: string, c: string) =>
    `Something was said in front of the others. ${n} laughed at the time. Now, ${f} turned away from the fire, she rehearses the reply she never gave. ${c}`,
  (n: string, f: string, c: string) =>
    `She sits in the exact spot where you'd have to step over her to leave, ${f} still as a drawn bow. ${c} No one else in the party will meet your eye tonight.`,
  (n: string, f: string, c: string) =>
    `${n} cleans her weapon far longer than the weapon requires, ${f} catching the firelight. ${c} She has stopped asking to be understood.`,
];

const hostileCauses = [
  (p: string) => `You brought back ${p.toLowerCase()} — the one thing she has told you twice she cannot stand.`,
  () => `A joke at her expense, in front of the whole party, and you did not correct it.`,
  () => `Her share of the last haul was short. She counted.`,
  () => `A ruined quest, and your first instinct was to name her cause.`,
  () => `She asked to be heard. You told her to hold the line instead.`,
  () => `You called her by another companion's name.`,
  () => `Her people were the punchline of a tavern story you repeated.`,
  () => `She saved your life and you thanked the healer.`,
];

const romanceTitles = [
  "A Quiet Hour", "Firelight Confession", "Under One Cloak", "Something Unsaid",
  "The Long Watch", "Closer Than Necessary", "Her Hands Steady", "The Gift She Denies",
];
const hostileTitles = [
  "Cold Rations", "The Returned Gift", "A Grievance Aired", "Nothing Said Aloud",
  "Sharpened Twice", "The Counting", "Turned Away From The Fire", "Debt Noted",
];

let counter = 0;

export const generateBondInterlude = (
  companion: any,
  rank: number,
  rankName: string,
  tone: InterludeTone,
  reasonHint?: string
): BondInterlude => {
  const name = companion?.name || "Your companion";
  const race = companion?.race || "Human";
  const feature = pick(featurePhrases(race));
  const prefs: string[] = companion?.preferences?.length ? companion.preferences : ["Flowers"];
  const pref = pick(prefs);
  const skillNote = companion?.skillPreference
    ? ` She has always said she only respects ${companion.skillPreference}-rank hands.`
    : "";

  counter += 1;
  const id = `interlude-${Date.now()}-${counter}`;

  if (tone === "romance") {
    return {
      id,
      tone,
      companionName: name,
      race,
      rank,
      rankName,
      icon: rank >= 10 ? "💍" : rank >= 8 ? "💞" : "💗",
      title: pick(romanceTitles),
      quote: pick(romanceQuotes)(name),
      body: pick(romanceScenes)(name, feature, pref) + skillNote,
      cause: reasonHint,
    };
  }

  const cause = reasonHint || pick(hostileCauses)(pref);
  return {
    id,
    tone,
    companionName: name,
    race,
    rank,
    rankName,
    icon: rank <= -9 ? "💀" : rank <= -5 ? "🗡️" : "🖤",
    title: pick(hostileTitles),
    quote: pick(hostileQuotes)(),
    body: pick(hostileScenes)(name, feature, cause),
    cause,
  };
};
