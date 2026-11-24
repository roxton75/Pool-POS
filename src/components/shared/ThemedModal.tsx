import type { ReactNode } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Reanimated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";

import {
  borderRadius,
  darkColors,
  lightColors,
  shadows,
  spacing,
  transitions,
  useTheme,
} from "../../theme";
import { ThemedText } from "./ThemedText";

export interface ThemedModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  dismissOnBackdrop?: boolean;
  showCloseButton?: boolean;
  width?: ViewStyle["width"];
  contentStyle?: StyleProp<ViewStyle>;
}

export function ThemedModal({
  visible,
  onClose,
  title,
  description,
  children,
  footer,
  dismissOnBackdrop = true,
  showCloseButton = true,
  width = "90%",
  contentStyle,
}: ThemedModalProps) {
  const { mode, progress } = useTheme();
  const animation = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    animation.value = withTiming(visible ? 1 : 0, transitions.modal);
  }, [visible, animation]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: animation.value,
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["rgba(0,0,0,0.68)", "rgba(17,19,21,0.38)"],
    ),
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: animation.value,
    transform: [
      {
        translateY: interpolate(animation.value, [0, 1], [16, 0]),
      },
      {
        scale: interpolate(animation.value, [0, 1], [0.97, 1]),
      },
    ],
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [darkColors.surface, lightColors.surface],
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [darkColors.border, lightColors.border],
    ),
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Reanimated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, overlayStyle]}
        />

        <Pressable
          style={StyleSheet.absoluteFill}
          disabled={!dismissOnBackdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close dialog"
        />

        <Reanimated.View
          style={[
            styles.content,
            { width },
            contentAnimatedStyle,
            shadows[mode].lg,
            contentStyle,
          ]}
        >
          {(title || description || showCloseButton) && (
            <View style={styles.header}>
              <View style={styles.heading}>
                {title ? (
                  <ThemedText variant="heading3">{title}</ThemedText>
                ) : null}

                {description ? (
                  <ThemedText variant="bodySmall" color="secondary">
                    {description}
                  </ThemedText>
                ) : null}
              </View>

              {showCloseButton ? (
                <Pressable
                  onPress={onClose}
                  accessibilityRole="button"
                  accessibilityLabel="Close dialog"
                  hitSlop={8}
                  style={styles.closeButton}
                >
                  <ThemedText variant="heading3" color="secondary">
                    ×
                  </ThemedText>
                </Pressable>
              ) : null}
            </View>
          )}

          <View style={styles.body}>{children}</View>

          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </Reanimated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  content: {
    maxWidth: 520,
    maxHeight: "85%",
    borderRadius: borderRadius["2xl"],
    borderWidth: 1,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: spacing.lg,
    gap: spacing.md,
  },
  heading: {
    flex: 1,
    gap: spacing.xs,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: spacing.sm,
    padding: spacing.lg,
    paddingTop: spacing.md,
  },
});

export default ThemedModal;
