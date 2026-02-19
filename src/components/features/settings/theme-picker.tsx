import { MenuView } from "@react-native-menu/menu";
import { useState } from "react";
import { Text } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { ThemedSymbolView } from "@/components/util/themed-symbol-view";

import { getThemeFromStorage, setThemeToStorage, ThemePreference } from "@/lib/theme";

const THEME_OPTIONS: { id: ThemePreference; title: string; image: string; imageColor: string }[] = [
  { id: "system", title: "System", image: "circle.lefthalf.filled", imageColor: "grey" },
  { id: "light", title: "Light", image: "sun.max.fill", imageColor: "grey" },
  { id: "dark", title: "Dark", image: "moon.fill", imageColor: "grey" },
];

const capitalizeFirstLetter = (s: string) => s?.[0].toUpperCase() + s?.slice(1);

export const ThemePicker = () => {
  const [theme, setTheme] = useState<ThemePreference>(getThemeFromStorage);

  const handleThemeChange = (preference: ThemePreference) => {
    setTheme(preference);
    setThemeToStorage(preference);
  };

  return (
    <MenuView
      style={{ flexDirection: "row", alignItems: "center", gap: 2 }}
      title="Select Theme"
      actions={THEME_OPTIONS.map((option) => ({
        ...option,
        state: theme === option.id ? "on" : "off",
      }))}
      onPressAction={({ nativeEvent }) => handleThemeChange(nativeEvent.event as ThemePreference)}
      themeVariant={theme !== "system" ? theme : undefined}
    >
      <Text style={styles.valueText}>{capitalizeFirstLetter(theme)}</Text>
      <ThemedSymbolView name="chevron.up.chevron.down" themeColor="textSecondary" size={12} />
    </MenuView>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  valueText: {
    color: theme.colors.textSecondary,
    fontSize: 17,
    lineHeight: 22,
    marginRight: 4,
  },
}));
