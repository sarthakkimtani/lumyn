import { useMemo } from "react";
import { SectionList, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { ConversationTile } from "@/components/features/conversations/conversation-tile";
import { conversations } from "@/db/schema";
import { type DateSection, getDateSection } from "@/utils/date";

type ConversationRow = typeof conversations.$inferSelect;

type ConversationSection = {
  title: DateSection;
  data: ConversationRow[];
};

const SECTION_ORDER: DateSection[] = ["Today", "Yesterday", "This Week", "Earlier"];

const buildSections = (rows: ConversationRow[]): ConversationSection[] => {
  const grouped = new Map<DateSection, ConversationRow[]>();

  for (const row of rows) {
    const section = getDateSection(row.createdAt);
    const existing = grouped.get(section);
    if (existing) {
      existing.push(row);
    } else {
      grouped.set(section, [row]);
    }
  }

  return SECTION_ORDER.filter((key) => grouped.has(key)).map((key) => ({
    title: key,
    data: grouped.get(key)!,
  }));
};

export const ConversationsList = ({ data }: { data: ConversationRow[] }) => {
  const sections = useMemo(() => buildSections(data), [data]);

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      stickySectionHeadersEnabled={false}
      renderSectionHeader={({ section }) => (
        <Text style={styles.sectionHeader}>{section.title.toUpperCase()}</Text>
      )}
      renderItem={({ item, index, section }) => {
        const isFirst = index === 0;
        const isLast = index === section.data.length - 1;
        return <ConversationTile conversation={item} isFirst={isFirst} isLast={isLast} />;
      }}
      renderSectionFooter={() => <View style={styles.sectionFooter} />}
    />
  );
};

const styles = StyleSheet.create((theme) => ({
  contentContainer: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  sectionHeader: {
    color: theme.colors.sectionHeader,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 6,
  },
  sectionFooter: {
    height: 8,
  },
}));
