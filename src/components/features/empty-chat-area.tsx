import { GlassView } from "expo-glass-effect";
import { Image } from "expo-image";
import { SFSymbol, SymbolView } from "expo-symbols";
import { Pressable, Text, View } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

const SUGGESTIONS = [
  { icon: "lightbulb.fill" as SFSymbol, label: "Brainstorm ideas" },
  { icon: "doc.text.fill" as SFSymbol, label: "Help me write" },
  { icon: "chevron.left.forwardslash.chevron.right" as SFSymbol, label: "Write code" },
  { icon: "graduationcap.fill" as SFSymbol, label: "Explain a concept" },
] as const;

const UniSymbolView = withUnistyles(SymbolView, (theme) => ({
  tintColor: theme.colors.primary,
}));

export const EmptyChatArea = () => {
  return (
    <View style={styles.chatArea}>
      <Image
        style={{ width: 100, height: 100, marginBottom: 20 }}
        source={require("@/assets/images/lumyn.png")}
        contentFit="fill"
      />
      <Text style={styles.title}>How can I help?</Text>
      <Text style={styles.subtitle}>Start with a prompt or query to get started.</Text>
      <View style={styles.suggestionsRow}>
        {SUGGESTIONS.map((suggestion) => (
          <GlassView key={suggestion.label} style={styles.suggestionChip} isInteractive>
            <Pressable style={styles.suggestionChipPressable}>
              <UniSymbolView name={suggestion.icon} size={20} />
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
  suggestionChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
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
