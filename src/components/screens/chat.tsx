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
import { usePersistChat } from "@/hooks/use-persist-chat";
import { useRestoredMessages } from "@/hooks/use-restored-messages";
import { agent, AgentMessage } from "@/lib/agent";

const ThemedKeyboardAvoidingView = withUnistyles(KeyboardAvoidingView);

export const Chat = () => {
  const [input, setInput] = useState("");
  const { temporary, id } = useLocalSearchParams<{ temporary?: string; id?: string }>();
  const isTemporary = temporary === "true" && !id;

  const [chatId, setChatId] = useState(() => id ?? Crypto.randomUUID());
  const persistChat = usePersistChat({ persist: !isTemporary });

  const { messages, sendMessage, setMessages, status, error, regenerate, stop } =
    useChat<AgentMessage>({
      id: chatId,
      generateId: () => Crypto.randomUUID(),
      transport: new DirectChatTransport({ agent: agent }),
      onFinish: ({ messages: finalMessages }) => persistChat(chatId, finalMessages),
    });

  const restoredMessages = useRestoredMessages(id);

  useEffect(() => {
    if (!id) return;
    setChatId(id);

    if (restoredMessages) {
      setMessages(restoredMessages);
    }
  }, [id, restoredMessages, setMessages]);

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
