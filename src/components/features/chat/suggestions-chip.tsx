import { GlassView } from "expo-glass-effect";
import { Platform, Pressable, Text } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { SymbolIcon, ThemedSymbolView } from "@/components/util/themed-symbol-view";

interface SuggestionsChipProps {
  icon: SymbolIcon;
  label: string;
  prompt: string;
  onPress: () => void;
}

export const SuggestionsChip = ({ icon, label, onPress }: SuggestionsChipProps) => {
  return (
    <Pressable onPress={onPress}>
      <GlassView style={styles.suggestionChip} isInteractive>
        <ThemedSymbolView themeColor="primary" icon={icon} size={20} />
        <Text style={styles.suggestionText}>{label}</Text>
      </GlassView>
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  suggestionChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    borderRadius: 20,

    ...(Platform.OS === "android" && {
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
    }),
  },
  suggestionText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.text,
  },
}));
