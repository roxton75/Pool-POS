/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react/no-unescaped-entities */

// import { useState } from "react";
// import { ScrollView, View, StyleSheet } from "react-native";
// import { useRouter } from "expo-router";
// import {
//   Play,
//   Users,
//   IndianRupee,
//   ClipboardList,
//   Activity,
//   CircleDot,
//   ChevronRight,
// } from "lucide-react-native";

// import { RightPanel } from "../../components/layout";
// import { ThemedButton, ThemedText } from "../../components/shared";

// import ResourceCard, {
//   type ResourceCardProps,
// } from "../../components/dashboard/ResourceCard";
// import KpiCard from "../../components/dashboard/KpiCard";
// import TodaysBookingsTable, {
//   type BookingRow,
// } from "../../components/dashboard/TodaysBookingsTable";

// import { useResources } from "../../hooks";
// import type { Resource } from "../../types";
// import { spacing } from "../../theme";

// const resourceImages: Record<Resource["id"], ResourceCardProps["image"]> = {
//   res_pool_01: require("../../../assets/resources/pool.avif"),
//   res_mini_snooker_01: require("../../../assets/resources/snooker.avif"),
//   res_big_snooker_01: require("../../../assets/resources/snooker.avif"),
//   res_big_snooker_02: require("../../../assets/resources/snooker.avif"),
//   res_ps5_01: require("../../../assets/resources/ps5-dualshocks.avif"),
// };

// const resourcePresentation: Record<
//   Resource["id"],
//   {
//     status: ResourceCardProps["status"];
//     startedAt?: string;
//     elapsedMinutes?: number;
//     variant: ResourceCardProps["variant"];
//   }
// > = {
//   res_big_snooker_01: {
//     status: "paused",
//     startedAt: "05:10 PM",
//     elapsedMinutes: 45,
//     variant: "large",
//   },
//   res_big_snooker_02: {
//     status: "available",
//     variant: "large",
//   },
//   res_mini_snooker_01: {
//     status: "available",
//     variant: "compact",
//   },
//   res_pool_01: {
//     status: "occupied",
//     startedAt: "04:32 PM",
//     elapsedMinutes: 84,
//     variant: "compact",
//   },
//   res_ps5_01: {
//     status: "available",
//     variant: "compact",
//   },
// };

// const kpis = [
//   {
//     title: "Today's Revenue",
//     value: "₹2,450",
//     description: "Total collection today",
//     icon: IndianRupee,
//   },
//   {
//     title: "Sessions",
//     value: "12",
//     description: "Sessions handled",
//     icon: ClipboardList,
//   },
//   {
//     title: "Active Sessions",
//     value: "1",
//     description: "Currently running",
//     icon: Activity,
//   },
// ];

// const bookings: BookingRow[] = [
//   {
//     id: "QZ-001",
//     resource: "American Pool",
//     customer: "Rahul Sharma",
//     startTime: "04:32 PM",
//     endTime: "05:56 PM",
//     amount: "₹350",
//     status: "Active",
//     variant: "active",
//   },
//   {
//     id: "QZ-002",
//     resource: "Big Snooker 01",
//     customer: "Amit Patil",
//     startTime: "05:10 PM",
//     endTime: "--:--",
//     amount: "₹263",
//     status: "Paused",
//     variant: "info",
//   },
//   {
//     id: "QZ-003",
//     resource: "Mini Snooker",
//     customer: "Sneha Deshmukh",
//     startTime: "03:15 PM",
//     endTime: "05:15 PM",
//     amount: "₹500",
//     status: "Completed",
//     variant: "success",
//   },
//   {
//     id: "QZ-004",
//     resource: "PS5 Console",
//     customer: "Karan More",
//     startTime: "02:40 PM",
//     endTime: "04:40 PM",
//     amount: "₹300",
//     status: "Completed",
//     variant: "success",
//   },
// ];

// export default function DashboardScreen() {
//   const router = useRouter();
//   const { resources, loading, error } = useResources();

//   const [selectedResource, setSelectedResource] = useState<Resource | null>(
//     null,
//   );

//   const availableResources = resources.filter(
//     (resource) =>
//       resource.isActive &&
//       !resource.isMaintenance &&
//       resourcePresentation[resource.id]?.status === "available",
//   ).length;

//   const handleResourcePress = (resource: Resource) => {
//     setSelectedResource(resource);
//   };

//   const resourceCards: ResourceCardProps[] = resources
//     .filter((resource) => resource.isActive)
//     .map((resource) => {
//       const presentation = resourcePresentation[resource.id];
//       return {
//         id: resource.id,
//         name: resource.name,
//         image:
//           resourceImages[resource.id] ??
//           require("../../../assets/resources/snooker.avif"),
//         ratePerHour: resource.ratePerHour,
//         status: resource.isMaintenance
//           ? "available"
//           : (presentation?.status ?? "available"),
//         startedAt: presentation?.startedAt,
//         elapsedMinutes: presentation?.elapsedMinutes,
//         variant: presentation?.variant ?? "compact",
//       };
//     });

//   const largeResources = resourceCards.filter(
//     (resource) => resource.variant === "large",
//   );

//   const compactResources = resourceCards.filter(
//     (resource) => resource.variant === "compact",
//   );

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         style={styles.workspace}
//         contentContainerStyle={styles.workspaceContent}
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.header}>
//           <View style={styles.heading}>
//             <ThemedText variant="heading1">Dashboard</ThemedText>

//             <ThemedText variant="bodySmall" color="secondary">
//               Overview of your club's activity and operations.
//             </ThemedText>
//           </View>

//           <View style={styles.actions}>
//             <ThemedButton
//               title="Start Session"
//               variant="primary"
//               size="md"
//               leftIcon={<Play size={16} />}
//               onPress={() => router.push("/(main)/bookings")}
//             />

//             <ThemedButton
//               title="Add to Waitlist"
//               variant="secondary"
//               size="md"
//               leftIcon={<Users size={16} />}
//               onPress={() => router.push("/(main)/waitlist")}
//             />
//           </View>
//         </View>

//         <View style={styles.section}>
//           <ThemedText variant="heading2">Today's Overview</ThemedText>

//           <View style={styles.kpiGrid}>
//             {kpis.map((kpi) => {
//               const Icon = kpi.icon;

//               return (
//                 <KpiCard
//                   key={kpi.title}
//                   title={kpi.title}
//                   value={kpi.value}
//                   description={kpi.description}
//                   icon={<Icon />}
//                 />
//               );
//             })}

//             <KpiCard
//               title="Available Resources"
//               value={`${availableResources} / ${resources.length}`}
//               description="Ready for customers"
//               icon={<CircleDot />}
//             />
//           </View>
//         </View>

//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <ThemedText variant="heading2">Resources</ThemedText>

//             <ThemedText variant="caption" color="secondary">
//               {resources.length} resources
//             </ThemedText>
//           </View>

//           {loading ? (
//             <ThemedText color="secondary">Loading resources...</ThemedText>
//           ) : error ? (
//             <ThemedText color="sage">{error}</ThemedText>
//           ) : (
//             <View style={styles.resourceGrid}>
//               <View style={styles.resourceRow}>
//                 {largeResources.map((resource) => (
//                   <View key={resource.id} style={styles.resourceItem}>
//                     <ResourceCard
//                       {...resource}
//                       onPress={() => {
//                         const selected = resources.find(
//                           (item) => item.id === resource.id,
//                         );

//                         if (selected) handleResourcePress(selected);
//                       }}
//                     />
//                   </View>
//                 ))}
//               </View>

//               <View style={styles.resourceRow}>
//                 {compactResources.map((resource) => (
//                   <View key={resource.id} style={styles.resourceItem}>
//                     <ResourceCard
//                       {...resource}
//                       onPress={() => {
//                         const selected = resources.find(
//                           (item) => item.id === resource.id,
//                         );

//                         if (selected) handleResourcePress(selected);
//                       }}
//                     />
//                   </View>
//                 ))}
//               </View>
//             </View>
//           )}
//         </View>

//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <View style={styles.bookingHeading}>
//               <ThemedText variant="heading2">Today's Bookings</ThemedText>

//               <ThemedText variant="caption" color="secondary">
//                 Today's customer sessions and payments
//               </ThemedText>
//             </View>

//             <ThemedButton
//               rightIcon={<ChevronRight size={14} />}
//               title="View All"
//               variant="ghost"
//               size="sm"
//               onPress={() => router.push("/(main)/booking-history")}
//             />
//           </View>

//           <TodaysBookingsTable bookings={bookings} />
//         </View>
//       </ScrollView>

//       <RightPanel
//         width={290}
//         selectedResource={
//           selectedResource
//             ? {
//                 id: selectedResource.id,
//                 name: selectedResource.name,
//                 ratePerHour: selectedResource.ratePerHour,
//                 status: "occupied",
//               }
//             : undefined
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: "row",
//     minWidth: 0,
//     gap: spacing.md,
//   },
//   workspace: {
//     flex: 1,
//     minWidth: 0,
//   },
//   workspaceContent: {
//     padding: spacing.md,
//     gap: spacing.xl,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     gap: spacing.md,
//   },
//   heading: {
//     flex: 1,
//     gap: spacing.xs,
//   },
//   actions: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: spacing.sm,
//   },
//   section: {
//     gap: spacing.md,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     gap: spacing.md,
//   },
//   resourceGrid: {
//     gap: spacing.sm,
//   },
//   resourceRow: {
//     flexDirection: "row",
//     gap: spacing.sm,
//   },
//   resourceItem: {
//     flex: 1,
//     minWidth: 0,
//   },
//   kpiGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: spacing.md,
//   },
//   bookingHeading: {
//     flex: 1,
//     gap: spacing.xs,
//   },
// });

/* eslint-disable react/no-unescaped-entities */

import { useMemo, useState } from "react";
import { Alert, ScrollView, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import {
  Play,
  Users,
  IndianRupee,
  ClipboardList,
  Activity,
  CircleDot,
  ChevronRight,
} from "lucide-react-native";

import { RightPanel } from "../../components/layout";
import { ThemedButton, ThemedText } from "../../components/shared";

import ResourceCard, {
  type ResourceCardProps,
} from "../../components/dashboard/ResourceCard";

import KpiCard from "../../components/dashboard/KpiCard";

import TodaysBookingsTable, {
  type BookingRow,
} from "../../components/dashboard/TodaysBookingsTable";

import StartSessionModal from "../../components/bookings/StartSessionModal";

import type { BookingResource } from "../../components/bookings/types";
import type { Resource } from "../../types";

import { useResources } from "../../hooks";
import { useLiveActiveSessions } from "../../hooks/useLiveBookings";

import { useDatabase } from "../../database";
import { sessionService } from "../../services/session.service";

import { spacing } from "../../theme";

const resourceImages: Record<Resource["id"], ResourceCardProps["image"]> = {
  res_pool_01: require("../../../assets/resources/pool.avif"),
  res_mini_snooker_01: require("../../../assets/resources/snooker.avif"),
  res_big_snooker_01: require("../../../assets/resources/snooker.avif"),
  res_big_snooker_02: require("../../../assets/resources/snooker.avif"),
  res_ps5_01: require("../../../assets/resources/ps5-dualshocks.avif"),
};

const resourcePresentation: Record<
  Resource["id"],
  {
    status: ResourceCardProps["status"];
    startedAt?: string;
    elapsedMinutes?: number;
    variant: ResourceCardProps["variant"];
  }
> = {
  res_big_snooker_01: {
    status: "paused",
    startedAt: "05:10 PM",
    elapsedMinutes: 45,
    variant: "large",
  },
  res_big_snooker_02: {
    status: "available",
    variant: "large",
  },
  res_mini_snooker_01: {
    status: "available",
    variant: "compact",
  },
  res_pool_01: {
    status: "occupied",
    startedAt: "04:32 PM",
    elapsedMinutes: 84,
    variant: "compact",
  },
  res_ps5_01: {
    status: "available",
    variant: "compact",
  },
};

const kpis = [
  {
    title: "Today's Revenue",
    value: "₹2,450",
    description: "Total collection today",
    icon: IndianRupee,
  },
  {
    title: "Sessions",
    value: "12",
    description: "Sessions handled",
    icon: ClipboardList,
  },
  {
    title: "Active Sessions",
    value: "1",
    description: "Currently running",
    icon: Activity,
  },
];

const bookings: BookingRow[] = [
  {
    id: "QZ-001",
    resource: "American Pool",
    customer: "Rahul Sharma",
    startTime: "04:32 PM",
    endTime: "05:56 PM",
    amount: "₹350",
    status: "Active",
    variant: "active",
  },
  {
    id: "QZ-002",
    resource: "Big Snooker 01",
    customer: "Amit Patil",
    startTime: "05:10 PM",
    endTime: "--:--",
    amount: "₹263",
    status: "Paused",
    variant: "info",
  },
  {
    id: "QZ-003",
    resource: "Mini Snooker",
    customer: "Sneha Deshmukh",
    startTime: "03:15 PM",
    endTime: "05:15 PM",
    amount: "₹500",
    status: "Completed",
    variant: "success",
  },
  {
    id: "QZ-004",
    resource: "PS5 Console",
    customer: "Karan More",
    startTime: "02:40 PM",
    endTime: "04:40 PM",
    amount: "₹300",
    status: "Completed",
    variant: "success",
  },
];

export default function DashboardScreen() {
  const router = useRouter();

  const db = useDatabase();

  const { resources, loading, error } = useResources();

  const activeSessionsQuery = useLiveActiveSessions();
  const activeSessions = activeSessionsQuery.data ?? [];

  // Start session modal state
  const [startModalVisible, setStartModalVisible] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);

  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null,
  );

  // Resource IDs currently occupied by active or paused sessions.
  const occupiedResourceIds = useMemo(
    () => new Set(activeSessions.map((session) => session.resourceId)),
    [activeSessions],
  );

  // Convert existing Resource objects into the shared modal's type.
  const availableBookingResources = useMemo<BookingResource[]>(
    () =>
      resources
        .filter(
          (resource) =>
            resource.isActive &&
            !resource.isMaintenance &&
            !occupiedResourceIds.has(resource.id),
        )
        .map((resource) => ({
          id: resource.id,
          name: resource.name,
          type: resource.type,
          ratePerHour: resource.ratePerHour,
          isActive: resource.isActive,
          isMaintenance: resource.isMaintenance,
        })),
    [resources, occupiedResourceIds],
  );

  const availableResourceCount = availableBookingResources.length;

  // Open shared session modal.
  const openStartSession = () => {
    if (availableBookingResources.length === 0) {
      Alert.alert(
        "No resources available",
        "All resources are currently occupied or unavailable.",
      );
      return;
    }

    setSelectedResourceId(availableBookingResources[0].id);

    setCustomerName("");
    setCustomerPhone("");
    setNotes("");

    setStartModalVisible(true);
  };

  // Start session using the existing session service.
  const handleStartSession = async () => {
    if (!selectedResourceId) {
      Alert.alert("Select a resource", "Please choose an available resource.");
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
      setSelectedResource(null);
    } catch (err) {
      Alert.alert(
        "Could not start session",
        err instanceof Error ? err.message : "Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleResourcePress = (resource: Resource) => {
    setSelectedResource(resource);
  };

  // Dashboard resource cards.
  const resourceCards: ResourceCardProps[] = resources
    .filter((resource) => resource.isActive)
    .map((resource) => {
      const presentation = resourcePresentation[resource.id];

      return {
        id: resource.id,
        name: resource.name,
        image:
          resourceImages[resource.id] ??
          require("../../../assets/resources/snooker.avif"),
        ratePerHour: resource.ratePerHour,
        status: resource.isMaintenance
          ? "available"
          : (presentation?.status ?? "available"),
        startedAt: presentation?.startedAt,
        elapsedMinutes: presentation?.elapsedMinutes,
        variant: presentation?.variant ?? "compact",
      };
    });

  const largeResources = resourceCards.filter(
    (resource) => resource.variant === "large",
  );

  const compactResources = resourceCards.filter(
    (resource) => resource.variant === "compact",
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.workspace}
        contentContainerStyle={styles.workspaceContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.heading}>
            <ThemedText variant="heading1">Dashboard</ThemedText>

            <ThemedText variant="bodySmall" color="secondary">
              Overview of your club's activity and operations.
            </ThemedText>
          </View>

          <View style={styles.actions}>
            <ThemedButton
              title="Start Session"
              variant="primary"
              size="md"
              leftIcon={<Play size={16} />}
              onPress={openStartSession}
              disabled={loading || activeSessionsQuery.data === undefined}
            />

            <ThemedButton
              title="Add to Waitlist"
              variant="secondary"
              size="md"
              leftIcon={<Users size={16} />}
              onPress={() => router.push("/(main)/waitlist")}
            />
          </View>
        </View>

        {/* Today's Overview */}
        <View style={styles.section}>
          <ThemedText variant="heading2">Today's Overview</ThemedText>

          <View style={styles.kpiGrid}>
            {kpis.map((kpi) => {
              const Icon = kpi.icon;

              return (
                <KpiCard
                  key={kpi.title}
                  title={kpi.title}
                  value={kpi.value}
                  description={kpi.description}
                  icon={<Icon />}
                />
              );
            })}

            <KpiCard
              title="Available Resources"
              value={`${availableResourceCount} / ${resources.length}`}
              description="Ready for customers"
              icon={<CircleDot />}
            />
          </View>
        </View>

        {/* Resources */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText variant="heading2">Resources</ThemedText>

            <ThemedText variant="caption" color="secondary">
              {resources.length} resources
            </ThemedText>
          </View>

          {loading ? (
            <ThemedText color="secondary">Loading resources...</ThemedText>
          ) : error ? (
            <ThemedText color="sage">{error}</ThemedText>
          ) : (
            <View style={styles.resourceGrid}>
              <View style={styles.resourceRow}>
                {largeResources.map((resource) => (
                  <View key={resource.id} style={styles.resourceItem}>
                    <ResourceCard
                      {...resource}
                      onPress={() => {
                        const selected = resources.find(
                          (item) => item.id === resource.id,
                        );

                        if (selected) {
                          handleResourcePress(selected);
                        }
                      }}
                    />
                  </View>
                ))}
              </View>

              <View style={styles.resourceRow}>
                {compactResources.map((resource) => (
                  <View key={resource.id} style={styles.resourceItem}>
                    <ResourceCard
                      {...resource}
                      onPress={() => {
                        const selected = resources.find(
                          (item) => item.id === resource.id,
                        );

                        if (selected) {
                          handleResourcePress(selected);
                        }
                      }}
                    />
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Today's Bookings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.bookingHeading}>
              <ThemedText variant="heading2">Today's Bookings</ThemedText>

              <ThemedText variant="caption" color="secondary">
                Today's customer sessions and payments
              </ThemedText>
            </View>

            <ThemedButton
              rightIcon={<ChevronRight size={14} />}
              title="View All"
              variant="ghost"
              size="sm"
              onPress={() => router.push("/(main)/booking-history")}
            />
          </View>

          <TodaysBookingsTable bookings={bookings} />
        </View>
      </ScrollView>

      {/* Right Operations Panel */}
      <RightPanel
        width={290}
        selectedResource={
          selectedResource
            ? {
                id: selectedResource.id,
                name: selectedResource.name,
                ratePerHour: selectedResource.ratePerHour,
                status: "occupied",
              }
            : undefined
        }
      />

      {/* Shared Start Session Modal */}
      <StartSessionModal
        visible={startModalVisible}
        resources={availableBookingResources}
        selectedResourceId={selectedResourceId}
        customerName={customerName}
        customerPhone={customerPhone}
        notes={notes}
        saving={saving}
        onClose={() => {
          if (!saving) {
            setStartModalVisible(false);
          }
        }}
        onStart={() => void handleStartSession()}
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
    gap: spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  heading: {
    flex: 1,
    gap: spacing.xs,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  resourceGrid: {
    gap: spacing.sm,
  },
  resourceRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  resourceItem: {
    flex: 1,
    minWidth: 0,
  },
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  bookingHeading: {
    flex: 1,
    gap: spacing.xs,
  },
});
