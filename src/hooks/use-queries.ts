import { asc, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";

import { conversations, transcriptEntries } from "@/db/schema";

export type TranscriptEntryInsert = typeof transcriptEntries.$inferInsert;
export type ConversationInsert = typeof conversations.$inferInsert;

export const useQueries = () => {
  const expoDb = useSQLiteContext();
  const db = drizzle(expoDb);

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

  const fetchTranscriptByConversationId = async (conversationId: string) => {
    return await db
      .select()
      .from(transcriptEntries)
      .where(eq(transcriptEntries.conversationId, conversationId))
      .orderBy(asc(transcriptEntries.createdAt), sql`rowid`);
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

  const upsertTranscriptEntries = async (entries: TranscriptEntryInsert[]) => {
    if (!entries.length) return;
    const res = await db.insert(transcriptEntries).values(entries).onConflictDoNothing();
    return res.changes;
  };

  return {
    fetchConversations,
    fetchConversationById,
    fetchTranscriptByConversationId,
    upsertConversation,
    upsertTranscriptEntries,
  };
};
