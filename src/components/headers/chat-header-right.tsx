import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export const ChatHeaderRight = ({
  chatStarted,
  temporary,
  onPress,
}: {
  chatStarted: boolean;
  temporary: boolean;
  onPress: () => void;
}) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={onPress}>
        <MaterialIcons
          style={styles.icon}
          name={chatStarted ? "create" : temporary ? "lock" : "lock-open"}
          size={24}
          backgroundColor="transparent"
          underlayColor="transparent"
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
