import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";

import { ChatRoot } from "@/components/features/chat/chat-root";
import { ChatToolbar } from "@/components/toolbars/chat-toolbar";

export const Chat = () => {
  const { temporary } = useLocalSearchParams<{ temporary: string }>();
  const isTemporary = temporary === "true";

  const [chatInstanceKey, setChatInstanceKey] = useState(0);
  const [hasTranscript, setHasTranscript] = useState(false);

  const startNewChat = () => {
    router.setParams({ temporary: "false" });
    setChatInstanceKey((prev) => prev + 1);
    setHasTranscript(false);
  };

  return (
    <>
      <ChatToolbar
        hasTranscript={hasTranscript}
        onNewChat={startNewChat}
        rightActions={
          <Stack.Toolbar.Button
            hidden={hasTranscript}
            icon={isTemporary ? "shield.fill" : "shield"}
            onPress={() => router.setParams({ temporary: (!isTemporary).toString() })}
          />
        }
      />
      <ChatRoot
        key={chatInstanceKey}
        temporary={isTemporary}
        onHasTranscriptChange={setHasTranscript}
      />
    </>
  );
};
