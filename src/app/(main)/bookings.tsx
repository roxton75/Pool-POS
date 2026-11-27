/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/purity */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  CircleDot,
  Clock3,
  Gamepad2,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Square,
  Users,
} from "lucide-react-native";

import { useDatabase } from "../../database";
import {
  ThemedBadge,
  ThemedButton,
  ThemedCard,
  ThemedInput,
  ThemedModal,
  ThemedText,
} from "../../components/shared";
import { spacing, useTheme } from "../../theme";
import { sessionService } from "../../services/session.service";
import type { Session } from "../../types/session";

type Resource = {
  id: string;
  name: string;
  type: string;
  ratePerHour: number;
  isActive: boolean;
  isMaintenance: boolean;
};

type BillingSnapshot = {
  elapsedSeconds: number;
  pausedSeconds: number;
  billableSeconds: number;
  totalAmount: number;
};

const money = (amount: number) =>
  `₹${Math.max(0, Math.ceil(amount)).toLocaleString("en-IN")}`;

function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;

  return [hours, minutes, remainder]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
}

function resourceTypeLabel(type: string): string {
  switch (type) {
    case "american_pool":
      return "American Pool";
    case "mini_snooker":
      return "Mini Snooker";
    case "big_snooker":
      return "Big Snooker";
    case "ps5":
      return "Gaming Console";
    default:
      return "Resource";
  }
}

export default function BookingsScreen() {
  const db = useDatabase();
  const { colors } = useTheme();

  const [resources, setResources] = useState<Resource[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [billing, setBilling] = useState<Record<string, BillingSnapshot>>({});
  const [now, setNow] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [busySessionId, setBusySessionId] = useState<string | null>(null);
  const [startModalVisible, setStartModalVisible] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [resourceRows, activeSessions] = await Promise.all([
        db.getAllAsync<{
          id: string;
          name: string;
          type: string;
          rate_per_hour: number;
          is_active: number;
          is_maintenance: number;
        }>(
          `SELECT id, name, type, rate_per_hour, is_active, is_maintenance
           FROM resources
           ORDER BY display_order ASC`,
        ),
        sessionService.getActive(db),
      ]);

      const nextResources: Resource[] = resourceRows.map((row) => ({
        id: row.id,
        name: row.name,
        type: row.type,
        ratePerHour: row.rate_per_hour,
        isActive: row.is_active === 1,
        isMaintenance: row.is_maintenance === 1,
      }));

      const nextBillingEntries = await Promise.all(
        activeSessions.map(async (session) => {
          try {
            const value = await sessionService.getBilling(db, session.id);
            return [session.id, value] as const;
          } catch {
            return [session.id, null] as const;
          }
        }),
      );

      const nextBilling: Record<string, BillingSnapshot> = {};
      for (const [id, value] of nextBillingEntries) {
        if (value) nextBilling[id] = value;
      }

      setResources(nextResources);
      setSessions(activeSessions);
      setBilling(nextBilling);
      setError(null);
    } catch (err) {
      console.error("[Bookings] Refresh failed", err);
      setError(
        err instanceof Error ? err.message : "Could not load bookings.",
      );
    } finally {
      setLoading(false);
    }
  }, [db]);

  useEffect(() => {
    void refresh();
    const refreshInterval = setInterval(() => void refresh(), 5000);
    const clockInterval = setInterval(() => setNow(Date.now()), 1000);

    return () => {
      clearInterval(refreshInterval);
      clearInterval(clockInterval);
    };
  }, [refresh]);

  const activeByResource = useMemo(() => {
    const map = new Map<string, Session>();
    for (const session of sessions) map.set(session.resourceId, session);
    return map;
  }, [sessions]);

  const availableResources = resources.filter(
    (resource) =>
      resource.isActive &&
      !resource.isMaintenance &&
      !activeByResource.has(resource.id),
  );

  const occupiedCount = sessions.filter(
    (session) => session.status === "active",
  ).length;
  const pausedCount = sessions.filter(
    (session) => session.status === "paused",
  ).length;

  const openStartModal = () => {
    setSelectedResourceId(availableResources[0]?.id ?? "");
    setCustomerName("");
    setCustomerPhone("");
    setNotes("");
    setStartModalVisible(true);
  };

  const handleStart = async () => {
    if (!selectedResourceId) {
      Alert.alert("Select a resource", "Choose an available table or console.");
      return;
    }

    setSaving(true);
    try {
      await sessionService.start(db, {
        resourceId: selectedResourceId,
        customerName: customerName.trim() || null,
        customerPhone: customerPhone.trim() || null,
        notes: notes.trim() || null,
      });
      setStartModalVisible(false);
      await refresh();
    } catch (err) {
      Alert.alert(
        "Could not start session",
        err instanceof Error ? err.message : "Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const runSessionAction = async (
    session: Session,
    action: "pause" | "resume" | "complete" | "cancel",
  ) => {
    const actionLabel =
      action === "pause"
        ? "pause"
        : action === "resume"
          ? "resume"
          : action === "complete"
            ? "complete"
            : "cancel";

    const execute = async () => {
      setBusySessionId(session.id);
      try {
        if (action === "pause") await sessionService.pause(db, session.id);
        if (action === "resume") await sessionService.resume(db, session.id);
        if (action === "complete") {
          const result = await sessionService.complete(db, session.id);
          Alert.alert(
            "Session completed",
            `Bill ${result.bill.billNumber}\nTotal payable: ${money(result.bill.totalAmount)}`,
          );
        }
        if (action === "cancel") await sessionService.cancel(db, session.id);
        await refresh();
      } catch (err) {
        Alert.alert(
          `Could not ${actionLabel} session`,
          err instanceof Error ? err.message : "Please try again.",
        );
      } finally {
        setBusySessionId(null);
      }
    };

    if (action === "complete" || action === "cancel") {
      Alert.alert(
        action === "complete" ? "Complete this session?" : "Cancel this session?",
        action === "complete"
          ? "The final amount will be calculated and a bill will be created."
          : "This session will be marked as cancelled.",
        [
          { text: "Keep session", style: "cancel" },
          {
            text: action === "complete" ? "Complete" : "Cancel session",
            style: action === "cancel" ? "destructive" : "default",
            onPress: () => void execute(),
          },
        ],
      );
      return;
    }

    void execute();
  };

  const getElapsed = (session: Session) => {
    const end = session.endedAt ? new Date(session.endedAt).getTime() : now;
    return Math.max(
      0,
      Math.floor((end - new Date(session.startedAt).getTime()) / 1000),
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <ThemedText variant="heading1">Bookings</ThemedText>
            <ThemedText color="secondary">
              Manage walk-in sessions and live table usage.
            </ThemedText>
          </View>
          <ThemedButton
            title="New Session"
            leftIcon={<Plus size={17} color={colors.background} />}
            onPress={openStartModal}
            disabled={availableResources.length === 0}
          />
        </View>

        <View style={styles.statsRow}>
          <StatCard label="Available" value={availableResources.length} icon={<CircleDot size={18} />} />
          <StatCard label="Running" value={occupiedCount} icon={<Play size={18} />} />
          <StatCard label="Paused" value={pausedCount} icon={<Pause size={18} />} />
        </View>

        {error ? (
          <ThemedCard variant="error" padding="md">
            <ThemedText>{error}</ThemedText>
            <ThemedButton
              title="Try again"
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw size={15} />}
              onPress={() => void refresh()}
            />
          </ThemedCard>
        ) : null}

        <View style={styles.sectionHeader}>
          <View style={styles.sectionCopy}>
            <ThemedText variant="heading2">Resource status</ThemedText>
            <ThemedText color="secondary" variant="caption">
              Select an available resource to start a walk-in session.
            </ThemedText>
          </View>
          <ThemedButton
            title=""
            size="sm"
            variant="ghost"
            leftIcon={<RefreshCw size={16} color={colors.text.secondary} />}
            onPress={() => void refresh()}
          />
        </View>

        {loading ? (
          <ThemedCard padding="lg">
            <ThemedText color="secondary">Loading resources…</ThemedText>
          </ThemedCard>
        ) : (
          <View style={styles.resourceGrid}>
            {resources.map((resource) => {
              const session = activeByResource.get(resource.id);
              const status = session
                ? session.status
                : resource.isMaintenance
                  ? "maintenance"
                  : resource.isActive
                    ? "available"
                    : "inactive";
              const statusVariant =
                status === "active"
                  ? "warning"
                  : status === "paused"
                    ? "info"
                    : status === "available"
                      ? "success"
                      : "neutral";

              return (
                <Pressable
                  key={resource.id}
                  disabled={status !== "available"}
                  onPress={() => {
                    setSelectedResourceId(resource.id);
                    setStartModalVisible(true);
                  }}
                  style={({ pressed }) => [
                    styles.resourcePressable,
                    pressed && styles.pressed,
                  ]}
                >
                  <ThemedCard
                    padding="md"
                    style={[
                      styles.resourceCard,
                      status === "available" && {
                        borderColor: colors.accent,
                      },
                    ]}
                  >
                    <View style={styles.resourceTop}>
                      <View
                        style={[
                          styles.resourceIcon,
                          { backgroundColor: colors.surfaceSecondary },
                        ]}
                      >
                        {resource.type === "ps5" ? (
                          <Gamepad2 size={20} color={colors.text.primary} />
                        ) : (
                          <CircleDot size={20} color={colors.text.primary} />
                        )}
                      </View>
                      <ThemedBadge
                        label={status}
                        variant={statusVariant}
                        size="sm"
                        dot
                      />
                    </View>
                    <ThemedText variant="subtitle">{resource.name}</ThemedText>
                    <ThemedText color="secondary" variant="caption">
                      {resourceTypeLabel(resource.type)}
                    </ThemedText>
                    <View style={styles.resourceBottom}>
                      <ThemedText variant="heading3">
                        {resource.ratePerHour > 0
                          ? `${money(resource.ratePerHour)} / hr`
                          : "Rate not set"}
                      </ThemedText>
                      {session ? (
                        <ThemedText color="secondary" variant="caption">
                          {formatDuration(getElapsed(session))}
                        </ThemedText>
                      ) : null}
                    </View>
                  </ThemedCard>
                </Pressable>
              );
            })}
          </View>
        )}

        <View style={styles.sectionHeader}>
          <View style={styles.sectionCopy}>
            <ThemedText variant="heading2">Active sessions</ThemedText>
            <ThemedText color="secondary" variant="caption">
              Live duration and estimated session charges.
            </ThemedText>
          </View>
          <ThemedBadge label={`${sessions.length} sessions`} variant="neutral" />
        </View>

        {sessions.length === 0 ? (
          <ThemedCard variant="secondary" padding="xl">
            <View style={styles.emptyState}>
              <Users size={28} color={colors.text.secondary} />
              <ThemedText variant="subtitle">No active sessions</ThemedText>
              <ThemedText color="secondary" variant="bodySmall">
                Start a session when a customer takes a table or console.
              </ThemedText>
            </View>
          </ThemedCard>
        ) : (
          <View style={styles.sessionList}>
            {sessions.map((session) => {
              const resource = resources.find(
                (item) => item.id === session.resourceId,
              );
              const estimate = billing[session.id];
              const busy = busySessionId === session.id;

              return (
                <ThemedCard key={session.id} padding="lg" style={styles.sessionCard}>
                  <View style={styles.sessionHeader}>
                    <View style={styles.sessionTitle}>
                      <ThemedText variant="subtitle">
                        {resource?.name ?? "Unknown resource"}
                      </ThemedText>
                      <ThemedText color="secondary" variant="caption">
                        {session.bookingNumber}
                      </ThemedText>
                    </View>
                    <ThemedBadge
                      label={session.status}
                      variant={session.status === "paused" ? "info" : "warning"}
                      dot
                    />
                  </View>

                  <View style={styles.customerRow}>
                    <Users size={15} color={colors.text.secondary} />
                    <ThemedText color="secondary" variant="bodySmall">
                      {session.customerName || "Walk-in customer"}
                      {session.customerPhone ? ` · ${session.customerPhone}` : ""}
                    </ThemedText>
                  </View>

                  <View style={styles.metricsRow}>
                    <Metric
                      label="Duration"
                      value={formatDuration(getElapsed(session))}
                      icon={<Clock3 size={15} />}
                    />
                    <Metric
                      label="Estimated amount"
                      value={money(estimate?.totalAmount ?? 0)}
                    />
                    <Metric
                      label="Hourly rate"
                      value={money(session.rateSnapshot)}
                    />
                  </View>

                  <View style={styles.sessionActions}>
                    {session.status === "active" ? (
                      <ThemedButton
                        title="Pause"
                        size="sm"
                        variant="secondary"
                        leftIcon={<Pause size={15} />}
                        disabled={busy}
                        loading={busy}
                        onPress={() => void runSessionAction(session, "pause")}
                      />
                    ) : (
                      <ThemedButton
                        title="Resume"
                        size="sm"
                        leftIcon={<Play size={15} />}
                        disabled={busy}
                        loading={busy}
                        onPress={() => void runSessionAction(session, "resume")}
                      />
                    )}
                    <ThemedButton
                      title="Complete"
                      size="sm"
                      variant="outline"
                      leftIcon={<Square size={14} />}
                      disabled={busy}
                      onPress={() => void runSessionAction(session, "complete")}
                    />
                    <ThemedButton
                      title="Cancel"
                      size="sm"
                      variant="ghost"
                      disabled={busy}
                      onPress={() => void runSessionAction(session, "cancel")}
                    />
                  </View>
                </ThemedCard>
              );
            })}
          </View>
        )}
      </ScrollView>

      <ThemedModal
        visible={startModalVisible}
        onClose={() => setStartModalVisible(false)}
        title="Start new session"
        description="Choose an available resource and add customer details."
        footer={
          <View style={styles.modalFooter}>
            <ThemedButton
              title="Cancel"
              variant="outline"
              onPress={() => setStartModalVisible(false)}
              disabled={saving}
            />
            <ThemedButton
              title="Start session"
              loading={saving}
              disabled={saving || !selectedResourceId}
              onPress={() => void handleStart()}
            />
          </View>
        }
      >
        <View style={styles.modalContent}>
          <ThemedText variant="label">RESOURCE</ThemedText>
          <View style={styles.resourceChoices}>
            {availableResources.length === 0 ? (
              <ThemedText color="secondary" variant="bodySmall">
                No resources are currently available.
              </ThemedText>
            ) : (
              availableResources.map((resource) => (
                <Pressable
                  key={resource.id}
                  onPress={() => setSelectedResourceId(resource.id)}
                  style={[
                    styles.resourceChoice,
                    {
                      borderColor:
                        selectedResourceId === resource.id
                          ? colors.accent
                          : colors.border,
                      backgroundColor:
                        selectedResourceId === resource.id
                          ? colors.surfaceSecondary
                          : "transparent",
                    },
                  ]}
                >
                  <ThemedText variant="bodyMedium">{resource.name}</ThemedText>
                  <ThemedText color="secondary" variant="caption">
                    {resource.ratePerHour > 0
                      ? `${money(resource.ratePerHour)} / hour`
                      : "Rate not set"}
                  </ThemedText>
                </Pressable>
              ))
            )}
          </View>

          <ThemedInput
            label="Customer name"
            placeholder="Walk-in customer"
            value={customerName}
            onChangeText={setCustomerName}
          />
          <ThemedInput
            label="Phone number"
            placeholder="Optional"
            value={customerPhone}
            onChangeText={setCustomerPhone}
            keyboardType="phone-pad"
          />
          <ThemedInput
            label="Notes"
            placeholder="Optional session notes"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
          <ThemedText color="secondary" variant="caption">
            Billing starts now. The configured grace period is applied
            automatically.
          </ThemedText>
        </View>
      </ThemedModal>
    </View>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <ThemedCard padding="md" style={styles.statCard}>
      <View style={styles.statIcon}>{icon}</View>
      <ThemedText variant="heading2">{value}</ThemedText>
      <ThemedText color="secondary" variant="caption">{label}</ThemedText>
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
        <ThemedText color="secondary" variant="caption">{label}</ThemedText>
      </View>
      <ThemedText variant="subtitle">{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing["5xl"],
    gap: spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  headerCopy: { flex: 1, minWidth: 220, gap: spacing.xs },
  statsRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  statCard: { flexGrow: 1, flexBasis: 120, gap: spacing.xs },
  statIcon: { marginBottom: spacing.xs },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  sectionCopy: { flex: 1, gap: spacing.xxs },
  resourceGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  resourcePressable: { flexGrow: 1, flexBasis: 220, minWidth: 190 },
  pressed: { opacity: 0.78 },
  resourceCard: { flex: 1, minHeight: 160, gap: spacing.sm },
  resourceTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  resourceIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  resourceBottom: {
    marginTop: "auto",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  sessionList: { gap: spacing.md },
  sessionCard: { gap: spacing.md },
  sessionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  sessionTitle: { flex: 1, gap: spacing.xxs },
  customerRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  metricsRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xl },
  metric: { minWidth: 120, gap: spacing.xs },
  metricLabel: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  sessionActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing.sm,
  },
  emptyState: { alignItems: "center", gap: spacing.sm, paddingVertical: spacing.md },
  modalContent: { gap: spacing.md },
  resourceChoices: { gap: spacing.sm },
  resourceChoice: {
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.xxs,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});
