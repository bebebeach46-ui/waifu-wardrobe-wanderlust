// Player-facing settings, persisted locally so they survive reloads and apply to every run.
export interface GameSettings {
  simplifiedByDefault: boolean;
  showEventTicker: boolean;
  showNotifications: boolean;
}

const KEY = "quest-idle-settings";

export const defaultSettings: GameSettings = {
  simplifiedByDefault: false,
  showEventTicker: true,
  showNotifications: true,
};

export const loadSettings = (): GameSettings => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...defaultSettings };
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return { ...defaultSettings };
  }
};

export const saveSettings = (settings: GameSettings) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    /* storage unavailable — settings simply won't persist */
  }
};
