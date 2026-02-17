import { FlashListRef } from "@shopify/flash-list";
import { useCallback, useEffect, useRef, useState } from "react";
import { NativeScrollEvent } from "react-native";

import { AgentMessage } from "@/lib/agent";

export const useChatList = ({ messages }: { messages: AgentMessage[] }) => {
  const [viewportHeight, setViewportHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const listRef = useRef<FlashListRef<AgentMessage>>(null);

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

  const lastEntry = messages[messages.length - 1];
  useEffect(() => {
    if (lastEntry?.role === "assistant") {
      scrollToEnd();
    }
  }, [lastEntry?.id, lastEntry?.role, scrollToEnd]);

  return {
    listRef,
    showScrollDownButton: contentHeight > viewportHeight && !isAtBottom,
    scrollToEnd,
    onLayout,
    onContentSizeChange,
    onScroll,
  };
};
