import { GlassView, GlassViewProps } from "expo-glass-effect";
import { withUnistyles } from "react-native-unistyles";

import { AppThemes } from "@/styles/unistyles";

type ThemeColor = keyof AppThemes["light"]["colors"];

interface ThemedGlassViewProps extends Omit<GlassViewProps, "tintColor"> {
  themeColor: ThemeColor;
}

export const ThemedGlassView = ({ themeColor, children, ...props }: ThemedGlassViewProps) => {
  const UnistylesGlassView = withUnistyles(GlassView, (theme) => ({
    tintColor: theme.colors[themeColor],
  }));

  return <UnistylesGlassView {...props}>{children}</UnistylesGlassView>;
};
