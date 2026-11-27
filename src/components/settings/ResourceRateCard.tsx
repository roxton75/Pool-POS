import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedButton, ThemedCard, ThemedInput, ThemedText } from "../shared";
import { spacing } from "../../theme";

type Props = {
  name: string;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
  onSave: () => void;
};

export default function ResourceRateCard({ name, value, disabled, onChange, onSave }: Props) {
  return (
    <ThemedCard padding="md" style={styles.card}>
      <ThemedText variant="subtitle">{name}</ThemedText>
      <View style={styles.row}>
        <View style={styles.input}>
          <ThemedInput
            label="Hourly Rate (₹)"
            value={value}
            keyboardType="number-pad"
            editable={!disabled}
            onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ""))}
          />
        </View>
        <ThemedButton title="Update" size="sm" onPress={onSave} disabled={disabled} />
      </View>
    </ThemedCard>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm },
  row: { flexDirection: "row", alignItems: "flex-end", gap: spacing.md },
  input: { flex: 1 },
});
