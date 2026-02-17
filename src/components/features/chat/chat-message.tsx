import { AssistantMessage } from "@/components/features/chat/assistant-message";
import { UserMessage } from "@/components/features/chat/user-message";

import { AgentMessage } from "@/lib/agent";

export const ChatMessage = ({ message, isLast }: { message: AgentMessage; isLast?: boolean }) => {
  if (message.role === "system") return null;
  else if (message.role === "user") return <UserMessage message={message} />;
  else return <AssistantMessage message={message} isLast={isLast} />;
};
