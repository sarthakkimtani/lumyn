import { GlassContainer, GlassView } from "expo-glass-effect";
import { TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { SendButton } from "@/components/features/chat/send-button";

const ThemedTextInput = withUnistyles(TextInput, (theme) => ({
  placeholderTextColor: theme.colors.textSecondary,
}));

type ChatInputBarProps = {
  value: string;
  loading: boolean;
  onChangeText: (text: string) => void;
  onSend: () => void;
  disabled?: boolean;
};

export const ChatInputBar = ({
  value,
  loading,
  onChangeText,
  onSend,
  disabled = false,
}: ChatInputBarProps) => {
  const insets = useSafeAreaInsets();
  const canSend = value.trim().length > 0 && !loading && !disabled;

  return (
    <GlassContainer style={[styles.inputContainer, { marginBottom: insets.bottom }]}>
      <GlassView style={styles.glassContainer} isInteractive>
        <ThemedTextInput
          style={styles.textInput}
          placeholder="Ask anything"
          multiline
          maxLength={2000}
          value={value}
          onChangeText={onChangeText}
          editable={!disabled}
        />
      </GlassView>
      <SendButton loading={loading} disabled={!canSend} onSend={onSend} />
    </GlassContainer>
  );
};

export const styles = StyleSheet.create((theme) => ({
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 10,
    marginHorizontal: 14,
    maxHeight: 140,
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
}));
