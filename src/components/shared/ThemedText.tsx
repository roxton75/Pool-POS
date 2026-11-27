import type { TextProps, TextStyle, StyleProp } from "react-native";
import Reanimated, {
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";

import { darkColors, lightColors, typography, useTheme } from "../../theme";

export type ThemeTextColor =
  | "primary"
  | "secondary"
  | "muted"
  | "accent"
  | "accentSecondary"
  | "sage"
  | "success"
  | "error";

export interface ThemedTextProps extends Omit<TextProps, "style"> {
  variant?: keyof typeof typography;
  color?: ThemeTextColor;
  style?: StyleProp<TextStyle>;
}

export function ThemedText({
  variant = "body",
  color = "primary",
  style,
  children,
  ...props
}: ThemedTextProps) {
  const { progress } = useTheme();

  const animatedColor = useAnimatedStyle(() => {
    let darkColor: string;
    let lightColor: string;

    switch (color) {
      case "primary":
      case "secondary":
      case "muted":
        darkColor = darkColors.text[color];
        lightColor = lightColors.text[color];
        break;

      case "accent":
        darkColor = darkColors.accent;
        lightColor = lightColors.accent;
        break;

      case "accentSecondary":
        darkColor = darkColors.accentSecondary;
        lightColor = lightColors.accentSecondary;
        break;

      case "sage":
        darkColor = darkColors.sage;
        lightColor = lightColors.sage;
        break;

      case "success":
        darkColor = darkColors.status.available;
        lightColor = lightColors.status.available;
        break;

      case "error":
        darkColor = darkColors.status.error;
        lightColor = lightColors.status.error;
        break;
    }

    return {
      color: interpolateColor(progress.value, [0, 1], [darkColor, lightColor]),
    };
  });

  return (
    <Reanimated.Text
      {...props}
      style={[typography[variant], animatedColor, style]}
    >
      {children}
    </Reanimated.Text>
  );
}

export default ThemedText;
