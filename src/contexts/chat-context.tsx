import { ChatRequestOptions, ChatStatus } from "ai";
import { createContext, useContext } from "react";

import type { AgentMessage } from "@/lib/agent";

type ChatContextValue = {
  status: ChatStatus;
  messages: AgentMessage[];
  regenerate: ({
    messageId,
    ...options
  }?: {
    messageId?: string;
  } & ChatRequestOptions) => Promise<void>;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be used inside ChatProvider");
  return ctx;
}

export { ChatContext };
