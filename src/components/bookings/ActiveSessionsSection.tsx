import { Users } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { ThemedBadge, ThemedCard, ThemedText } from "../shared";

import { spacing, useTheme } from "../../theme";

import ActiveSessionCard from "./ActiveSessionCard";
import type {
  BillingSnapshot,
  BookingResource,
  Session,
  SessionAction,
} from "./types";

type Props = {
  sessions: Session[];
  resources: BookingResource[];
  billing: Record<string, BillingSnapshot>;
  now: number;
  busySessionId: string | null;
  onAction: (session: Session, action: SessionAction) => void;
  onSelectSession: (session: Session) => void;
};

export default function ActiveSessionsSection({
  sessions,
  resources,
  billing,
  now,
  busySessionId,
  onAction,
  onSelectSession,
}: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.heading}>
          <ThemedText variant="heading2">Active Sessions</ThemedText>
          <ThemedText variant="caption" color="secondary">
            Monitor running sessions and estimated charges.
          </ThemedText>
        </View>

        <ThemedBadge label={`${sessions.length} sessions`} variant="neutral" />
      </View>

      {sessions.length === 0 ? (
        <ThemedCard variant="secondary" padding="xl">
          <View style={styles.empty}>
            <Users size={28} color={colors.text.secondary} />

            <ThemedText variant="subtitle">No active sessions</ThemedText>

            <ThemedText variant="bodySmall" color="secondary">
              Start a session when a customer takes a table or console.
            </ThemedText>
          </View>
        </ThemedCard>
      ) : (
        <View style={styles.list}>
          {sessions.map((session) => (
            <ActiveSessionCard
              key={session.id}
              session={session}
              resource={resources.find(
                (item) => item.id === session.resourceId,
              )}
              billing={billing[session.id]}
              now={now}
              busy={busySessionId === session.id}
              onAction={(action) => onAction(session, action)}
              onSelect={() => onSelectSession(session)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  heading: {
    flex: 1,
    gap: spacing.xxs,
  },
  list: {
    gap: spacing.md,
  },
  empty: {
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
});
