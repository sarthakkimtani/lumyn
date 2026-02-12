import { SymbolView } from "expo-symbols";
import { Pressable } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export const DeleteButton = ({ onPress }: { onPress?: () => void }) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <SymbolView size={12} weight="bold" name="minus" tintColor="#FFF" />
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    width: 22,
    height: 22,
    borderRadius: 22,
    backgroundColor: theme.colors.error,
    alignItems: "center",
    justifyContent: "center",
  },
}));
