import { Linking, Pressable, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { ThemedSymbolView } from "@/components/util/themed-symbol-view";

import { availabilityConfig } from "@/constants/availability";
import { ModelAvailability } from "@/modules/local-llm";

export const Unavailable = ({ reason }: { reason: ModelAvailability }) => {
  const config = availabilityConfig[reason];

  const openSettings = async () => {
    try {
      await Linking.openSettings();
    } catch {
      // No-op fallback.
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <ThemedSymbolView size={32} name={config.icon} themeColor="error" />
        </View>

        <Text style={styles.title}>{config.title}</Text>
        <Text style={styles.description}>{config.description}</Text>

        <View style={styles.detailRow}>
          <ThemedSymbolView size={13} name={config.detail.icon} themeColor="sectionHeader" />
          <Text style={styles.detailText}>{config.detail.label}</Text>
        </View>

        {config.showSettingsButton && (
          <Pressable
            style={({ pressed }) => [
              styles.settingsButton,
              pressed && styles.settingsButtonPressed,
            ]}
            onPress={openSettings}
          >
            <Text style={styles.settingsButtonText}>Open Settings</Text>
            <ThemedSymbolView size={13} name="arrow.up.forward" themeColor="primary" />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  content: {
    alignItems: "center",
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "center",
    letterSpacing: -0.4,
  },
  description: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: theme.colors.card,
  },
  detailText: {
    fontSize: 13,
    fontWeight: "500",
    color: theme.colors.sectionHeader,
  },
  settingsButton: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 20,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.cardBorder,
  },
  settingsButtonPressed: {
    backgroundColor: theme.colors.cardPressed,
  },
  settingsButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.primary,
  },
}));
