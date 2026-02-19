import * as Application from "expo-application";
import { SFSymbol } from "expo-symbols";
import { ScrollView, Text } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { SettingsRow } from "@/components/features/settings/settings-row";
import { SettingsSection } from "@/components/features/settings/settings-section";
import { ThemePicker } from "@/components/features/settings/theme-picker";
import { ThemedSymbolView } from "@/components/util/themed-symbol-view";

const SettingsIcon = ({ name, size }: { name: SFSymbol; size?: number }) => (
  <ThemedSymbolView name={name} themeColor="textSecondary" size={size || 20} />
);

export const Settings = () => {
  return (
    <ScrollView
      style={styles.scrollView}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
    >
      <SettingsSection title="APPEARANCE">
        <SettingsRow
          label="Theme"
          icon={<SettingsIcon name="circle.lefthalf.filled" />}
          trailing={<ThemePicker />}
          isFirst
          isLast
        />
      </SettingsSection>

      <SettingsSection title="ABOUT">
        <SettingsRow
          label="Legal"
          icon={<SettingsIcon name="scroll.fill" />}
          trailing={<SettingsIcon name="chevron.right" size={16} />}
          isFirst
        />
        <SettingsRow
          label="Version"
          icon={<SettingsIcon name="info.circle.fill" />}
          trailing={<Text style={styles.valueText}>{Application.nativeApplicationVersion}</Text>}
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
    marginRight: 4,
  },
}));
