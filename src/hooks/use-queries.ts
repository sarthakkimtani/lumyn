import { desc } from "drizzle-orm";
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

  return { fetchConversations, upsertConversation, upsertTranscriptEntries };
};
