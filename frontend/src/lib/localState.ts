export const STORAGE_KEYS = {
  theme: "helios-theme",
  calculator: "helios-calculator",
  game: "helios-city-game",
} as const;

export function saveLocal<T>(key: string, value: T) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage is optional */ }
}

export function readLocal<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch { return fallback; }
}