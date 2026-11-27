import React, { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Check, ChevronDown, X } from "lucide-react-native";

import {
  borderRadius,
  darkColors,
  lightColors,
  spacing,
  useTheme,
} from "../../theme";
import { ThemedText } from "./ThemedText";

export interface ThemedSelectOption {
  value: string;
  label: string;
}

export interface ThemedSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: ThemedSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  helperText?: string;
}

export function ThemedSelect({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  disabled = false,
  label,
  helperText,
}: ThemedSelectProps) {
  const { mode } = useTheme();
  const [visible, setVisible] = useState(false);
  const palette = mode === "dark" ? darkColors : lightColors;
  const selected = options.find((option) => option.value === value);

  return (
    <View style={styles.container}>
      {!!label && <ThemedText variant="label">{label}</ThemedText>}
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: visible }}
        disabled={disabled}
        onPress={() => setVisible(true)}
        style={[
          styles.trigger,
          {
            backgroundColor: palette.surface,
            borderColor: palette.border,
            opacity: disabled ? 0.55 : 1,
          },
        ]}
      >
        <ThemedText color={selected ? "primary" : "muted"}>
          {selected?.label ?? placeholder}
        </ThemedText>
        <ChevronDown size={18} color={palette.text.secondary} />
      </Pressable>
      {!!helperText && (
        <ThemedText color="secondary" variant="caption">
          {helperText}
        </ThemedText>
      )}

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
          <Pressable
            onPress={(event) => event.stopPropagation()}
            style={[
              styles.sheet,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}
          >
            <View style={styles.sheetHeader}>
              <ThemedText variant="subtitle">
                {label ?? "Select an option"}
              </ThemedText>
              <Pressable
                accessibilityRole="button"
                onPress={() => setVisible(false)}
                hitSlop={10}
              >
                <X size={20} color={palette.text.primary} />
              </Pressable>
            </View>
            <ScrollView>
              {options.map((option) => {
                const active = option.value === value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      onChange(option.value);
                      setVisible(false);
                    }}
                    style={[
                      styles.option,
                      active && { backgroundColor: palette.surfaceSecondary },
                    ]}
                  >
                    <ThemedText>{option.label}</ThemedText>
                    {active && <Check size={18} color={palette.accent} />}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xs },
  trigger: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.48)",
    justifyContent: "center",
    padding: spacing.xl,
  },
  sheet: {
    maxHeight: "70%",
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: spacing.md,
  },
  option: {
    minHeight: 48,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
