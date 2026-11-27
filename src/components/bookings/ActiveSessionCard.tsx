import { Clock3, Pause, Play, Square, Users } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import type React from "react";

import { ThemedBadge, ThemedButton, ThemedCard, ThemedText } from "../shared";

import { spacing } from "../../theme";
import type {
  BillingSnapshot,
  BookingResource,
  Session,
  SessionAction,
} from "./types";

type Props = {
  session: Session;
  resource?: BookingResource;
  billing?: BillingSnapshot;
  now: number;
  busy: boolean;
  onAction: (action: SessionAction) => void;
  onSelect: () => void;
};

const money = (amount: number) =>
  `₹${Math.max(0, Math.ceil(amount)).toLocaleString("en-IN")}`;

function formatDuration(totalSeconds: number) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;

  return [hours, minutes, remainder]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
}

export default function ActiveSessionCard({
  session,
  resource,
  billing,
  now,
  busy,
  onAction,
  onSelect,
}: Props) {
  const end = session.endedAt ? new Date(session.endedAt).getTime() : now;

  const elapsed = Math.max(
    0,
    Math.floor((end - new Date(session.startedAt).getTime()) / 1000),
  );

  return (
    <ThemedCard padding="lg" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.title}>
          <ThemedText variant="subtitle">
            {resource?.name ?? "Unknown resource"}
          </ThemedText>

          <ThemedText variant="caption" color="secondary">
            {session.bookingNumber}
          </ThemedText>
        </View>

        <ThemedBadge
          label={session.status}
          variant={session.status === "paused" ? "info" : "warning"}
          dot
        />
      </View>

      <View style={styles.customer}>
        <Users size={15} />
        <ThemedText variant="bodySmall" color="secondary">
          {session.customerName || "Walk-in customer"}
          {session.customerPhone ? ` · ${session.customerPhone}` : ""}
        </ThemedText>
      </View>

      <View style={styles.metrics}>
        <Metric
          label="Duration"
          value={formatDuration(elapsed)}
          icon={<Clock3 size={14} />}
        />

        <Metric
          label="Estimated amount"
          value={money(billing?.totalAmount ?? 0)}
        />

        <Metric label="Hourly rate" value={money(session.rateSnapshot)} />
      </View>

      <View style={styles.actions}>
        {session.status === "active" ? (
          <ThemedButton
            title="Pause"
            size="sm"
            variant="secondary"
            leftIcon={<Pause size={14} />}
            disabled={busy}
            loading={busy}
            onPress={() => onAction("pause")}
          />
        ) : (
          <ThemedButton
            title="Resume"
            size="sm"
            leftIcon={<Play size={14} />}
            disabled={busy}
            loading={busy}
            onPress={() => onAction("resume")}
          />
        )}

        <ThemedButton
          title="Complete"
          size="sm"
          variant="outline"
          leftIcon={<Square size={13} />}
          disabled={busy}
          onPress={() => onAction("complete")}
        />

        <ThemedButton
          title="Cancel"
          size="sm"
          variant="ghost"
          disabled={busy}
          onPress={() => onAction("cancel")}
        />

        <View style={styles.selectAction}>
          <ThemedButton
            title="Details"
            size="sm"
            variant="ghost"
            onPress={onSelect}
          />
        </View>
      </View>
    </ThemedCard>
  );
}

function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <View style={styles.metric}>
      <View style={styles.metricLabel}>
        {icon}
        <ThemedText variant="caption" color="secondary">
          {label}
        </ThemedText>
      </View>

      <ThemedText variant="subtitle">{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  title: {
    flex: 1,
    gap: spacing.xxs,
  },
  customer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  metrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.lg,
  },
  metric: {
    minWidth: 115,
    flex: 1,
    gap: spacing.xs,
  },
  metricLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing.sm,
  },
  selectAction: {
    marginLeft: "auto",
  },
});
