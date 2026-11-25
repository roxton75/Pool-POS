import {
  Image,
  Pressable,
  StyleSheet,
  View,
  type ImageSourcePropType,
} from "react-native";

import { ThemedBadge, ThemedText } from "../shared";
import Reanimated, {
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";

import { darkColors, lightColors, spacing, useTheme } from "../../theme";

export type ResourceStatus =
  | "available"
  | "occupied"
  | "paused"
  | "maintenance";

export interface ResourceCardProps {
  name: string;
  image: ImageSourcePropType;
  ratePerHour: number;
  status: ResourceStatus;
  startedAt?: string;
  elapsedMinutes?: number;
  variant?: "large" | "compact";
  onPress?: () => void;
}

const statusConfig = {
  available: { label: "Available", variant: "success" as const },
  occupied: { label: "Occupied", variant: "warning" as const },
  paused: { label: "Paused", variant: "info" as const },
  maintenance: { label: "Maintenance", variant: "error" as const },
};

function formatDuration(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
}

export default function ResourceCard({
  name,
  image,
  ratePerHour,
  status,
  startedAt,
  elapsedMinutes = 0,
  variant = "compact",
  onPress,
}: ResourceCardProps) {
  const { progress } = useTheme();

  const cardAnimatedStyle = useAnimatedStyle(() => ({
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
  const config = statusConfig[status];

  return (
    <Reanimated.View style={[styles.card, cardAnimatedStyle]}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.cardContent, pressed && styles.pressed]}
      >
        {/* Resource Cutout */}
        <Image
          source={image}
          resizeMode="contain"
          style={[
            variant === "large"
              ? styles.resourceImageTop
              : styles.resourceImageBottom,
          ]}
        />

        {/* Resource Name */}
        <View style={styles.titleContainer}>
          <ThemedText variant="heading3" numberOfLines={2} color="secondary">
            {name}
          </ThemedText>
        </View>

        {/* Status Badge */}
        <View style={styles.badge}>
          <ThemedBadge
            label={config.label}
            variant={config.variant}
            size="sm"
          />
        </View>

        {/* Session Information */}
        <View style={styles.sessionInfo}>
          {status === "occupied" || status === "paused" ? (
            <>
              <ThemedText variant="heading1">
                {formatDuration(elapsedMinutes)}
              </ThemedText>

              <ThemedText color="secondary" variant="caption">
                Started at {startedAt ?? "--:--"}
              </ThemedText>
            </>
          ) : (
            <ThemedText color="secondary" variant="caption">
              {status === "available"
                ? "Ready for a new session"
                : "Currently unavailable"}
            </ThemedText>
          )}

          <ThemedText variant="bodySmall">
            {ratePerHour > 0 ? `₹${ratePerHour} / hr` : "Rate not configured"}
          </ThemedText>
        </View>
      </Pressable>
    </Reanimated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 160,
    width: "100%",
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
  },
  cardContent: {
    flex: 1,
    padding: spacing.md,
    justifyContent: "space-between",
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },

  resourceImageTop: {
    position: "absolute",
    right: -70,
    bottom: -20,

    width: "84%",
    height: "95%",
    zIndex: 0,
  },
  resourceImageBottom: {
    position: "absolute",
    right: -60,
    bottom: -20,

    width: "84%",
    height: "95%",
    zIndex: 0,
  },
  titleContainer: {
    width: "62%",
    zIndex: 1,
  },
  badge: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    zIndex: 2,
  },
  sessionInfo: {
    zIndex: 1,
    alignItems: "flex-start",
    gap: 3,
  },
});
