import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";

import { Chat } from "@/components/screens/chat";

export default function ChatScreen() {
  const { temporary } = useLocalSearchParams<{ temporary: string }>();
  const isTemporary = temporary === "true";
  const [chatInstanceKey, setChatInstanceKey] = useState(0);
  const [hasStartedChat, setHasStartedChat] = useState(false);

  const startNewChat = () => {
    router.setParams({ temporary: "false" });
    setChatInstanceKey((prev) => prev + 1);
    setHasStartedChat(false);
  };

  return (
    <>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button icon={"bubble.left.and.text.bubble.right"} onPress={() => {}} />
        <Stack.Toolbar.Button icon="gear" onPress={() => {}} />
      </Stack.Toolbar>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          hidden={!hasStartedChat}
          icon="square.and.pencil"
          onPress={startNewChat}
        />
        <Stack.Toolbar.Button
          hidden={hasStartedChat}
          icon={isTemporary ? "shield.fill" : "shield"}
          onPress={() => router.setParams({ temporary: (!isTemporary).toString() })}
        />
      </Stack.Toolbar>

      <Chat key={chatInstanceKey} onTranscriptChange={setHasStartedChat} />
    </>
  );
}
