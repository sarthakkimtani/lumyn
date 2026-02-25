import { useQueries } from "@/hooks/use-queries";
import { AgentMessage } from "@/lib/agent";
import { extractReasoningFromMessage, extractTextFromMessage, getChatTitle } from "@/utils/chat";

export const usePersistChat = ({ persist }: { persist: boolean }) => {
  const { upsertConversation, upsertMessages } = useQueries();

  return async (conversationId: string, msgs: AgentMessage[]) => {
    if (!persist || msgs.length === 0) return;

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
        reasoningText: extractReasoningFromMessage(m),
      })),
    );
  };
};
