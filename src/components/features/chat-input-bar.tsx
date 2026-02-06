import { GlassView } from "expo-glass-effect";
import { SymbolView } from "expo-symbols";
import { Pressable, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

const ThemedTextInput = withUnistyles(TextInput, (theme) => ({
  placeholderTextColor: theme.colors.textSecondary,
}));

const ThemedGlassView = withUnistyles(GlassView, (theme) => ({
  tintColor: theme.colors.primary,
}));

export const ChatInputBar = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.inputContainer, { marginBottom: insets.bottom }]}>
      <GlassView style={styles.glassContainer} isInteractive>
        <ThemedTextInput
          style={styles.textInput}
          placeholder="Ask anything"
          multiline
          maxLength={2000}
        />
      </GlassView>
      <ThemedGlassView isInteractive style={styles.sendButton}>
        <Pressable accessibilityRole="button">
          <SymbolView name="arrow.up" size={22} weight="bold" tintColor="#FFF" />
        </Pressable>
      </ThemedGlassView>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 10,
    marginHorizontal: 14,
    gap: 10,
  },
  glassContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    minHeight: 45,
  },
  textInput: {
    fontSize: 16,
    color: theme.colors.text,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
}));
