import { Linking } from "react-native";
import { EnrichedMarkdownText } from "react-native-enriched-markdown";
import { withUnistyles } from "react-native-unistyles";

const ThemedEnrichedMarkdownText = withUnistyles(EnrichedMarkdownText, (theme, rt) => ({
  markdownStyle: {
    paragraph: {
      fontSize: 16,
      color: theme.colors.text,
      lineHeight: 25,
      marginBottom: 12,
    },
    h1: {
      fontSize: 30,
      fontWeight: "700",
      color: theme.colors.text,
      lineHeight: 36,
      marginBottom: 14,
    },
    h2: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.colors.text,
      lineHeight: 30,
      marginBottom: 12,
    },
    h3: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.colors.text,
      lineHeight: 26,
      marginBottom: 10,
    },
    h4: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text,
      marginBottom: 10,
    },
    h5: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text,
      marginBottom: 8,
    },
    h6: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    strong: {
      color: theme.colors.text,
    },
    em: {
      color: theme.colors.textSecondary,
    },
    link: {
      color: theme.colors.primary,
      underline: true,
    },
    code: {
      color: rt.colorScheme === "dark" ? "#6FC2FF" : "#0A5FA5",
      backgroundColor: rt.colorScheme === "dark" ? "#1B1B1B" : "#F2F4F7",
      borderColor: rt.colorScheme === "dark" ? "#2C2C2C" : "#E4E6EA",
    },
    codeBlock: {
      fontSize: 14,
      fontFamily: "Menlo",
      color: rt.colorScheme === "dark" ? "#F3F4F6" : "#101828",
      backgroundColor: rt.colorScheme === "dark" ? "#13161A" : "#F8FAFC",
      borderColor: rt.colorScheme === "dark" ? "#23272F" : "#E4E7EC",
      borderWidth: 1,
      borderRadius: 12,
      padding: 14,
      marginBottom: 14,
      lineHeight: 20,
    },
    blockquote: {
      borderColor: theme.colors.primary,
      borderWidth: 3,
      gapWidth: 10,
      backgroundColor: rt.colorScheme === "dark" ? "#0C1924" : "#EAF5FE",
      marginBottom: 12,
      color: theme.colors.text,
      lineHeight: 24,
    },
    list: {
      fontSize: 16,
      color: theme.colors.text,
      lineHeight: 24,
      bulletColor: theme.colors.primary,
      markerColor: theme.colors.primary,
      markerFontWeight: "700",
      bulletSize: 6,
      gapWidth: 8,
      marginLeft: 16,
      marginBottom: 10,
    },
    image: {
      borderRadius: 10,
      marginBottom: 12,
      height: 220,
    },
    inlineImage: {
      size: 18,
    },
    thematicBreak: {
      color: rt.colorScheme === "dark" ? "#2A2A2A" : "#E6E6E6",
      height: 1,
      marginTop: 8,
      marginBottom: 12,
    },
  },
}));

export const MarkdownRenderer = ({ markdown }: { markdown: string }) => {
  return (
    <ThemedEnrichedMarkdownText
      markdown={markdown}
      selectable
      onLinkPress={(event) => Linking.openURL(event.url)}
    />
  );
};
