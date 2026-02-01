import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function Index() {
  return (
    <>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button icon={"bubble.left.and.text.bubble.right"} onPress={() => {}} />
        <Stack.Toolbar.Button icon="gear" onPress={() => {}} />
      </Stack.Toolbar>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button icon="shield" onPress={() => {}} />
      </Stack.Toolbar>

      <View style={styles.container}>
        <Text style={styles.text}>Edit src/app/index.tsx to edit this screen.</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
  },
  text: {
    color: theme.colors.text,
  },
}));
