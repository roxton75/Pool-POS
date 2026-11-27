import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Reanimated, {
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";

import { darkColors, lightColors, useTheme } from "../../theme";

export interface ThemedSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  style?: object;
  accessibilityLabel?: string;
}

export function ThemedSwitch({
  value,
  onValueChange,
  disabled = false,
  style,
  accessibilityLabel,
}: ThemedSwitchProps) {
  const { progress } = useTheme();

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      value
        ? [darkColors.accent, lightColors.accent]
        : [darkColors.surfaceSecondary, lightColors.surfaceSecondary],
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [darkColors.border, lightColors.border],
    ),
  }));

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      hitSlop={8}
      style={[styles.pressable, style, { opacity: disabled ? 0.5 : 1 }]}
    >
      <Reanimated.View style={[styles.track, trackStyle]}>
        <View style={[styles.thumb, value && styles.thumbOn]} />
      </Reanimated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: { width: 52, height: 32, justifyContent: "center" },
  track: {
    width: 52,
    height: 30,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    elevation: 2,
  },
  thumbOn: { alignSelf: "flex-end" },
});
