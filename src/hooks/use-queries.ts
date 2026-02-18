import { asc, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";

import { conversations, messages } from "@/db/schema";

export type MessageInsert = typeof messages.$inferInsert;
export type ConversationInsert = typeof conversations.$inferInsert;

export const useQueries = () => {
  const expoDb = useSQLiteContext();
  const db = drizzle(expoDb);

  const deleteConversationById = async (id: string) => {
    return await db.delete(conversations).where(eq(conversations.id, id));
  };

  const deleteMessageById = async (id: string) => {
    return await db.delete(messages).where(eq(messages.id, id));
  };

  const fetchConversations = async () => {
    return await db.select().from(conversations).orderBy(desc(conversations.createdAt));
  };

  const fetchConversationById = async (conversationId: string) => {
    const rows = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);

    return rows[0] ?? null;
  };

  const fetchMessagesByConversationId = async (conversationId: string) => {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(asc(messages.createdAt), sql`rowid`);
  };

  const upsertConversation = async (insertEntry: ConversationInsert) => {
    const res = await db
      .insert(conversations)
      .values(insertEntry)
      .onConflictDoUpdate({
        target: conversations.id,
        set: { title: insertEntry.title },
      });
    return res.changes;
  };

  const upsertMessages = async (entries: MessageInsert[]) => {
    if (!entries.length) return;
    const res = await db.insert(messages).values(entries).onConflictDoNothing();
    return res.changes;
  };

  return {
    deleteConversationById,
    deleteMessageById,
    fetchConversations,
    fetchConversationById,
    fetchMessagesByConversationId,
    upsertConversation,
    upsertMessages,
  };
};
