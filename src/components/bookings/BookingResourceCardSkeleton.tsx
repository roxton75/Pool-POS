/* eslint-disable react-hooks/static-components */
/* eslint-disable react-hooks/refs */
import { Animated, StyleSheet, View } from "react-native";
import { useEffect, useRef } from "react";

import { ThemedCard } from "../shared";
import { spacing, useTheme } from "../../theme";

export default function BookingResourceCardSkeleton() {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.9,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [opacity]);

  const skeletonColor = colors.surfaceSecondary;

  const Placeholder = ({
    width,
    height,
    radius = 6,
  }: {
    width: number | `${number}%`;
    height: number;
    radius?: number;
  }) => (
    <Animated.View
      style={{
        width,
        height,
        borderRadius: radius,
        backgroundColor: skeletonColor,
        opacity,
      }}
    />
  );

  return (
    <ThemedCard padding="lg" style={styles.card}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Placeholder width="85%" height={17} />

          <Placeholder width={80} height={21} radius={20} />
        </View>

        <View style={styles.amount}>
          <Placeholder width={75} height={25} />
          <Placeholder width={55} height={11} />
          <Placeholder width={145} height={11} />
        </View>
      </View>

      <View style={styles.imageContainer}>
        <Placeholder width={125} height={85} radius={12} />
      </View>
    </ThemedCard>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 340,
    height: 160,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    minWidth: 0,
  },
  header: {
    gap: spacing.sm,
  },
  amount: {
    gap: spacing.sm,
  },
  imageContainer: {
    width: 125,
    justifyContent: "center",
    alignItems: "center",
  },
});
