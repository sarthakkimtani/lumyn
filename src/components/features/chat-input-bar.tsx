import { GlassView } from "expo-glass-effect";
import { SymbolView } from "expo-symbols";
import { Pressable, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";

export const ChatInputBar = () => {
  const insets = useSafeAreaInsets();
  const theme = UnistylesRuntime.getTheme();

  return (
    <GlassView style={[styles.inputContainer, { marginBottom: insets.bottom }]}>
      <TextInput
        style={styles.textInput}
        placeholder="Ask anything"
        placeholderTextColor={theme.colors.textSecondary}
        multiline
        maxLength={2000}
      />
      <Pressable
        style={({ pressed }) => [styles.sendButton, pressed ? styles.sendButtonPressed : null]}
        accessibilityRole="button"
      >
        <SymbolView name="arrow.up" size={16} weight="bold" tintColor="#FFF" />
      </Pressable>
    </GlassView>
  );
};

const styles = StyleSheet.create((theme) => ({
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    margin: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 24,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    paddingVertical: 8,
    textAlignVertical: "top",
    lineHeight: 21,
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    marginBottom: 2,
  },
  sendButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
}));
