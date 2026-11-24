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

export type ThemedCardVariant = "default" | "secondary" | "outlined";

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
    const darkBackground =
      variant === "secondary"
        ? darkColors.surfaceSecondary
        : darkColors.surface;

    const lightBackground =
      variant === "secondary"
        ? lightColors.surfaceSecondary
        : lightColors.surface;

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
