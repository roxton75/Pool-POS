import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";

import { ThemedBadge, ThemedCard, ThemedText } from "../shared";

import { spacing } from "../../theme";
import type { BookingResource, Session, BillingSnapshot } from "./types";

type Props = {
  resource: BookingResource;
  session?: Session;
  billing?: BillingSnapshot;
  onPress: () => void;
};

const money = (amount: number) =>
  `₹${Math.max(0, Math.ceil(amount)).toLocaleString("en-IN")}`;

// Match assets using resource names rather than database IDs.
function getResourceImage(name: string) {
  const normalized = name.toLowerCase();

  if (normalized.includes("ps5")) {
    return require("../../../assets/resources/ps5-dualshocks.avif");
  }

  if (normalized.includes("american pool")) {
    return require("../../../assets/resources/pool.avif");
  }

  if (normalized.includes("snooker")) {
    return require("../../../assets/resources/snooker.avif");
  }

  return null;
}

export default function BookingResourceCard({
  resource,
  session,
  billing,
  onPress,
}: Props) {
  const status = session
    ? session.status
    : resource.isMaintenance
      ? "maintenance"
      : resource.isActive
        ? "available"
        : "inactive";

  const isPaused = status === "paused";
  const isAvailable = status === "available";
  const isBigSnooker = resource.name.toLowerCase().includes("big snooker");
  const isPS5 = resource.name.toLowerCase().includes("ps5");

  const badgeVariant =
    status === "active"
      ? "active"
      : isPaused
        ? "info"
        : isAvailable
          ? "success"
          : "neutral";

  const image = getResourceImage(resource.name);

  return (
    <Pressable
      onPress={onPress}
      disabled={!session && !isAvailable}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      <ThemedCard padding="lg" style={styles.card}>
        <View style={styles.content}>
          <View style={styles.header}>
            <ThemedText variant="subtitle" numberOfLines={1}>
              {resource.name}
            </ThemedText>

            <ThemedBadge label={status} variant={badgeVariant} size="sm" dot />
          </View>

          {session ? (
            <>
              <View style={styles.amount}>
                <ThemedText variant="heading1">
                  {money(billing?.totalAmount ?? session.totalAmount ?? 0)}
                </ThemedText>

                <ThemedText variant="caption" color="secondary">
                  Estimated session cost
                </ThemedText>
              </View>

              <View style={styles.footer}>
                <ThemedText variant="caption" color="secondary">
                  {isPaused ? "Session paused" : "Session running"}
                </ThemedText>

                <ThemedText variant="caption">
                  {money(session.rateSnapshot)} / hr
                </ThemedText>
              </View>
            </>
          ) : (
            <View style={styles.amount}>
              <ThemedText variant="heading2">
                {resource.ratePerHour > 0 ? money(resource.ratePerHour) : "TBD"}
              </ThemedText>

              <ThemedText variant="caption" color="secondary">
                {resource.ratePerHour > 0 ? "per hour" : "Rate not configured"}
              </ThemedText>

              <ThemedText variant="caption" color="secondary">
                Ready for a new session
              </ThemedText>
            </View>
          )}
        </View>

        {image && (
          <View
            style={[
              styles.imageContainer,
              isBigSnooker && styles.bigSnookerImage,
              isPS5 && styles.ps5Image,
            ]}
          >
            <Image
              source={image}
              contentFit="contain"
              cachePolicy="memory-disk"
              style={styles.image}
            />
          </View>
        )}
      </ThemedCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: 340,
  },
  pressed: {
    opacity: 0.85,
  },
  card: {
    height: 160,
    flexDirection: "row",
    overflow: "hidden",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  content: {
    flex: 1,
    minWidth: 0,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "flex-start",
    gap: spacing.xs,
  },
  amount: {
    gap: 2,
  },
  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: spacing.xs,
  },
  imageContainer: {
    width: 125,
    justifyContent: "center",
    alignItems: "center",
  },
  bigSnookerImage: {
    width: 165,
    marginRight: -8,
  },
  ps5Image: {
    width: 100,
    height: 125,
  },
  image: {
    width: "150%",
    height: 175,
  },
});
