import * as Clipboard from "expo-clipboard";
import { GlassView } from "expo-glass-effect";
import { SFSymbol } from "expo-symbols";
import { useEffect, useState } from "react";
import { Pressable, Share } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { ThemedSymbolView } from "@/components/util/themed-symbol-view";

import { AgentMessage } from "@/lib/agent";
import { extractTextFromMessage } from "@/utils/chat";
import { useChatContext } from "@/contexts/chat-context";

const IconButton = ({ name, onPress }: { name: SFSymbol; onPress: () => void }) => {
  return (
    <Pressable style={({ pressed }) => [pressed && styles.buttonPressed]} onPress={onPress}>
      <ThemedSymbolView size={21} weight="medium" name={name} themeColor="textSecondary" />
    </Pressable>
  );
};

export const AssistantFooter = ({ message }: { message: AgentMessage }) => {
  const {regenerate} = useChatContext();
  const [copied, setCopied] = useState(false);
  const text = extractTextFromMessage(message)

  useEffect(() => {
    if (copied) {
      const timerId = setTimeout(() => {
        setCopied(false);
      }, 2000);

      return () => clearTimeout(timerId);
    }
  }, [copied]);

  const handleClipboardCopy = () => {
    if (copied) return;
    setCopied(true);
    Clipboard.setStringAsync(text);
  };

  return (
    <GlassView style={styles.container}>
      <IconButton
        name={copied ? "checkmark" : "document.on.document"}
        onPress={handleClipboardCopy}
      />
      <IconButton name="square.and.arrow.up" onPress={() => Share.share({ message: text })} />
      <IconButton name="arrow.counterclockwise" onPress={regenerate} />
    </GlassView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    borderRadius: 20,
    padding: 10,
  },
  buttonPressed: {
    opacity: 0.4,
  },
});
