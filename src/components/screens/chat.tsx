import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, Text, View } from "react-native";
import { KeyboardAvoidingView, KeyboardController } from "react-native-keyboard-controller";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { ChatInputBar } from "@/components/features/chat/chat-input-bar";
import { ChatList } from "@/components/features/chat/chat-list";
import { EmptyChatArea } from "@/components/features/chat/empty-chat-area";
import { useChat } from "@/hooks/use-chat";

const ThemedKeyboardAvoidingView = withUnistyles(KeyboardAvoidingView);

type ChatProps = {
  onTranscriptChange?: (hasTranscript: boolean) => void;
};

export const Chat = ({ onTranscriptChange }: ChatProps) => {
  const [message, setMessage] = useState("");
  const { temporary } = useLocalSearchParams<{ temporary: string }>();
  const { transcript, content, loading, error, startStreaming } = useChat({
    temporary: temporary === "true",
  });

  const hasTranscript = transcript.entries.length > 0;

  useEffect(() => {
    onTranscriptChange?.(hasTranscript);
  }, [hasTranscript, onTranscriptChange]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setMessage("");
    await startStreaming(trimmed);
    await KeyboardController.dismiss();
  };

  return (
    <ThemedKeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <View style={styles.content}>
        {hasTranscript ? (
          <ChatList entries={transcript.entries} loading={loading} streamingContent={content} />
        ) : (
          <EmptyChatArea isTemporaryChat={temporary === "true"} onSuggestionPress={setMessage} />
        )}
      </View>
      <ChatInputBar
        value={message}
        loading={loading}
        onChangeText={setMessage}
        onSend={() => sendMessage(message)}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </ThemedKeyboardAvoidingView>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  errorText: {
    color: "#FF5A5A",
    marginHorizontal: 20,
    marginBottom: 8,
    fontSize: 12,
  },
}));
