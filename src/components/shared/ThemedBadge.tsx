
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Circle,
  //Clock,
  PauseCircle,
  XCircle,
} from "lucide-react-native";
import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import Reanimated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
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
  | "accent"
  | "active";

export type ThemedBadgeSize = "sm" | "md";

export interface ThemedBadgeProps {
  label: string;
  variant?: ThemedBadgeVariant;
  size?: ThemedBadgeSize;
  dot?: boolean;
  showIcon?: boolean;
  style?: StyleProp<ViewStyle>;
}

const badgeIcons = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  info: PauseCircle,
  neutral: Circle,
  accent: Activity,
  active: Activity,
};

export function ThemedBadge({
  label,
  variant = "neutral",
  size = "md",
  dot = false,
  showIcon = true,
  style,
}: ThemedBadgeProps) {
  const { progress, mode } = useTheme();

  const pulse = useSharedValue(0);

  const isActive = variant === "active";
  const Icon = badgeIcons[variant];

  // Subtle continuous glow for active badges.
  if (isActive && pulse.value === 0) {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: 1100,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0, {
          duration: 1100,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
      false,
    );
  }

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const palettes = {
      success: [darkColors.status.available, lightColors.status.available],
      warning: [darkColors.status.occupied, lightColors.status.occupied],
      error: [darkColors.status.error, lightColors.status.error],
      info: [darkColors.status.paused, lightColors.status.paused],
      neutral: [darkColors.surfaceSecondary, lightColors.surfaceSecondary],
      accent: [darkColors.accent, lightColors.accent],
      active: ["#173B2D", "#E1F7EA"],
    } as const;

    const background = palettes[variant];

    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        variant === "active"
          ? background
          : [
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
        variant === "active"
          ? ["#42C98A", "#279B75"]
          : [background[0], background[1]],
      ),
      shadowColor: isActive ? "#42C98A" : "transparent",
      shadowOpacity: isActive ? 0.35 + pulse.value * 0.4 : 0,
      shadowRadius: isActive ? 6 + pulse.value * 8 : 0,
      elevation: isActive ? 5 + pulse.value * 4 : 0,
    };
  });

  const foregroundAnimatedStyle = useAnimatedStyle(() => {
    // const foregrounds = {
    //   success: [darkColors.status.available, lightColors.status.available],
    //   warning: [darkColors.status.occupied, lightColors.status.occupied],
    //   error: [darkColors.status.error, lightColors.status.error],
    //   info: [darkColors.status.paused, lightColors.status.paused],
    //   neutral: [darkColors.text.secondary, lightColors.text.secondary],
    //   accent: ["#111315", "#111315"],
    //   active: mode === "dark" ? "#71DAC3" : "#187A4A",
    // } as const;
    const foregrounds: Record<ThemedBadgeVariant, readonly [string, string]> = {
      success: [darkColors.status.available, lightColors.status.available],
      warning: [darkColors.status.occupied, lightColors.status.occupied],
      error: [darkColors.status.error, lightColors.status.error],
      info: [darkColors.status.paused, lightColors.status.paused],
      neutral: [darkColors.text.secondary, lightColors.text.secondary],
      accent: ["#111315", "#111315"],
      active: ["#71DAC3", "#187A4A"],
    };

    return {
      color: interpolateColor(progress.value, [0, 1], foregrounds[variant]),
    };
  });

  const activeDotStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["#42C98A", "#279B75"],
    ),
    opacity: isActive ? 0.65 + pulse.value * 0.35 : 1,
  }));

  // const iconColor =
  //   variant === "active"
  //     ? mode === "dark"
  //       ? "#42C98A"
  //       : "#279B75"
  //     : variant === "accent"
  //       ? "#111315"
  //       : mode === "dark"
  //         ? (
  //             {
  //               success: darkColors.status.available,
  //               warning: darkColors.status.occupied,
  //               error: darkColors.status.error,
  //               info: darkColors.status.paused,
  //               neutral: darkColors.text.secondary,
  //             } as const
  //           )[variant]
  //         : (
  //             {
  //               success: lightColors.status.available,
  //               warning: lightColors.status.occupied,
  //               error: lightColors.status.error,
  //               info: lightColors.status.paused,
  //               neutral: lightColors.text.secondary,
  //             } as const
  //           )[variant];
  const iconColor =
    variant === "active"
      ? mode === "dark"
        ? "#79F0B3"
        : "#187A4A"
      : variant === "accent"
        ? "#111315"
        : mode === "dark"
          ? (
              {
                success: darkColors.status.available,
                warning: darkColors.status.occupied,
                error: darkColors.status.error,
                info: darkColors.status.paused,
                neutral: darkColors.text.secondary,
              } as const
            )[variant]
          : (
              {
                success: lightColors.status.available,
                warning: lightColors.status.occupied,
                error: lightColors.status.error,
                info: lightColors.status.paused,
                neutral: lightColors.text.secondary,
              } as const
            )[variant];

  return (
    <Reanimated.View
      style={[
        styles.badge,
        size === "sm" ? styles.small : styles.medium,
        { borderRadius: borderRadius.full },
        containerAnimatedStyle,
        style,
      ]}
    >
      {dot && (
        <Reanimated.View
          style={[
            styles.dot,
            isActive ? activeDotStyle : { backgroundColor: iconColor },
          ]}
        />
      )}

      {showIcon && (
        <Icon
          size={size === "sm" ? 11 : 13}
          strokeWidth={2.2}
          color={iconColor}
        />
      )}

      <Reanimated.Text
        style={[typography.caption, styles.label, foregroundAnimatedStyle]}
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
