import { SymbolView, SymbolViewProps } from "expo-symbols";
import { withUnistyles } from "react-native-unistyles";

import { AppThemes } from "@/styles/unistyles";

type ThemeColor = keyof AppThemes["light"]["colors"];

interface ThemedSymbolViewProps extends Omit<SymbolViewProps, "tintColor"> {
  themeColor: ThemeColor;
}

export const ThemedSymbolView = ({ themeColor, ...props }: ThemedSymbolViewProps) => {
  const UnistylesSymbolView = withUnistyles(SymbolView, (theme) => ({
    tintColor: theme.colors[themeColor],
  }));

  return <UnistylesSymbolView {...props} />;
};
