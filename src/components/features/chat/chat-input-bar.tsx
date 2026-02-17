import { ChatStatus } from "ai";
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
  status: ChatStatus;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onStop: () => void;
};

export const ChatInputBar = ({
  value,
  status,
  onChangeText,
  onSend,
  onStop,
}: ChatInputBarProps) => {
  const insets = useSafeAreaInsets();
  const isDisabled = status !== "ready";

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
          editable={!isDisabled}
        />
      </GlassView>
      <SendButton
        loading={status === "streaming"}
        onPress={status === "streaming" ? onStop : onSend}
      />
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
