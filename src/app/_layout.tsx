import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import * as SplashScreen from "expo-splash-screen";
import * as SQLite from "expo-sqlite";
import { SQLiteProvider } from "expo-sqlite";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { AppLayout } from "@/components/layouts/app-layout";
import migrations from "@/drizzle/migrations";
import { applyThemePreference, getThemeFromStorage } from "@/lib/theme";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  fade: true,
});

applyThemePreference(getThemeFromStorage());

const DB_NAME = "lumyn.db";
const expo = SQLite.openDatabaseSync(DB_NAME);
const db = drizzle(expo);

export default function RootLayout() {
  const { error } = useMigrations(db, migrations);
  if (error) console.warn("DB Error:", error.message);

  return (
    <SQLiteProvider databaseName={DB_NAME} options={{ enableChangeListener: true }}>
      <KeyboardProvider>
        <AppLayout />
      </KeyboardProvider>
    </SQLiteProvider>
  );
}
