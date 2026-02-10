import { sql } from "drizzle-orm";
import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const conversations = sqliteTable("conversations", {
  id: text("id").primaryKey(),
  title: text("title"),
  createdAt: int("created_at")
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: int("updated_at")
    .notNull()
    .default(sql`(unixepoch())`),
});

export const transcriptEntries = sqliteTable(
  "transcript_entries",
  {
    id: text("id").primaryKey(),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    role: text("role", {
      enum: ["instructions", "prompt", "response", "toolCalls", "toolOutput"],
    }).notNull(),
    text: text("text").notNull(),
    createdAt: int("created_at")
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => [index("idx_transcript_conversation").on(t.conversationId)],
);
