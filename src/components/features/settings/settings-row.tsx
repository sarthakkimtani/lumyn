import { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

type SettingsRowProps = {
  label: string;
  icon?: ReactNode;
  trailing?: ReactNode;
  isFirst?: boolean;
  isLast?: boolean;
  onPress?: () => void;
};

export const SettingsRow = ({
  label,
  icon,
  trailing,
  isFirst = false,
  isLast = false,
  onPress,
}: SettingsRowProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        isFirst && styles.rowFirst,
        isLast && styles.rowLast,
        pressed && styles.rowPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.leading}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={[styles.trailing, !isLast && styles.separator]}>{trailing}</View>
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    minHeight: 52,
    backgroundColor: theme.colors.card,
  },
  rowFirst: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  rowLast: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  rowPressed: {
    backgroundColor: theme.colors.cardPressed,
  },
  leading: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 20,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  label: {
    color: theme.colors.text,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  trailing: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: 16,
    paddingVertical: 14,
  },
  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.separator,
  },
}));
