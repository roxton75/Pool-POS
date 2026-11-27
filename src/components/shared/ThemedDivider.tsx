import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { StyleSheet } from "react-native";
import Reanimated, {
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";

import { darkColors, lightColors, useTheme } from "../../theme";

export interface ThemedDividerProps extends Omit<ViewProps, "style"> {
  style?: StyleProp<ViewStyle>;
  orientation?: "horizontal" | "vertical";
  thickness?: number;
  marginVertical?: number;
  marginHorizontal?: number;
}

export function ThemedDivider({
  style,
  orientation = "horizontal",
  thickness = 1,
  marginVertical = 0,
  marginHorizontal = 0,
  ...props
}: ThemedDividerProps) {
  const { progress } = useTheme();

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [darkColors.border, lightColors.border],
    ),
  }));

  return (
    <Reanimated.View
      {...props}
      style={[
        styles.divider,
        {
          width: orientation === "horizontal" ? "100%" : thickness,
          height: orientation === "vertical" ? "100%" : thickness,
          marginVertical,
          marginHorizontal,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  divider: { opacity: 0.65 },
});

export default ThemedDivider;
