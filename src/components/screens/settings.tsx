import * as Application from "expo-application";
import { SFSymbol } from "expo-symbols";
import { ScrollView, Text } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { SettingsRow } from "@/components/features/settings/settings-row";
import { SettingsSection } from "@/components/features/settings/settings-section";
import { ThemePicker } from "@/components/features/settings/theme-picker";
import { MaterialSymbol, ThemedSymbolView } from "@/components/util/themed-symbol-view";

const SettingsIcon = ({
  icon,
  size,
}: {
  icon: { ios: SFSymbol; android: MaterialSymbol };
  size?: number;
}) => <ThemedSymbolView icon={icon} themeColor="textSecondary" size={size || 20} />;

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
          icon={<SettingsIcon icon={{ ios: "circle.lefthalf.filled", android: "contrast" }} />}
          trailing={<ThemePicker />}
          isFirst
          isLast
        />
      </SettingsSection>

      <SettingsSection title="ABOUT">
        <SettingsRow
          label="Legal"
          icon={<SettingsIcon icon={{ ios: "scroll.fill", android: "gavel" }} />}
          trailing={
            <SettingsIcon icon={{ ios: "chevron.right", android: "chevron-right" }} size={16} />
          }
          isFirst
        />
        <SettingsRow
          label="Version"
          icon={<SettingsIcon icon={{ ios: "info.circle.fill", android: "info" }} />}
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
