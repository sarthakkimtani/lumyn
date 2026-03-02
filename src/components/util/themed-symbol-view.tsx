import { AppThemes } from "@/styles/unistyles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SFSymbol, SymbolView, SymbolWeight } from "expo-symbols";
import { Platform } from "react-native";
import { withUnistyles } from "react-native-unistyles";

export type ThemeColor = keyof AppThemes["light"]["colors"];
export type MaterialSymbol = keyof typeof MaterialIcons.glyphMap;

interface ThemedSymbolViewProps {
  icon: { ios: SFSymbol; android: MaterialSymbol };
  themeColor: ThemeColor;
  size?: number;
  weight?: SymbolWeight;
}

const IosSymbolView = withUnistyles(SymbolView, (theme) => ({
  tintColor: theme.colors.primary,
}));

const AndroidSymbolView = withUnistyles(MaterialIcons, (theme) => ({
  color: theme.colors.primary,
}));

export function ThemedSymbolView({ icon, themeColor, weight, ...props }: ThemedSymbolViewProps) {
  if (Platform.OS === "ios") {
    return (
      <IosSymbolView
        name={icon.ios}
        uniProps={(theme) => ({
          tintColor: theme.colors[themeColor],
        })}
        {...props}
        weight={weight}
      />
    );
  }

  return (
    <AndroidSymbolView
      name={icon.android}
      uniProps={(theme) => ({
        color: theme.colors[themeColor],
      })}
      {...props}
    />
  );
}
