import { FlashList } from "@shopify/flash-list";
import { useEffect, useMemo, useRef } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { ChatListItem } from "@/components/features/chat-list-item";
import { StreamingItem } from "@/components/features/streaming-item";

import { TranscriptEntry } from "@/modules/local-llm";

type ChatListProps = {
  entries: TranscriptEntry[];
  loading: boolean;
  streamingContent: string;
};

type ChatRow =
  | { type: "entry"; id: string; entry: TranscriptEntry }
  | { type: "streaming"; id: string };

export const ChatList = ({ entries, loading, streamingContent }: ChatListProps) => {
  const listRef = useRef<any>(null);

  const rows = useMemo<ChatRow[]>(() => {
    const mappedEntries: ChatRow[] = entries.map((entry, index) => ({
      type: "entry",
      id: entry.id ?? `${entry.role}-${index}`,
      entry,
    }));

    if (loading) {
      mappedEntries.push({ type: "streaming", id: "__streaming__" });
    }

    return mappedEntries;
  }, [entries, loading]);

  useEffect(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }, [streamingContent, rows.length]);

  return (
    <FlashList
      ref={listRef}
      data={rows}
      style={styles.container}
      contentContainerStyle={styles.content}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) =>
        item.type === "entry" ? (
          <ChatListItem entry={item.entry} />
        ) : (
          <StreamingItem content={streamingContent} />
        )
      }
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      maintainVisibleContentPosition={{
        autoscrollToBottomThreshold: 0.2,
      }}
      onContentSizeChange={() => {
        requestAnimationFrame(() => {
          listRef.current?.scrollToEnd({ animated: true });
        });
      }}
      onLayout={() => {
        requestAnimationFrame(() => {
          listRef.current?.scrollToEnd({ animated: false });
        });
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 16,
    paddingHorizontal: 12,
    paddingBottom: 14,
  },
  separator: {
    height: 10,
  },
});
