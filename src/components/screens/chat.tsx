import { useState } from "react";
import { Platform, Text, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { ChatInputBar } from "@/components/features/chat-input-bar";
import { ChatList } from "@/components/features/chat-list";
import { EmptyChatArea } from "@/components/features/empty-chat-area";

import { useChat } from "@/modules/local-llm";

const ThemedKeyboardAvoidingView = withUnistyles(KeyboardAvoidingView);

export const Chat = () => {
  const [message, setMessage] = useState("");
  const { transcript, content, loading, error, startStreaming } = useChat();

  const hasTranscript = transcript.entries.length > 0;

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setMessage("");
    await startStreaming(trimmed);
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
          <EmptyChatArea onSuggestionPress={setMessage} />
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
