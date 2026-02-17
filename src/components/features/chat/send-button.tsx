import { SymbolView } from "expo-symbols";
import { Pressable } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { ThemedGlassView } from "@/components/util/themed-glass-view";

export const SendButton = ({ loading, onPress }: { loading: boolean; onPress: () => void }) => {
  return (
    <ThemedGlassView themeColor="primary" isInteractive style={styles.sendButton}>
      <Pressable accessibilityRole="button" onPress={onPress}>
        <SymbolView
          name={loading ? "stop.fill" : "arrow.up"}
          size={22}
          weight="bold"
          tintColor="#FFF"
        />
      </Pressable>
    </ThemedGlassView>
  );
};

const styles = StyleSheet.create({
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
});
