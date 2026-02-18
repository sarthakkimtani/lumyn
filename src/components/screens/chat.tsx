import { useChat } from "@ai-sdk/react";
import { DirectChatTransport } from "ai";
import * as Crypto from "expo-crypto";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { ChatInputBar } from "@/components/features/chat/chat-input-bar";
import { ChatMessages } from "@/components/features/chat/chat-messages";
import { EmptyChatArea } from "@/components/features/chat/empty-chat-area";

import { ChatContext } from "@/contexts/chat-context";
import { useQueries } from "@/hooks/use-queries";
import { agent, AgentMessage } from "@/lib/agent";
import { extractTextFromMessage, getChatTitle } from "@/utils/chat";

const ThemedKeyboardAvoidingView = withUnistyles(KeyboardAvoidingView);

export const Chat = () => {
  const [input, setInput] = useState("");
  const { temporary, id } = useLocalSearchParams<{ temporary?: string; id?: string }>();
  const isTemporary = temporary === "true" && !id;

  const [chatId, setChatId] = useState(() => id ?? Crypto.randomUUID());
  const { upsertConversation, upsertMessages, fetchMessagesByConversationId } = useQueries();

  const persistChat = async (conversationId: string, msgs: AgentMessage[]) => {
    if (isTemporary || msgs.length === 0) return;
    const firstUserMessage = msgs.find((m) => m.role === "user");

    const title = firstUserMessage
      ? getChatTitle(extractTextFromMessage(firstUserMessage))
      : "Untitled chat";
    await upsertConversation({ id: conversationId, title });

    await upsertMessages(
      msgs.map((m) => ({
        id: m.id,
        conversationId,
        role: m.role,
        text: extractTextFromMessage(m),
      })),
    );
  };

  const { messages, sendMessage, setMessages, status, error, regenerate, stop } =
    useChat<AgentMessage>({
      id: chatId,
      generateId: () => Crypto.randomUUID(),
      transport: new DirectChatTransport({ agent }),
      onFinish: ({ messages: finalMessages }) => persistChat(chatId, finalMessages),
    });

  useEffect(() => {
    if (!id) return;
    setChatId(id);

    let cancelled = false;
    const loadMessages = async () => {
      const rows = await fetchMessagesByConversationId(id);
      if (cancelled || rows.length === 0) return;

      const restored: AgentMessage[] = rows.map((row) => ({
        id: row.id,
        role: row.role,
        parts: [{ type: "text", text: row.text }],
      }));

      setMessages(restored);
    };

    loadMessages();
    return () => {
      cancelled = true;
    };
  }, [fetchMessagesByConversationId, setMessages, id]);

  const submit = async () => {
    const text = input.trim();
    if (!text) return;

    setInput("");
    sendMessage({ text });
  };

  const startNewChat = () => {
    setChatId(Crypto.randomUUID());
    setMessages([]);

    router.setParams({
      id: "",
      temporary: "false",
    });
  };

  const toggleTemporaryMode = () => router.setParams({ temporary: (!isTemporary).toString() });

  return (
    <ChatContext.Provider value={{ status, messages, regenerate }}>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button
          icon="bubble.left.and.text.bubble.right"
          onPress={() => router.push("/conversations")}
        />
        <Stack.Toolbar.Button icon="gear" onPress={() => router.push("/settings")} />
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
        {messages.length > 0 ? (
          <ChatMessages messages={messages} error={error} />
        ) : (
          <EmptyChatArea temporary={isTemporary} onSuggestionPress={setInput} />
        )}
        <ChatInputBar
          value={input}
          status={status}
          onChangeText={setInput}
          onSend={submit}
          onStop={stop}
        />
      </ThemedKeyboardAvoidingView>
    </ChatContext.Provider>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));
