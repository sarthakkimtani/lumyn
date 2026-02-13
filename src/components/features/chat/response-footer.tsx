import * as Clipboard from "expo-clipboard";
import { GlassView } from "expo-glass-effect";
import { SFSymbol } from "expo-symbols";
import { Pressable, Share } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { ThemedSymbolView } from "@/components/util/themed-symbol-view";
import { TranscriptEntry } from "@/modules/local-llm";
import { useEffect, useState } from "react";

const IconButton = ({ name, onPress }: { name: SFSymbol; onPress: () => void }) => {
  return (
    <Pressable onPress={onPress}>
      <ThemedSymbolView size={21} weight="medium" name={name} themeColor="textSecondary" />
    </Pressable>
  );
};

export const ResponseFooter = ({ entry }: { entry: TranscriptEntry }) => {
  const [copied, setCopied] = useState(false);

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
    Clipboard.setStringAsync(entry.text);
  };

  return (
    <GlassView style={styles.container}>
      <IconButton
        name={copied ? "checkmark" : "document.on.document"}
        onPress={handleClipboardCopy}
      />
      <IconButton name="square.and.arrow.up" onPress={() => Share.share({ message: entry.text })} />
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
});
