export type FateOutcome = {
  type: "death" | "retirement" | "ascension" | "betrayal" | "legendary";
  description: string;
  shortDesc: string;
  isGameOver: boolean;
};

export const checkEarlyDeath = (_questsCompleted: number): FateOutcome | null => null;
export const checkRichRetirement = (_gold: number, _questsCompleted: number): FateOutcome | null => null;
export const checkLegendaryFate = (_level: number, _questsCompleted: number): FateOutcome | null => null;
export const checkLineageLegendary = (
  _uniqueHeirMothers: number,
  _favoriteName: string | null
): FateOutcome | null => null;

export const getNormalDeath = (): FateOutcome => ({
  type: "legendary",
  shortDesc: "Brush with oblivion",
  description: "The hero should have fallen — yet the saga rolls on.",
  isGameOver: false,
});
