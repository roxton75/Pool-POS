import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { StyleSheet } from "react-native";
import Reanimated, {
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";

import {
  borderRadius,
  darkColors,
  lightColors,
  shadows,
  spacing,
  useTheme,
} from "../../theme";

export type ThemedCardVariant = "default" | "secondary" | "outlined" | "success" | "error";

export type ThemedCardProps = Omit<ViewProps, "style"> & {
  variant?: ThemedCardVariant;
  padding?: keyof typeof spacing;
  radius?: keyof typeof borderRadius;
  shadow?: keyof typeof shadows.dark;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

export function ThemedCard({
  variant = "default",
  padding = "lg",
  radius = "xl",
  shadow = "none",
  style,
  children,
  ...props
}: ThemedCardProps) {
  const { mode, progress } = useTheme();

  const animatedCardStyle = useAnimatedStyle(() => {
    let darkBackground: string;
    let lightBackground: string;

    if (variant === "success") {
      darkBackground = darkColors.status.available;
      lightBackground = lightColors.status.available;
    } else if (variant === "error") {
      darkBackground = darkColors.status.error;
      lightBackground = lightColors.status.error;
    } else if (variant === "secondary") {
      darkBackground = darkColors.surfaceSecondary;
      lightBackground = lightColors.surfaceSecondary;
    } else {
      darkBackground = darkColors.surface;
      lightBackground = lightColors.surface;
    }

    return {
      backgroundColor:
        variant === "outlined"
          ? "transparent"
          : interpolateColor(
              progress.value,
              [0, 1],
              [darkBackground, lightBackground],
            ),
      borderColor: interpolateColor(
        progress.value,
        [0, 1],
        [darkColors.border, lightColors.border],
      ),
    };
  });

  return (
    <Reanimated.View
      {...props}
      style={[
        styles.card,
        {
          padding: spacing[padding],
          borderRadius: borderRadius[radius],
        },
        animatedCardStyle,
        shadows[mode][shadow],
        style,
      ]}
    >
      {children}
    </Reanimated.View>
  );
}

export default ThemedCard;

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    overflow: "hidden",
  },
});
