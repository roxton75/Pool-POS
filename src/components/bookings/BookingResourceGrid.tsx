import { ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "../shared";
import { spacing } from "../../theme";

import BookingResourceCardSkeleton from "./BookingResourceCardSkeleton";
import BookingResourceCard from "./BookingResourceCard";
import type { BookingResource, Session, BillingSnapshot } from "./types";

type Props = {
  resources: BookingResource[];
  sessions: Session[];
  billing: Record<string, BillingSnapshot>;
  loading: boolean;
  onResourcePress: (resource: BookingResource) => void;
};

export default function BookingResourceGrid({
  resources,
  sessions,
  billing,
  loading,
  onResourcePress,
}: Props) {
  const activeByResource = new Map(
    sessions.map((session) => [session.resourceId, session]),
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.heading}>
          <ThemedText variant="heading2">Resources</ThemedText>
          <ThemedText variant="caption" color="secondary">
            Live availability and session billing.
          </ThemedText>
        </View>

        <ThemedText variant="caption" color="secondary">
          {loading ? "Loading..." : `${resources.length} resources`}
        </ThemedText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carousel}
      >
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <BookingResourceCardSkeleton key={`skeleton-${index}`} />
            ))
          : resources.map((resource) => {
              const session = activeByResource.get(resource.id);

              return (
                <BookingResourceCard
                  key={resource.id}
                  resource={resource}
                  session={session}
                  billing={session ? billing[session.id] : undefined}
                  onPress={() => onResourcePress(resource)}
                />
              );
            })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
  },
  heading: {
    flex: 1,
    gap: spacing.xxs,
  },
  carousel: {
    gap: spacing.md,
    paddingBottom: spacing.xs,
  },
});
