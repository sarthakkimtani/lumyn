import { GlassView } from "expo-glass-effect";
import { Image } from "expo-image";
import { SFSymbol } from "expo-symbols";
import { Pressable, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { ThemedSymbolView } from "@/components/util/themed-symbol-view";

const SUGGESTIONS = [
  {
    icon: "lightbulb.fill" as SFSymbol,
    label: "Brainstorm ideas",
    prompt: "Help me brainstorm ideas for a new app feature.",
  },
  {
    icon: "doc.text.fill" as SFSymbol,
    label: "Help me write",
    prompt: "Help me write a concise message that sounds professional.",
  },
  {
    icon: "chevron.left.forwardslash.chevron.right" as SFSymbol,
    label: "Write code",
    prompt: "Write a clean React Native component for a settings row.",
  },
  {
    icon: "graduationcap.fill" as SFSymbol,
    label: "Explain a concept",
    prompt: "Explain state management in React Native with examples.",
  },
] as const;

export const EmptyChatArea = ({
  onSuggestionPress,
  temporary,
}: {
  onSuggestionPress?: (prompt: string) => void;
  temporary: boolean;
}) => {
  return (
    <View style={styles.chatArea}>
      {temporary ? (
        <ThemedSymbolView style={styles.logo} name="lock.shield.fill" themeColor="primary" />
      ) : (
        <Image
          style={styles.logo}
          source={require("@/assets/images/lumyn.png")}
          contentFit="fill"
        />
      )}
      <Text style={styles.title}>{temporary ? "Temporary Chat" : "How can I help?"}</Text>
      <Text style={styles.subtitle}>
        {temporary
          ? "Messages in this chat will not be saved"
          : "Start with a prompt or query to get started."}
      </Text>
      <View style={styles.suggestionsRow}>
        {SUGGESTIONS.map((suggestion) => (
          <View key={suggestion.label}>
            <Pressable onPress={() => onSuggestionPress?.(suggestion.prompt)}>
              <GlassView style={styles.suggestionChip} isInteractive>
                <ThemedSymbolView themeColor="primary" name={suggestion.icon} size={20} />
                <Text style={styles.suggestionText}>{suggestion.label}</Text>
              </GlassView>
            </Pressable>
          </View>
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
  logo: {
    width: 100,
    height: 100,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  suggestionText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.text,
  },
}));
