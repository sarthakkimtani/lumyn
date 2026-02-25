import { useEffect, useState } from "react";

import { useQueries } from "@/hooks/use-queries";
import { AgentMessage } from "@/lib/agent";

function mapRowsToMessages(rows: any[]): AgentMessage[] {
  return rows.map((row) => ({
    id: row.id,
    role: row.role,
    parts: [
      { type: "text", text: row.text },
      ...(row.reasoningText ? [{ type: "reasoning", text: row.reasoningText } as const] : []),
    ],
  }));
}

export const useRestoredMessages = (conversationId?: string) => {
  const { fetchMessagesByConversationId } = useQueries();
  const [messages, setMessages] = useState<AgentMessage[] | null>(null);

  useEffect(() => {
    if (!conversationId) return;
    let disposed = false;

    const load = async () => {
      const rows = await fetchMessagesByConversationId(conversationId);
      if (disposed) return;

      setMessages(mapRowsToMessages(rows));
    };

    load();

    return () => {
      disposed = true;
    };
  }, [conversationId, fetchMessagesByConversationId]);

  return messages;
};
