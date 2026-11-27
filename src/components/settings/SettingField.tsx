import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedCard, ThemedInput, ThemedSelect, ThemedSwitch, ThemedText } from "../shared";
import { spacing } from "../../theme";
import type { SettingDefinition, SettingValue } from "./types";

type Props = {
  definition: SettingDefinition;
  value: SettingValue;
  onChange: (value: SettingValue) => void;
  disabled: boolean;
};

export default function SettingField({ definition, value, onChange, disabled }: Props) {
  const stringValue = String(value ?? "");
  return (
    <ThemedCard padding="md" style={styles.card}>
      {definition.type === "switch" ? (
        <View style={styles.switchRow}>
          <View style={styles.flex}>
            <ThemedText variant="subtitle">{definition.label}</ThemedText>
            {!!definition.help && <ThemedText color="secondary" variant="caption">{definition.help}</ThemedText>}
          </View>
          <ThemedSwitch value={Boolean(value)} onValueChange={onChange} disabled={disabled} />
        </View>
      ) : definition.type === "select" ? (
        <ThemedSelect
          label={definition.label}
          value={stringValue}
          options={definition.options ?? []}
          onChange={onChange}
          disabled={disabled}
        />
      ) : (
        <ThemedInput
          label={definition.label}
          value={stringValue}
          placeholder={definition.placeholder}
          helperText={definition.help}
          editable={!disabled}
          keyboardType={definition.type === "number" ? "numeric" : "default"}
          multiline={definition.type === "textarea"}
          numberOfLines={definition.type === "textarea" ? 3 : 1}
          onChangeText={(text) => {
            if (definition.type === "number") {
              const clean = text.replace(/[^0-9]/g, "");
              if (!clean && definition.min !== 0) return;
              const number = clean ? Number(clean) : 0;
              if (definition.max !== undefined && number > definition.max) return;
              onChange(number);
            } else {
              onChange(text);
            }
          }}
          rightElement={definition.suffix ? (
            <ThemedText color="secondary" variant="caption">{definition.suffix}</ThemedText>
          ) : undefined}
        />
      )}
    </ThemedCard>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm },
  switchRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  flex: { flex: 1, gap: spacing.xs },
});
