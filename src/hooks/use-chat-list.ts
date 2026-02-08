import { FlashListRef } from "@shopify/flash-list";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NativeScrollEvent } from "react-native";

import { TranscriptEntry } from "@/modules/local-llm";

export type ChatRow =
  | { type: "entry"; id: string; entry: TranscriptEntry }
  | { type: "streaming"; id: string };

type UseChatListParams = {
  entries: TranscriptEntry[];
  loading: boolean;
};

export const useChatList = ({ entries, loading }: UseChatListParams) => {
  const [viewportHeight, setViewportHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const listRef = useRef<FlashListRef<ChatRow>>(null);

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

  const scrollToEnd = useCallback(() => {
    listRef.current?.scrollToEnd({ animated: true });
    setIsAtBottom(true);
  }, []);

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: NativeScrollEvent) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  const onScroll = (nativeEvent: NativeScrollEvent) => setIsAtBottom(isCloseToBottom(nativeEvent));
  const onContentSizeChange = (_: number, height: number) => setContentHeight(height);
  const onLayout = (height: number) => setViewportHeight(height);

  const lastEntry = entries[entries.length - 1];
  useEffect(() => {
    if (lastEntry?.role === "prompt") {
      scrollToEnd();
    }
  }, [lastEntry.id, lastEntry?.role, scrollToEnd]);

  return {
    listRef,
    rows,
    showScrollDownButton: contentHeight > viewportHeight && !isAtBottom,
    scrollToEnd,
    onLayout,
    onContentSizeChange,
    onScroll,
  };
};
