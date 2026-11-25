import { cloneElement, isValidElement } from "react";
import type { ReactNode, ReactElement } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Reanimated, {
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";

import {
  borderRadius,
  darkColors,
  lightColors,
  sizes,
  spacing,
  typography,
  useTheme,
} from "../../theme";

export type ThemedButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";

export type ThemedButtonSize = "sm" | "md" | "lg";

export interface ThemedButtonProps extends Omit<
  PressableProps,
  "style" | "children"
> {
  title: string;
  variant?: ThemedButtonVariant;
  size?: ThemedButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function ThemedButton({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
  ...props
}: ThemedButtonProps) {
  const { progress, mode } = useTheme();
  const isDisabled = disabled || loading;

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    const transparent = "rgba(0,0,0,0)";

    const backgrounds = {
      primary: [darkColors.button.primary, lightColors.button.primary],
      secondary: [darkColors.button.secondary, lightColors.button.secondary],
      outline: [transparent, transparent],
      ghost: [transparent, transparent],
      danger: [darkColors.status.error, lightColors.status.error],
    } as const;

    const borders = {
      primary: [transparent, transparent],
      secondary: [transparent, transparent],
      outline: [darkColors.border, lightColors.border],
      ghost: [darkColors.text.secondary, lightColors.text.secondary],
      danger: [transparent, transparent],
    } as const;

    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        backgrounds[variant],
      ),
      borderColor: interpolateColor(progress.value, [0, 1], borders[variant]),
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    let darkText = darkColors.text.primary;
    let lightText = lightColors.text.primary;

    if (variant === "primary") {
      darkText = darkColors.text.black;
      lightText = lightColors.text.white;
    } else if (variant === "secondary") {
      darkText = darkColors.text.primary;
      lightText = darkColors.text.white;
    } else if (variant === "danger") {
      darkText = lightColors.background;
      lightText = lightColors.background;
    } else if (variant === "outline" || variant === "ghost") {
      darkText = darkColors.text.secondary;
      lightText = lightColors.text.secondary;
    }

    return {
      color: interpolateColor(progress.value, [0, 1], [darkText, lightText]),
    };
  });

  // Keep icon color identical to the button text color.
  const iconColor =
    variant === "primary"
      ? mode === "dark"
        ? darkColors.text.black
        : lightColors.text.white
      : variant === "secondary"
        ? mode === "dark"
          ? darkColors.text.white
          : lightColors.text.white
        : variant === "danger"
          ? lightColors.text.white
          : mode === "dark"
            ? darkColors.text.secondary
            : lightColors.text.secondary;

  const renderIcon = (icon: ReactNode) => {
    if (!isValidElement(icon)) return icon;

    return cloneElement(icon as ReactElement<{ color?: string }>, {
      color: iconColor,
    });
  };

  const buttonHeight = sizes.control[size];

  return (
    <Pressable
      {...props}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
      style={({ pressed }) => [
        styles.button,
        {
          height: buttonHeight,
          paddingHorizontal: size === "sm" ? spacing.md : spacing.lg,
          borderRadius: borderRadius.lg,
          borderColor: darkColors.text.secondary,
          borderWidth: variant === "outline" || variant === "ghost" ? 1 : 0,
          opacity: isDisabled ? 0.5 : pressed ? 0.8 : 1,
          transform: [{ scale: pressed && !isDisabled ? 0.98 : 1 }],
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      <Reanimated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          styles.background,
          buttonAnimatedStyle,
        ]}
      />

      {loading ? (
        <ActivityIndicator color={iconColor} size="small" />
      ) : (
        <>
          {leftIcon ? (
            <Reanimated.View style={styles.icon}>
              {renderIcon(leftIcon)}
            </Reanimated.View>
          ) : null}

          <Reanimated.Text
            numberOfLines={1}
            style={[typography.button, textAnimatedStyle]}
          >
            {title}
          </Reanimated.Text>

          {rightIcon ? (
            <Reanimated.View style={styles.icon}>
              {renderIcon(rightIcon)}
            </Reanimated.View>
          ) : null}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderWidth: 1,
    overflow: "hidden",
  },
  background: {
    borderRadius: borderRadius.lg,
  },
  fullWidth: {
    width: "100%",
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ThemedButton;
