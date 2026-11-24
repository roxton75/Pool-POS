import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import Reanimated, {
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";

import {
  borderRadius,
  darkColors,
  lightColors,
  spacing,
  typography,
  useTheme,
} from "../../theme";

export type ThemedBadgeVariant =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral"
  | "accent";

export type ThemedBadgeSize = "sm" | "md";

export interface ThemedBadgeProps {
  label: string;
  variant?: ThemedBadgeVariant;
  size?: ThemedBadgeSize;
  dot?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function ThemedBadge({
  label,
  variant = "neutral",
  size = "md",
  dot = false,
  style,
}: ThemedBadgeProps) {
  const { progress } = useTheme();

  const animatedStyle = useAnimatedStyle(() => {
    const palettes = {
      success: [darkColors.status.available, lightColors.status.available],
      warning: [darkColors.status.occupied, lightColors.status.occupied],
      error: [darkColors.status.error, lightColors.status.error],
      info: [darkColors.status.paused, lightColors.status.paused],
      neutral: [darkColors.surfaceSecondary, lightColors.surfaceSecondary],
      accent: [darkColors.accent, lightColors.accent],
    } as const;

    const foregrounds = {
      success: [darkColors.status.available, lightColors.status.available],
      warning: [darkColors.status.occupied, lightColors.status.occupied],
      error: [darkColors.status.error, lightColors.status.error],
      info: [darkColors.status.paused, lightColors.status.paused],
      neutral: [darkColors.text.secondary, lightColors.text.secondary],
      accent: [darkColors.background, lightColors.background],
    } as const;

    const background = palettes[variant];
    const foreground = foregrounds[variant];

    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [
          variant === "neutral"
            ? darkColors.surfaceSecondary
            : `${background[0]}22`,
          variant === "neutral"
            ? lightColors.surfaceSecondary
            : `${background[1]}22`,
        ],
      ),
      borderColor: interpolateColor(
        progress.value,
        [0, 1],
        [background[0], background[1]],
      ),
      color: interpolateColor(
        progress.value,
        [0, 1],
        [foreground[0], foreground[1]],
      ),
    };
  });

  const dotStyle = useAnimatedStyle(() => {
    const dotColors = {
      success: [darkColors.status.available, lightColors.status.available],
      warning: [darkColors.status.occupied, lightColors.status.occupied],
      error: [darkColors.status.error, lightColors.status.error],
      info: [darkColors.status.paused, lightColors.status.paused],
      neutral: [darkColors.text.secondary, lightColors.text.secondary],
      accent: [darkColors.background, lightColors.background],
    } as const;

    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        dotColors[variant],
      ),
    };
  });

  return (
    <Reanimated.View
      style={[
        styles.badge,
        size === "sm" ? styles.small : styles.medium,
        {
          borderRadius: borderRadius.full,
        },
        animatedStyle,
        style,
      ]}
    >
      {dot ? <Reanimated.View style={[styles.dot, dotStyle]} /> : null}

      <Reanimated.Text
        style={[typography.caption, styles.label, animatedStyle]}
        numberOfLines={1}
      >
        {label}
      </Reanimated.Text>
    </Reanimated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    borderWidth: 1,
  },
  small: {
    minHeight: 22,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  medium: {
    minHeight: 26,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: borderRadius.full,
  },
  label: {
    fontSize: 11,
    lineHeight: 14,
  },
});

export default ThemedBadge;
