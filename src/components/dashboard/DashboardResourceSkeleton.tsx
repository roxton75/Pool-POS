/* eslint-disable react-hooks/static-components */
/* eslint-disable react-hooks/refs */
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

import { ThemedCard } from "../shared";
import { spacing, useTheme } from "../../theme";

type Props = {
  variant: "large" | "compact";
};

export default function DashboardResourceSkeleton({ variant }: Props) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.85,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [opacity]);

  const Placeholder = ({
    width,
    height,
    radius = 5,
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
        backgroundColor: colors.border,
        opacity,
      }}
    />
  );

  const isLarge = variant === "large";

  return (
    <ThemedCard
      padding="md"
      style={[styles.card, isLarge ? styles.largeCard : styles.compactCard]}
    >
      <View style={styles.content}>
        <Placeholder width="65%" height={17} />

        <View style={styles.details}>
          <Placeholder width={isLarge ? 105 : 85} height={27} />
          <Placeholder width={90} height={11} />
          <Placeholder width={isLarge ? 115 : 95} height={11} />
        </View>
      </View>

      <View
        style={[
          styles.imagePlaceholder,
          isLarge ? styles.largeImage : styles.compactImage,
        ]}
      >
        <Placeholder width="100%" height={isLarge ? 90 : 75} radius={12} />
      </View>

      <View style={styles.badgePlaceholder}>
        <Placeholder width={76} height={22} radius={20} />
      </View>
    </ThemedCard>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 160,
    flexDirection: "row",
    justifyContent: "space-between",
    overflow: "hidden",
    position: "relative",
  },
  largeCard: {
    minWidth: 0,
  },
  compactCard: {
    minWidth: 0,
  },
  content: {
    flex: 1,
    minWidth: 0,
    justifyContent: "space-between",
    paddingVertical: spacing.xs,
  },
  details: {
    gap: spacing.sm,
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  largeImage: {
    width: "43%",
    marginRight: -spacing.xs,
  },
  compactImage: {
    width: "40%",
    marginRight: -spacing.xs,
  },
  badgePlaceholder: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
  },
});
