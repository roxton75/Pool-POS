import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ThemedButton, ThemedCard, ThemedDivider, ThemedText } from "../shared";
import { spacing } from "../../theme";
import type { CategoryId, SettingsCategory } from "./types";

type Props = {
  categories: SettingsCategory[];
  selectedId: CategoryId;
  onSelect: (id: CategoryId) => void;
};

export default function SettingsSidebar({
  categories,
  selectedId,
  onSelect,
}: Props) {
  return (
    <ThemedCard padding="none" style={styles.sidebar}>
      <View style={styles.header}>
        <ThemedText variant="subtitle">Categories</ThemedText>
        <ThemedText color="secondary" variant="caption">
          {categories.length} sections
        </ThemedText>
      </View>
      <ThemedDivider style={{ marginBottom: 4 }} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {categories.map((item) => (
          <ThemedButton
            key={item.id}
            title={item.label}
            variant={item.id === selectedId ? "secondary" : "ghost"}
            size="md"
            leftIcon={item.icon}
            onPress={() => onSelect(item.id)}
            style={styles.categoryButton}
          />
        ))}
      </ScrollView>
    </ThemedCard>
  );
}

const styles = StyleSheet.create({
  sidebar: { width: 200, flexShrink: 0 },
  header: { padding: spacing.md, gap: spacing.xxs },
  categoryButton: {
    // width: 150,
    marginHorizontal: spacing.sm,
    marginVertical: 2,

    justifyContent: "flex-start",
  },
});
