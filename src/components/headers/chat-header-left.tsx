import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export const ChatHeaderLeft = () => {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.push("/conversations")}>
        <MaterialIcons
          style={styles.icon}
          backgroundColor="transparent"
          underlayColor="transparent"
          name="chat"
          size={24}
        />
      </Pressable>
      <Pressable onPress={() => router.push("/settings")}>
        <MaterialIcons
          style={styles.icon}
          backgroundColor="transparent"
          underlayColor="transparent"
          name="settings"
          size={24}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 25,
    borderRadius: 40,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderColor: theme.colors.cardBorder,
  },
  icon: {
    color: theme.colors.textSecondary,
  },
}));
