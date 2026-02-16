import { useChat } from "@ai-sdk/react";
import { DirectChatTransport } from "ai";
import * as Crypto from "expo-crypto";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { ChatInputBar } from "@/components/features/chat/chat-input-bar";
import { ChatMessages } from "@/components/features/chat/chat-messages";
import { EmptyChatArea } from "@/components/features/chat/empty-chat-area";

import { useQueries } from "@/hooks/use-queries";
import { agent, AgentMessage } from "@/lib/agent";
import { extractTextFromMessage, getChatTitle } from "@/utils/chat";

const ThemedKeyboardAvoidingView = withUnistyles(KeyboardAvoidingView);

export const Chat = () => {
  const [input, setInput] = useState("");
  const { temporary, id } = useLocalSearchParams<{ temporary?: string; id?: string }>();
  const [chatId, setChatId] = useState(() => id ?? Crypto.randomUUID());
  const isTemporary = temporary === "true" && !id;

  const { upsertConversation, upsertMessages, fetchMessagesByConversationId } = useQueries();

  const isTemporaryRef = useRef(isTemporary);
  isTemporaryRef.current = isTemporary;

  const chatIdRef = useRef(chatId);
  chatIdRef.current = chatId;

  const persistChat = useCallback(
    async (msgs: AgentMessage[]) => {
      if (isTemporaryRef.current || msgs.length === 0) return;

      const currentChatId = chatIdRef.current;
      const firstUserMessage = msgs.find((m) => m.role === "user");
      const title = firstUserMessage
        ? getChatTitle(extractTextFromMessage(firstUserMessage))
        : "Untitled chat";

      await upsertConversation({ id: currentChatId, title });
      await upsertMessages(
        msgs
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((m) => ({
            id: m.id,
            conversationId: currentChatId,
            role: m.role as "user" | "assistant",
            text: extractTextFromMessage(m),
          })),
      );
    },
    [upsertConversation, upsertMessages],
  );

  const { messages, sendMessage, setMessages, status, error } = useChat<AgentMessage>({
    id: chatId,
    transport: new DirectChatTransport({ agent }),
    onFinish: ({ messages: finalMessages }) => persistChat(finalMessages),
  });

  useEffect(() => {
    if (!id) return;
    setChatId(id);

    const loadMessages = async () => {
      const rows = await fetchMessagesByConversationId(id);
      if (rows.length === 0) return;

      const restored: AgentMessage[] = rows.map((row) => ({
        id: row.id,
        role: row.role as "user" | "assistant",
        parts: [{ type: "text" as const, text: row.text }],
      }));

      setMessages(restored);
    };

    void loadMessages();
  }, [id, fetchMessagesByConversationId, setMessages]);

  const submit = async () => {
    const text = input.trim();
    if (!text) return;

    setInput("");
    sendMessage({ text });
  };

  const startNewChat = () => {
    setChatId(Crypto.randomUUID());
    router.setParams({ id: "" });
  };
  const toggleTemporaryMode = () => router.setParams({ temporary: (!isTemporary).toString() });

  return (
    <>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button
          icon="bubble.left.and.text.bubble.right"
          onPress={() => router.push("/conversations")}
        />
        <Stack.Toolbar.Button icon="gear" onPress={() => {}} />
      </Stack.Toolbar>

      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          hidden={messages.length === 0}
          icon="square.and.pencil"
          onPress={startNewChat}
        />
        <Stack.Toolbar.Button
          hidden={messages.length > 0}
          icon={isTemporary ? "shield.fill" : "shield"}
          onPress={toggleTemporaryMode}
        />
      </Stack.Toolbar>

      <ThemedKeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <View style={{ flex: 1 }}>
          {messages.length > 0 ? (
            <ChatMessages messages={messages} />
          ) : (
            <EmptyChatArea temporary={isTemporary} onSuggestionPress={setInput} />
          )}
        </View>
        <ChatInputBar value={input} status={status} onChangeText={setInput} onSend={submit} />
        {error ? <Text style={styles.errorText}>{error.message}</Text> : null}
      </ThemedKeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  errorText: {
    color: theme.colors.error,
    textAlign: "center",
    fontSize: 14,
  },
}));
