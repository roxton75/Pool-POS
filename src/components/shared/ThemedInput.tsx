import { useState } from "react";
import type { ReactNode } from "react";
import {
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import Reanimated, {
  createAnimatedComponent,
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
import { ThemedText } from "./ThemedText";

const AnimatedTextInput = createAnimatedComponent(TextInput);

export interface ThemedInputProps extends Omit<TextInputProps, "style"> {
  label?: string;
  error?: string;
  helperText?: string;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: TextInputProps["style"];
}

export function ThemedInput({
  label,
  error,
  helperText,
  leftElement,
  rightElement,
  containerStyle,
  inputStyle,
  onFocus,
  onBlur,
  ...props
}: ThemedInputProps) {
  const { progress } = useTheme();
  const [focused, setFocused] = useState(false);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [darkColors.surfaceSecondary, lightColors.surfaceSecondary],
    ),
    borderColor: error
      ? interpolateColor(
          progress.value,
          [0, 1],
          [darkColors.status.error, lightColors.status.error],
        )
      : interpolateColor(
          progress.value,
          [0, 1],
          [
            focused ? darkColors.accent : darkColors.border,
            focused ? lightColors.accent : lightColors.border,
          ],
        ),
  }));

  const animatedInputStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      [darkColors.text.primary, lightColors.text.primary],
    ),
  }));

  const animatedPlaceholderColor = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      [darkColors.text.muted, lightColors.text.muted],
    ),
  }));

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <ThemedText variant="label" color="secondary">
          {label}
        </ThemedText>
      ) : null}

      <Reanimated.View
        style={[
          styles.container,
          animatedContainerStyle,
          focused && styles.focused,
        ]}
      >
        {leftElement ? <View style={styles.element}>{leftElement}</View> : null}

        <View style={styles.inputWrapper}>
          <AnimatedTextInput
            {...props}
            onFocus={(event) => {
              setFocused(true);
              onFocus?.(event);
            }}
            onBlur={(event) => {
              setFocused(false);
              onBlur?.(event);
            }}
            placeholderTextColor={
              props.placeholderTextColor ?? darkColors.text.muted
            }
            style={[
              styles.input,
              typography.body,
              animatedInputStyle,
              inputStyle,
            ]}
          />

          {props.placeholder ? (
            <Reanimated.View
              pointerEvents="none"
              style={styles.placeholderOverlay}
            >
              <Reanimated.Text
                style={[typography.body, animatedPlaceholderColor]}
              >
                {""}
              </Reanimated.Text>
            </Reanimated.View>
          ) : null}
        </View>

        {rightElement ? (
          <View style={styles.element}>{rightElement}</View>
        ) : null}
      </Reanimated.View>

      {error ? (
        <ThemedText variant="caption" color="muted" style={styles.error}>
          {error}
        </ThemedText>
      ) : helperText ? (
        <ThemedText variant="caption" color="secondary">
          {helperText}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = {
  wrapper: {
    gap: spacing.xs,
  },
  container: {
    minHeight: 44,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  focused: {
    borderWidth: 1.5,
  },
  inputWrapper: {
    flex: 1,
  },
  input: {
    minHeight: 42,
    paddingVertical: spacing.sm,
    paddingHorizontal: 0,
    includeFontPadding: false,
  },
  placeholderOverlay: {
    display: "none" as const,
  },
  element: {
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  error: {
    marginTop: spacing.xxs,
  },
};
