/** How finished morgue files leave the game. */
export type MorgueAutoExport = "device" | "manual";

const KEY = "quest-idle-morgue-export";

export const loadMorgueExport = (): MorgueAutoExport => {
  try {
    return localStorage.getItem(KEY) === "manual" ? "manual" : "device";
  } catch {
    return "device";
  }
};

export const saveMorgueExport = (v: MorgueAutoExport) => {
  try { localStorage.setItem(KEY, v); } catch { /* ignore */ }
};

export const morgueFileName = (heroName: string, kind: "death" | "victory") => {
  const safe = heroName.replace(/[^\w-]+/g, "_").slice(0, 40) || "hero";
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  return `morgue_${kind}_${safe}_${stamp}.txt`;
};

/** Saves the text file to the device's downloads folder. */
export const downloadMorgue = (text: string, fileName: string) => {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/** Lets the player pick a folder/file name where the browser supports it; falls back to a download. */
export const saveMorgueAs = async (text: string, fileName: string): Promise<boolean> => {
  const picker = (window as any).showSaveFilePicker;
  if (typeof picker === "function") {
    try {
      const handle = await picker({ suggestedName: fileName, types: [{ description: "Morgue file", accept: { "text/plain": [".txt"] } }] });
      const w = await handle.createWritable();
      await w.write(text);
      await w.close();
      return true;
    } catch (e: any) {
      if (e?.name === "AbortError") return false;
    }
  }
  downloadMorgue(text, fileName);
  return true;
};
