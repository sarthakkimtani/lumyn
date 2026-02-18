import { UnistylesRuntime } from "react-native-unistyles";

import { storage } from "@/lib/storage";

export type ThemePreference = "light" | "dark" | "system";

const THEME_KEY = "theme";

export const getThemeFromStorage = (): ThemePreference => {
  const value = storage.getString(THEME_KEY);
  if (value === "light" || value === "dark" || value === "system") return value;
  return "system";
};

export const setThemeToStorage = (preference: ThemePreference) => {
  storage.set(THEME_KEY, preference);
  applyThemePreference(preference);
};

export const applyThemePreference = (preference: ThemePreference) => {
  if (preference === "system") {
    UnistylesRuntime.setAdaptiveThemes(true);
  } else {
    UnistylesRuntime.setAdaptiveThemes(false);
    UnistylesRuntime.setTheme(preference);
  }
};
