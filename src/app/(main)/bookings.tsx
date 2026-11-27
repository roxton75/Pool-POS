/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/purity */

import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Alert, ScrollView, StyleSheet, View } from "react-native";

import { RightPanel } from "../../components/layout";
import { ThemedButton, ThemedText, ThemedCard } from "../../components/shared";
import { Users } from "lucide-react-native";
import { useDatabase } from "../../database";
import {
  useLiveActiveSessions,
  useLiveBookingResources,
} from "../../hooks/useLiveBookings";

import { sessionService } from "../../services/session.service";
import { spacing } from "../../theme";

import BookingHeader from "../../components/bookings/BookingHeader";
import BookingStats from "../../components/bookings/BookingStats";
import BookingResourceGrid from "../../components/bookings/BookingResourceGrid";
import ActiveSessionsSection from "../../components/bookings/ActiveSessionsSection";
import StartSessionModal from "../../components/bookings/StartSessionModal";

import type {
  BillingSnapshot,
  BookingResource,
  Session,
  SessionAction,
} from "../../components/bookings/types";
import { useTheme } from "@/theme/ThemeProvider";

export default function BookingsScreen() {
  const db = useDatabase();
  const { colors } = useTheme();
  // Live database queries
  const resourceQuery = useLiveBookingResources();
  const sessionQuery = useLiveActiveSessions();

  const resourceRows = resourceQuery.data ?? [];
  const sessionRows = sessionQuery.data ?? [];

  // Map database rows to UI types
  const resources = useMemo<BookingResource[]>(
    () =>
      resourceRows.map((row) => ({
        id: row.id,
        name: row.name,
        type: row.type,
        ratePerHour: row.ratePerHour,
        isActive: row.isActive === 1,
        isMaintenance: row.isMaintenance === 1,
      })),
    [resourceRows],
  );

  const sessions = useMemo<Session[]>(
    () =>
      sessionRows.map((row) => ({
        id: row.id,
        bookingNumber: row.bookingNumber,
        resourceId: row.resourceId,
        customerId: row.customerId,
        customerName: row.customerName,
        customerPhone: row.customerPhone,
        status: row.status as Session["status"],
        rateSnapshot: row.rateSnapshot,
        gracePeriodSnapshot: row.gracePeriodSnapshot,
        startedAt: row.startedAt,
        endedAt: row.endedAt,
        totalPausedSeconds: row.totalPausedSeconds,
        totalAmount: row.totalAmount,
        notes: row.notes,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      })),
    [sessionRows],
  );

  // Screen state
  const [billing, setBilling] = useState<Record<string, BillingSnapshot>>({});

  const [now, setNow] = useState(Date.now());
  const [busySessionId, setBusySessionId] = useState<string | null>(null);
  const [resourcesLoaded, setResourcesLoaded] = useState(false);

  useEffect(() => {
    if (resourceQuery.data === undefined) return;

    // Keep skeleton visible briefly to avoid a flash.
    const timeout = setTimeout(() => {
      setResourcesLoaded(true);
    }, 600);

    return () => clearTimeout(timeout);
  }, [resourceQuery.data]);

  const [selectedResource, setSelectedResource] =
    useState<BookingResource | null>(null);

  const [startModalVisible, setStartModalVisible] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resource/session calculations
  const activeByResource = useMemo(() => {
    const map = new Map<string, Session>();

    for (const session of sessions) {
      map.set(session.resourceId, session);
    }

    return map;
  }, [sessions]);

  const availableResources = useMemo(
    () =>
      resources.filter(
        (resource) =>
          resource.isActive &&
          !resource.isMaintenance &&
          !activeByResource.has(resource.id),
      ),
    [resources, activeByResource],
  );

  const runningCount = sessions.filter(
    (session) => session.status === "active",
  ).length;

  const pausedCount = sessions.filter(
    (session) => session.status === "paused",
  ).length;

  const availableCount = resources.filter(
    (resource) =>
      resource.isActive &&
      !resource.isMaintenance &&
      !sessions.some((session) => session.resourceId === resource.id),
  ).length;

  const totalCount = resources.length;

  // Billing refresh
  const refreshBilling = useCallback(async () => {
    try {
      const entries = await Promise.all(
        sessions.map(async (session) => {
          try {
            const value = await sessionService.getBilling(db, session.id);

            return [session.id, value] as const;
          } catch {
            return [session.id, null] as const;
          }
        }),
      );

      const nextBilling: Record<string, BillingSnapshot> = {};

      for (const [id, value] of entries) {
        if (value) {
          nextBilling[id] = value;
        }
      }

      setBilling(nextBilling);
      setError(null);
    } catch (err) {
      console.error("[Bookings] Billing refresh failed", err);

      setError(
        err instanceof Error
          ? err.message
          : "Could not refresh booking estimates.",
      );
    }
  }, [db, sessions]);

  useEffect(() => {
    void refreshBilling();

    const billingInterval = setInterval(() => void refreshBilling(), 5000);

    const clockInterval = setInterval(() => setNow(Date.now()), 1000);

    return () => {
      clearInterval(billingInterval);
      clearInterval(clockInterval);
    };
  }, [refreshBilling]);

  // Start session modal
  const openStartModal = useCallback(
    (resourceId?: string) => {
      setSelectedResourceId(resourceId ?? availableResources[0]?.id ?? "");

      setCustomerName("");
      setCustomerPhone("");
      setNotes("");
      setStartModalVisible(true);
    },
    [availableResources],
  );

  const handleResourcePress = (resource: BookingResource) => {
    const session = activeByResource.get(resource.id);

    if (session) {
      setSelectedResource(resource);
      return;
    }

    if (resource.isActive && !resource.isMaintenance) {
      openStartModal(resource.id);
    }
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
    } catch (err) {
      Alert.alert(
        "Could not start session",
        err instanceof Error ? err.message : "Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  // Session actions
  const runSessionAction = async (session: Session, action: SessionAction) => {
    const actionLabel = action;

    const execute = async () => {
      setBusySessionId(session.id);

      try {
        if (action === "pause") {
          await sessionService.pause(db, session.id);
        }

        if (action === "resume") {
          await sessionService.resume(db, session.id);
        }

        if (action === "complete") {
          const result = await sessionService.complete(db, session.id);

          Alert.alert(
            "Session completed",
            `Bill ${result.bill.billNumber}\nTotal payable: ₹${result.bill.totalAmount.toLocaleString("en-IN")}`,
          );
        }

        if (action === "cancel") {
          await sessionService.cancel(db, session.id);
        }
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
        action === "complete"
          ? "Complete this session?"
          : "Cancel this session?",
        action === "complete"
          ? "The final amount will be calculated and a bill will be created."
          : "This session will be marked as cancelled.",
        [
          {
            text: "Keep session",
            style: "cancel",
          },
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

  return (
    <View style={styles.container}>
      {/* Main workspace */}
      <ScrollView
        style={styles.workspace}
        contentContainerStyle={styles.workspaceContent}
        showsVerticalScrollIndicator={false}
      >
        <BookingHeader
          onNewSession={() => openStartModal()}
          disabled={availableResources.length === 0}
        />

        <BookingStats
          available={availableCount}
          running={runningCount}
          paused={pausedCount}
          total={totalCount}
          ready={
            resourceQuery.data !== undefined && sessionQuery.data !== undefined
          }
        />
        {error ? (
          <View style={styles.error}>
            {/* <ThemedText color="error">{error}</ThemedText> */}
            <ThemedText>{error}</ThemedText>

            <ThemedButton
              title="Retry billing refresh"
              variant="outline"
              size="sm"
              onPress={() => void refreshBilling()}
            />
          </View>
        ) : null}

        <BookingResourceGrid
          resources={resources}
          sessions={sessions}
          billing={billing}
          loading={!resourcesLoaded}
          onResourcePress={handleResourcePress}
        />

        {sessionQuery.data === undefined ? (
          <ThemedText color="secondary">Loading sessions...</ThemedText>
        ) : sessions.length === 0 ? (
          <ThemedCard
            variant="secondary"
            padding="xl"
            style={styles.emptyState}
          >
            <View style={styles.emptyContent}>
              <Users size={30} color={colors.text.secondary} />

              <ThemedText variant="subtitle">No active sessions</ThemedText>

              <ThemedText variant="bodySmall" color="secondary">
                Start a session when a customer takes a table or console.
              </ThemedText>
            </View>
          </ThemedCard>
        ) : (
          <ActiveSessionsSection
            sessions={sessions}
            resources={resources}
            billing={billing}
            now={now}
            busySessionId={busySessionId}
            onAction={runSessionAction}
            onSelectSession={(session) => {
              const resource = resources.find(
                (item) => item.id === session.resourceId,
              );

              if (resource) setSelectedResource(resource);
            }}
          />
        )}
      </ScrollView>

      {/* Right operations panel */}
      <RightPanel
        width={290}
        selectedResource={
          selectedResource
            ? {
                id: selectedResource.id,
                name: selectedResource.name,
                ratePerHour: selectedResource.ratePerHour,
                elapsedMinutes: Math.floor(
                  (billing[activeByResource.get(selectedResource.id)?.id ?? ""]
                    ?.elapsedSeconds ?? 0) / 60,
                ),
                amountDue:
                  billing[activeByResource.get(selectedResource.id)?.id ?? ""]
                    ?.totalAmount ?? 0,
                status:
                  activeByResource.get(selectedResource.id)?.status === "paused"
                    ? "paused"
                    : "occupied",
              }
            : undefined
        }
      />

      {/* Start session modal */}
      <StartSessionModal
        visible={startModalVisible}
        resources={availableResources}
        selectedResourceId={selectedResourceId}
        customerName={customerName}
        customerPhone={customerPhone}
        notes={notes}
        saving={saving}
        onClose={() => setStartModalVisible(false)}
        onStart={() => void handleStart()}
        onSelectResource={setSelectedResourceId}
        onCustomerNameChange={setCustomerName}
        onCustomerPhoneChange={setCustomerPhone}
        onNotesChange={setNotes}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    minWidth: 0,
    gap: spacing.md,
  },
  workspace: {
    flex: 1,
    minWidth: 0,
  },
  workspaceContent: {
    padding: spacing.md,
    paddingBottom: spacing["5xl"],
    gap: spacing.xl,
  },
  error: {
    gap: spacing.sm,
  },
  emptyState: {
    minHeight: 150,
    justifyContent: "center",
  },

  emptyContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
});
