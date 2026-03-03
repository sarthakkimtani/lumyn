import { ChatStatus } from "ai";
import { GlassContainer, GlassView } from "expo-glass-effect";
import { useEffect, useState } from "react";
import { Keyboard, Platform, TextInput } from "react-native";
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
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const isDisabled = status !== "ready";
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(showEvent, () => setIsKeyboardVisible(true));
    const hideSubscription = Keyboard.addListener(hideEvent, () => setIsKeyboardVisible(false));

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <GlassContainer
      style={[styles.inputContainer, { marginBottom: isKeyboardVisible ? 20 : insets.bottom }]}
    >
      <GlassView
        style={[styles.glassContainer, Platform.OS === "android" && styles.androidInput]}
        isInteractive
      >
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
      <SendButton onPress={status === "streaming" ? onStop : onSend} />
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
  androidInput: {
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    borderRadius: 24,
  },
}));
