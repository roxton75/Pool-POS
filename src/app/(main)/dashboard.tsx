// /* eslint-disable react/no-unescaped-entities */
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

// import { spacing } from "../../theme";
// import { size } from "@expo/ui/jetpack-compose/modifiers";

// const resources: ResourceCardProps[] = [
//   {
//     name: "Big Snooker 01",
//     image: require("../../../assets/resources/snooker.avif"),
//     ratePerHour: 350,
//     status: "paused",
//     startedAt: "05:10 PM",
//     elapsedMinutes: 45,
//     variant: "large",
//   },
//   {
//     name: "Big Snooker 02",
//     image: require("../../../assets/resources/snooker.avif"),
//     ratePerHour: 350,
//     status: "available",
//     variant: "large",
//   },
//   {
//     name: "American Pool",
//     image: require("../../../assets/resources/pool.avif"),
//     ratePerHour: 250,
//     status: "occupied",
//     startedAt: "04:32 PM",
//     elapsedMinutes: 84,
//     variant: "compact",
//   },
//   {
//     name: "Mini Snooker",
//     image: require("../../../assets/resources/snooker.avif"),
//     ratePerHour: 250,
//     status: "available",
//     variant: "compact",
//   },
//   {
//     name: "PS5 Console",
//     image: require("../../../assets/resources/ps5-dualshocks.avif"),
//     ratePerHour: 150,
//     status: "available",
//     variant: "compact",
//   },
// ];

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
//   {
//     title: "Available Resources",
//     value: "3 / 5",
//     description: "Ready for customers",
//     icon: CircleDot,
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

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         style={styles.workspace}
//         contentContainerStyle={styles.workspaceContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Dashboard Header */}
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

//         {/* KPIs */}
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
//           </View>
//         </View>

//         {/* Resources */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <ThemedText variant="heading2">Resources</ThemedText>

//             <ThemedText variant="caption" color="secondary">
//               {resources.length} resources
//             </ThemedText>
//           </View>

//           <View style={styles.resourceGrid}>
//             <View style={styles.resourceRow}>
//               {resources.slice(0, 2).map((resource) => (
//                 <View key={resource.name} style={styles.resourceItem}>
//                   <ResourceCard {...resource} variant="large" />
//                 </View>
//               ))}
//             </View>

//             <View style={styles.resourceRow}>
//               {resources.slice(2, 5).map((resource) => (
//                 <View key={resource.name} style={styles.resourceItem}>
//                   <ResourceCard {...resource} variant="compact" />
//                 </View>
//               ))}
//             </View>
//           </View>
//         </View>

//         {/* Today's Bookings */}
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

//       {/* Fixed Right Panel */}
//       <RightPanel width={290} />
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

import { useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
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

import { useResources } from "../../hooks";
import type { Resource } from "../../types";
import { spacing } from "../../theme";

const resourceImages: Record<Resource["id"], ResourceCardProps["image"]> = {
  resource_pool_01: require("../../../assets/resources/pool.avif"),
  resource_mini_snooker_01: require("../../../assets/resources/snooker.avif"),
  resource_big_snooker_01: require("../../../assets/resources/snooker.avif"),
  resource_big_snooker_02: require("../../../assets/resources/snooker.avif"),
  resource_ps5_01: require("../../../assets/resources/ps5-dualshocks.avif"),
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
  resource_pool_01: {
    status: "occupied",
    startedAt: "04:32 PM",
    elapsedMinutes: 84,
    variant: "compact",
  },
  resource_mini_snooker_01: {
    status: "available",
    variant: "compact",
  },
  resource_big_snooker_01: {
    status: "paused",
    startedAt: "05:10 PM",
    elapsedMinutes: 45,
    variant: "large",
  },
  resource_big_snooker_02: {
    status: "available",
    variant: "large",
  },
  resource_ps5_01: {
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
  const { resources, loading, error } = useResources();

  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null,
  );

  const availableResources = resources.filter(
    (resource) =>
      resource.isActive &&
      !resource.isMaintenance &&
      resourcePresentation[resource.id]?.status === "available",
  ).length;

  const handleResourcePress = (resource: Resource) => {
    setSelectedResource(resource);
  };

  const resourceCards: ResourceCardProps[] = resources
    .filter((resource) => resource.isActive)
    .map((resource) => {
      const presentation = resourcePresentation[resource.id];

      return {
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
              onPress={() => router.push("/(main)/bookings")}
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
              value={`${availableResources} / ${resources.length}`}
              description="Ready for customers"
              icon={<CircleDot />}
            />
          </View>
        </View>

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
                  <View key={resource.name} style={styles.resourceItem}>
                    <ResourceCard
                      {...resource}
                      onPress={() => {
                        const selected = resources.find(
                          (item) => item.name === resource.name,
                        );

                        if (selected) handleResourcePress(selected);
                      }}
                    />
                  </View>
                ))}
              </View>

              <View style={styles.resourceRow}>
                {compactResources.map((resource) => (
                  <View key={resource.name} style={styles.resourceItem}>
                    <ResourceCard
                      {...resource}
                      onPress={() => {
                        const selected = resources.find(
                          (item) => item.name === resource.name,
                        );

                        if (selected) handleResourcePress(selected);
                      }}
                    />
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

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
