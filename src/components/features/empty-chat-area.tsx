import { GlassView } from "expo-glass-effect";
import { SFSymbol, SymbolView } from "expo-symbols";
import { Pressable, Text, View } from "react-native";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";

const SUGGESTIONS = [
  { icon: "lightbulb.fill" as SFSymbol, label: "Brainstorm ideas" },
  { icon: "doc.text.fill" as SFSymbol, label: "Help me write" },
  { icon: "chevron.left.forwardslash.chevron.right" as SFSymbol, label: "Write code" },
  { icon: "graduationcap.fill" as SFSymbol, label: "Explain a concept" },
] as const;

export const EmptyChatArea = () => {
  const theme = UnistylesRuntime.getTheme();

  return (
    <View style={styles.chatArea}>
      <Text style={styles.title}>How can I help?</Text>
      <Text style={styles.subtitle}>Start with a prompt or query to get started.</Text>

      <View style={styles.suggestionsRow}>
        {SUGGESTIONS.map((suggestion) => (
          <GlassView key={suggestion.label} style={styles.suggestionChip}>
            <Pressable style={styles.suggestionChipPressable}>
              <SymbolView name={suggestion.icon} size={20} tintColor={theme.colors.primary} />
              <Text style={styles.suggestionText}>{suggestion.label}</Text>
            </Pressable>
          </GlassView>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  chatArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 22,
    color: theme.colors.textSecondary,
    textAlign: "center",
    maxWidth: 280,
  },
  suggestionsRow: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  suggestionsContainer: {
    paddingHorizontal: 8,
    gap: 10,
  },
  suggestionChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.primary + "20",
  },
  suggestionChipPressable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  suggestionText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.text,
  },
}));
