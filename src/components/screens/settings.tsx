import * as Application from "expo-application";
import { SFSymbol } from "expo-symbols";
import { useState } from "react";
import { ScrollView, Text } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { SettingsRow } from "@/components/features/settings/settings-row";
import { SettingsSection } from "@/components/features/settings/settings-section";
import { ThemedSymbolView } from "@/components/util/themed-symbol-view";
import { getThemeFromStorage, setThemeToStorage, type ThemePreference } from "@/lib/theme";

const THEME_OPTIONS: { value: ThemePreference; label: string; icon: SFSymbol }[] = [
  { value: "system", label: "System", icon: "circle.lefthalf.filled" },
  { value: "light", label: "Light", icon: "sun.max.fill" },
  { value: "dark", label: "Dark", icon: "moon.fill" },
];

export const Settings = () => {
  const [theme, setTheme] = useState<ThemePreference>(getThemeFromStorage);

  const handleThemeChange = (preference: ThemePreference) => {
    setTheme(preference);
    setThemeToStorage(preference);
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
    >
      <SettingsSection
        title="APPEARANCE"
        footer="Choose System to automatically match your device appearance."
      >
        {THEME_OPTIONS.map((option, index) => (
          <SettingsRow
            key={option.value}
            label={option.label}
            icon={<ThemedSymbolView name={option.icon} themeColor="textSecondary" size={20} />}
            trailing={
              theme === option.value ? (
                <ThemedSymbolView
                  name="checkmark"
                  themeColor="primary"
                  size={18}
                  weight="semibold"
                />
              ) : undefined
            }
            isFirst={index === 0}
            isLast={index === THEME_OPTIONS.length - 1}
            onPress={() => handleThemeChange(option.value)}
          />
        ))}
      </SettingsSection>

      <SettingsSection title="ABOUT">
        <SettingsRow
          label="Version"
          icon={<ThemedSymbolView name="info.circle.fill" themeColor="textSecondary" size={20} />}
          trailing={<Text style={styles.valueText}>{Application.nativeApplicationVersion}</Text>}
          isFirst
          isLast
        />
      </SettingsSection>
    </ScrollView>
  );
};

const styles = StyleSheet.create((theme) => ({
  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  valueText: {
    color: theme.colors.textSecondary,
    fontSize: 17,
    lineHeight: 22,
  },
}));
