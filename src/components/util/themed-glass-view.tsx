import { GlassView } from "expo-glass-effect";
import { StyleProp, ViewStyle } from "react-native";
import { withUnistyles } from "react-native-unistyles";

import { AppThemes } from "@/styles/unistyles";

type ThemeColor = keyof AppThemes["light"]["colors"];

export const ThemedGlassView = ({
  style,
  color,
  isInteractive,
  children,
}: {
  style: StyleProp<ViewStyle>;
  color: ThemeColor;
  isInteractive?: boolean | undefined;
  children: React.ReactNode;
}) => {
  const UnistylesGlassView = withUnistyles(GlassView, (theme) => ({
    tintColor: theme.colors[color],
  }));

  return (
    <UnistylesGlassView style={style} isInteractive={isInteractive}>
      {children}
    </UnistylesGlassView>
  );
};
