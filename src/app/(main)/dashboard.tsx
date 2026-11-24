/* eslint-disable react/no-unescaped-entities */

import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Activity, CircleDot, Gamepad2, Users } from "lucide-react-native";

import { RightPanel } from "../../components/layout";
import { ThemedBadge, ThemedCard, ThemedText } from "../../components/shared";
import { useTheme } from "../../theme/ThemeProvider";
import { spacing } from "../../theme";

type Resource = {
  id: string;
  name: string;
  category: string;
  ratePerHour: number;
  status: "available" | "occupied" | "paused";
  elapsedMinutes?: number;
  amountDue?: number;
};

const initialResources: Resource[] = [
  {
    id: "pool-01",
    name: "American Pool",
    category: "Pool Table",
    ratePerHour: 250,
    status: "occupied",
    elapsedMinutes: 78,
    amountDue: 275,
  },
  {
    id: "snooker-01",
    name: "Mini Snooker",
    category: "Snooker Table",
    ratePerHour: 250,
    status: "available",
  },
  {
    id: "snooker-02",
    name: "Big Snooker 01",
    category: "Snooker Table",
    ratePerHour: 350,
    status: "paused",
    elapsedMinutes: 45,
    amountDue: 263,
  },
  {
    id: "snooker-03",
    name: "Big Snooker 02",
    category: "Snooker Table",
    ratePerHour: 350,
    status: "available",
  },
  {
    id: "ps5-01",
    name: "PS5 Console 01",
    category: "Gaming Console",
    ratePerHour: 0,
    status: "available",
  },
];

export default function DashboardScreen() {
  const { colors } = useTheme();
  const [resources] = useState(initialResources);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null,
  );

  const occupied = resources.filter(
    (resource) => resource.status === "occupied",
  ).length;

  const paused = resources.filter(
    (resource) => resource.status === "paused",
  ).length;

  const available = resources.filter(
    (resource) => resource.status === "available",
  ).length;

  const handleResourcePress = (resource: Resource) => {
    if (resource.status === "available") return;
    setSelectedResource(resource);
  };

  const getBadgeVariant = (status: Resource["status"]) => {
    switch (status) {
      case "occupied":
        return "active" as const;
      case "paused":
        return "info" as const;
      default:
        return "success" as const;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.dashboard}
        contentContainerStyle={styles.dashboardContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Dashboard Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <ThemedText variant="heading1">Dashboard</ThemedText>
            <ThemedText color="secondary">
              Here's what's happening at Q-Zone today.
            </ThemedText>
          </View>
        </View>

        {/* Overview */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Resources"
            value={resources.length}
            icon={<CircleDot size={19} />}
            subtitle="All club resources"
          />
          <StatCard
            title="Occupied"
            value={occupied}
            icon={<Activity size={19} />}
            subtitle="Currently in use"
          />
          <StatCard
            title="Available"
            value={available}
            icon={<Users size={19} />}
            subtitle="Ready for customers"
          />
          <StatCard
            title="Paused"
            value={paused}
            icon={<Gamepad2 size={19} />}
            subtitle="Sessions on hold"
          />
        </View>

        {/* Resource Overview */}
        <View style={styles.sectionHeader}>
          <View>
            <ThemedText variant="heading2">Resources</ThemedText>
            <ThemedText color="secondary">
              Select an active resource to view its billing.
            </ThemedText>
          </View>

          <ThemedBadge
            variant="neutral"
            label={`${resources.length} Resources`}
          />
        </View>

        <View style={styles.resourceGrid}>
          {resources.map((resource) => (
            <Pressable
              key={resource.id}
              onPress={() => handleResourcePress(resource)}
              disabled={resource.status === "available"}
              style={({ pressed }) => [
                styles.resourcePressable,
                pressed && resource.status !== "available"
                  ? styles.pressed
                  : null,
              ]}
            >
              <ThemedCard
                variant="default"
                padding="lg"
                style={[
                  styles.resourceCard,
                  selectedResource?.id === resource.id
                    ? {
                        borderColor: colors.accent,
                        borderWidth: 1,
                      }
                    : null,
                ]}
              >
                <View style={styles.resourceTop}>
                  <View
                    style={[
                      styles.resourceIcon,
                      { backgroundColor: colors.surfaceSecondary },
                    ]}
                  >
                    {resource.category === "Gaming Console" ? (
                      <Gamepad2 size={21} color={colors.text.primary} />
                    ) : (
                      <CircleDot size={21} color={colors.text.primary} />
                    )}
                  </View>

                  <ThemedBadge
                    variant={getBadgeVariant(resource.status)}
                    label={resource.status}
                    size="sm"
                    dot
                  />
                </View>

                <View style={styles.resourceDetails}>
                  <ThemedText variant="subtitle">{resource.name}</ThemedText>
                  <ThemedText color="secondary" variant="caption">
                    {resource.category}
                  </ThemedText>
                </View>

                <View style={styles.resourceBottom}>
                  <View>
                    <ThemedText variant="heading3">
                      {resource.ratePerHour > 0
                        ? `₹${resource.ratePerHour}`
                        : "TBD"}
                    </ThemedText>
                    <ThemedText color="muted" variant="caption">
                      {resource.ratePerHour > 0
                        ? "per hour"
                        : "Rate not configured"}
                    </ThemedText>
                  </View>

                  {resource.elapsedMinutes !== undefined && (
                    <View style={styles.sessionInfo}>
                      <ThemedText variant="bodyMedium" color="primary">
                        {resource.elapsedMinutes} min
                      </ThemedText>
                      <ThemedText variant="caption" color="secondary">
                        Elapsed
                      </ThemedText>
                    </View>
                  )}
                </View>

                {resource.status !== "available" && (
                  <ThemedText color="accent" variant="caption">
                    View billing →
                  </ThemedText>
                )}
              </ThemedCard>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Dashboard-only Right Panel */}
      <RightPanel
        width={320}
        selectedResource={
          selectedResource
            ? {
                id: selectedResource.id,
                name: selectedResource.name,
                ratePerHour: selectedResource.ratePerHour,
                elapsedMinutes: selectedResource.elapsedMinutes,
                amountDue: selectedResource.amountDue,
                status: selectedResource.status as "occupied" | "paused",
              }
            : undefined
        }
      />
    </View>
  );
}

type StatCardProps = {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
};

function StatCard({ title, value, subtitle, icon }: StatCardProps) {
  const { colors } = useTheme();

  return (
    <ThemedCard variant="default" padding="lg" style={styles.statCard}>
      <View style={styles.statTop}>
        <ThemedText color="secondary" variant="bodySmall">
          {title}
        </ThemedText>
        <View
          style={[
            styles.statIcon,
            { backgroundColor: colors.surfaceSecondary },
          ]}
        >
          {icon}
        </View>
      </View>

      <ThemedText variant="heading1">{value}</ThemedText>

      <ThemedText color="muted" variant="caption">
        {subtitle}
      </ThemedText>
    </ThemedCard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    gap: spacing.md,
    minWidth: 0,
  },
  dashboard: {
    flex: 1,
    minWidth: 0,
  },
  dashboardContent: {
    padding: spacing.md,
    gap: spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    gap: spacing.xs,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: 145,
    gap: spacing.md,
  },
  statTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  resourceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  resourcePressable: {
    flex: 1,
    minWidth: 210,
    maxWidth: 320,
  },
  resourceCard: {
    gap: spacing.md,
    height: 190,
    justifyContent: "space-between",
  },
  resourceTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  resourceIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  resourceDetails: {
    gap: spacing.xs,
  },
  resourceBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sessionInfo: {
    alignItems: "flex-end",
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },
});



// DESIGN SYESTEM DEMO PAGE (NOT USED IN PRODUCTION)


// import { useState } from "react";
// import { ScrollView, StyleSheet, View } from "react-native";
// import { Check, Plus, Search, X } from "lucide-react-native";
// import Reanimated, {
//   interpolateColor,
//   useAnimatedStyle,
// } from "react-native-reanimated";

// import {
//   ThemedText,
//   ThemedCard,
//   ThemedButton,
//   ThemedInput,
//   ThemedBadge,
//   ThemedModal,
// } from "../../components/shared";

// import { darkColors, lightColors, spacing, useTheme } from "../../theme";

// export default function Dashboard() {
//   const { progress, colors } = useTheme();

//   const [inputValue, setInputValue] = useState("");
//   const [errorValue, setErrorValue] = useState("");
//   const [modalVisible, setModalVisible] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const screenStyle = useAnimatedStyle(() => ({
//     backgroundColor: interpolateColor(
//       progress.value,
//       [0, 1],
//       [darkColors.background, lightColors.background],
//     ),
//   }));

//   const handleLoadingDemo = () => {
//     setLoading(true);

//     setTimeout(() => {
//       setLoading(false);
//     }, 1500);
//   };

//   return (
//     <>
//       <Reanimated.View style={[styles.screen, screenStyle]}>
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.content}
//         >
//           {/* PAGE HEADER */}
//           <View style={styles.pageHeader}>
//             <View style={styles.headerText}>
//               <ThemedText variant="heading1">Design System</ThemedText>

//               <ThemedText color="secondary">
//                 Q-Zone shared component playground
//               </ThemedText>
//             </View>

//             <ThemedBadge label="6 Components" variant="success" />
//           </View>

//           {/* 01. TYPOGRAPHY */}
//           <View style={styles.section}>
//             <SectionHeader
//               number="01"
//               title="Typography"
//               description="ThemedText variants and semantic colors"
//             />

//             <ThemedCard padding="lg" shadow="sm">
//               <ThemedText variant="display">Display Heading</ThemedText>

//               <ThemedText variant="heading1">Heading One</ThemedText>

//               <ThemedText variant="heading2">Heading Two</ThemedText>

//               <ThemedText variant="heading3">Heading Three</ThemedText>

//               <ThemedText variant="subtitle">Subtitle Text</ThemedText>

//               <ThemedText variant="body">
//                 Regular body text for descriptions and information.
//               </ThemedText>

//               <ThemedText variant="bodyMedium">Medium body text</ThemedText>

//               <ThemedText variant="bodySmall">Small body text</ThemedText>

//               <ThemedText variant="label">Label Text</ThemedText>

//               <ThemedText variant="caption">Caption text</ThemedText>

//               <ThemedText variant="overline">OVERLINE TEXT</ThemedText>

//               <View style={styles.divider} />

//               <ThemedText color="primary">Primary color</ThemedText>

//               <ThemedText color="secondary">Secondary color</ThemedText>

//               <ThemedText color="muted">Muted color</ThemedText>

//               <ThemedText color="accent">Accent color</ThemedText>

//               <ThemedText color="accentSecondary">Accent secondary</ThemedText>

//               <ThemedText color="sage">Sage color</ThemedText>
//             </ThemedCard>
//           </View>

//           {/* 02. CARDS */}
//           <View style={styles.section}>
//             <SectionHeader
//               number="02"
//               title="Cards"
//               description="Surface variants, radius and shadows"
//             />

//             <View style={styles.cardGrid}>
//               <ThemedCard padding="lg" shadow="sm" style={styles.gridCard}>
//                 <ThemedText color="secondary" variant="label">
//                   DEFAULT CARD
//                 </ThemedText>

//                 <ThemedText variant="heading2">₹4,250</ThemedText>

//                 <ThemedText color="secondary" variant="caption">
//                   Today's revenue
//                 </ThemedText>
//               </ThemedCard>

//               <ThemedCard
//                 variant="secondary"
//                 padding="lg"
//                 style={styles.gridCard}
//               >
//                 <ThemedText color="secondary" variant="label">
//                   SECONDARY CARD
//                 </ThemedText>

//                 <ThemedText variant="heading2">04 / 05</ThemedText>

//                 <ThemedText color="secondary" variant="caption">
//                   Available tables
//                 </ThemedText>
//               </ThemedCard>
//             </View>

//             <ThemedCard variant="outlined" padding="xl" radius="2xl">
//               <ThemedText variant="heading3">Outlined Card</ThemedText>

//               <ThemedText color="secondary">
//                 Transparent surface with a theme-aware border.
//               </ThemedText>
//             </ThemedCard>

//             <ThemedCard padding="xl" radius="2xl" shadow="lg">
//               <ThemedText variant="heading3">Elevated Card</ThemedText>

//               <ThemedText color="secondary">
//                 Demonstrating the large elevation preset.
//               </ThemedText>
//             </ThemedCard>
//           </View>

//           {/* 03. BUTTONS */}
//           <View style={styles.section}>
//             <SectionHeader
//               number="03"
//               title="Buttons"
//               description="Variants, sizes and interaction states"
//             />

//             <ThemedCard padding="lg">
//               <View style={styles.buttonGroup}>
//                 <ThemedButton
//                   title="Primary Button"
//                   leftIcon={<Plus size={17} color={darkColors.background} />}
//                   onPress={() => setModalVisible(true)}
//                   fullWidth
//                 />

//                 <ThemedButton
//                   title="Secondary Button"
//                   variant="secondary"
//                   fullWidth
//                 />

//                 <ThemedButton
//                   title="Outline Button"
//                   variant="outline"
//                   fullWidth
//                 />

//                 <ThemedButton title="Ghost Button" variant="ghost" fullWidth />

//                 <ThemedButton
//                   title="Danger Button"
//                   variant="danger"
//                   leftIcon={<X size={17} color={lightColors.background} />}
//                   fullWidth
//                 />
//               </View>

//               <View style={styles.divider} />

//               <ThemedText variant="label">Button Sizes</ThemedText>

//               <View style={styles.row}>
//                 <ThemedButton title="Small" size="sm" />

//                 <ThemedButton title="Medium" size="md" />

//                 <ThemedButton title="Large" size="lg" />
//               </View>

//               <View style={styles.divider} />

//               <ThemedText variant="label">Button States</ThemedText>

//               <View style={styles.row}>
//                 <ThemedButton title="Disabled" disabled />

//                 <ThemedButton
//                   title="Loading"
//                   loading={loading}
//                   onPress={handleLoadingDemo}
//                 />
//               </View>
//             </ThemedCard>
//           </View>

//           {/* 04. INPUTS */}
//           <View style={styles.section}>
//             <SectionHeader
//               number="04"
//               title="Inputs"
//               description="Labels, helper text, validation and icons"
//             />

//             <ThemedCard padding="lg">
//               <ThemedInput
//                 label="Customer Name"
//                 placeholder="Enter customer name"
//                 value={inputValue}
//                 onChangeText={setInputValue}
//                 leftElement={<Search size={17} color={colors.text.muted} />}
//               />

//               <ThemedInput
//                 label="Phone Number"
//                 placeholder="Enter phone number"
//                 keyboardType="phone-pad"
//                 helperText="Enter a 10-digit mobile number"
//               />

//               <ThemedInput
//                 label="Session Duration"
//                 placeholder="e.g. 60 minutes"
//                 defaultValue="60 minutes"
//               />

//               <ThemedInput
//                 label="Validation Example"
//                 placeholder="Enter a valid value"
//                 value={errorValue}
//                 onChangeText={setErrorValue}
//                 error="This field is required"
//               />

//               <ThemedInput
//                 label="Password"
//                 placeholder="Enter password"
//                 secureTextEntry
//               />
//             </ThemedCard>
//           </View>

//           {/* 05. BADGES */}
//           <View style={styles.section}>
//             <SectionHeader
//               number="05"
//               title="Badges"
//               description="Status indicators and category labels"
//             />

//             <ThemedCard padding="lg">
//               <ThemedText variant="label">Status Variants</ThemedText>

//               <View style={styles.badgeGroup}>
//                 <ThemedBadge label="Available" variant="success" />

//                 <ThemedBadge label="Occupied" variant="warning" />

//                 <ThemedBadge label="Cancelled" variant="error" />

//                 <ThemedBadge label="Paused" variant="info" />

//                 <ThemedBadge label="Pending" variant="neutral" />

//                 <ThemedBadge label="Active" variant="active"  />
//               </View>

//               <View style={styles.divider} />

//               <ThemedText variant="label">Badge Sizes</ThemedText>

//               <View style={styles.row}>
//                 <ThemedBadge label="Small Badge" variant="success" size="sm" />

//                 <ThemedBadge label="Medium Badge" variant="success" size="md" />
//               </View>
//             </ThemedCard>
//           </View>

//           {/* 06. MODALS */}
//           <View style={styles.section}>
//             <SectionHeader
//               number="06"
//               title="Modals"
//               description="Dialogs, confirmation and action layouts"
//             />

//             <ThemedCard padding="lg">
//               <ThemedText variant="heading3">Confirmation Dialog</ThemedText>

//               <ThemedText color="secondary">
//                 Open the modal to preview its layout and theme behavior.
//               </ThemedText>

//               <ThemedButton
//                 title="Open Modal"
//                 onPress={() => setModalVisible(true)}
//                 leftIcon={<Plus size={17} color={darkColors.background} />}
//                 fullWidth
//               />
//             </ThemedCard>
//           </View>

//           {/* FOOTER */}
//           <View style={styles.footer}>
//             <ThemedText variant="caption" color="muted">
//               Q-ZONE DESIGN SYSTEM
//             </ThemedText>

//             <ThemedText variant="caption" color="secondary">
//               Shared Components · Version 1.0
//             </ThemedText>
//           </View>
//         </ScrollView>
//       </Reanimated.View>

//       {/* MODAL PREVIEW */}
//       <ThemedModal
//         visible={modalVisible}
//         onClose={() => setModalVisible(false)}
//         title="Start New Session?"
//         description="Confirm the session details before proceeding."
//         footer={
//           <>
//             <ThemedButton
//               title="Cancel"
//               variant="outline"
//               onPress={() => setModalVisible(false)}
//             />

//             <ThemedButton
//               title="Confirm"
//               leftIcon={<Check size={16} color={darkColors.background} />}
//               onPress={() => setModalVisible(false)}
//             />
//           </>
//         }
//       >
//         <View style={styles.modalContent}>
//           <ThemedText color="secondary">Resource</ThemedText>

//           <ThemedText variant="heading3">American Pool 01</ThemedText>

//           <ThemedText color="secondary">Rate: ₹250 / hour</ThemedText>

//           <ThemedBadge label="Available" variant="success" dot />
//         </View>
//       </ThemedModal>
//     </>
//   );
// }

// function SectionHeader({
//   number,
//   title,
//   description,
// }: {
//   number: string;
//   title: string;
//   description: string;
// }) {
//   return (
//     <View style={styles.sectionHeader}>
//       <View style={styles.sectionTitleRow}>
//         <ThemedText variant="caption" color="accent">
//           {number}
//         </ThemedText>

//         <ThemedText variant="heading2">{title}</ThemedText>
//       </View>

//       <ThemedText variant="bodySmall" color="secondary">
//         {description}
//       </ThemedText>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//   },
//   content: {
//     padding: spacing["2xl"],
//     paddingBottom: spacing["5xl"],
//     gap: spacing["3xl"],
//   },
//   pageHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     flexWrap: "wrap",
//     gap: spacing.lg,
//   },
//   headerText: {
//     gap: spacing.xs,
//   },
//   section: {
//     gap: spacing.lg,
//   },
//   sectionHeader: {
//     gap: spacing.xs,
//   },
//   sectionTitleRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: spacing.md,
//   },
//   cardGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: spacing.md,
//   },
//   gridCard: {
//     flexGrow: 1,
//     flexBasis: 200,
//   },
//   buttonGroup: {
//     gap: spacing.md,
//   },
//   row: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     alignItems: "center",
//     gap: spacing.sm,
//   },
//   badgeGroup: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     alignItems: "center",
//     gap: spacing.sm,
//   },
//   divider: {
//     height: 1,
//     backgroundColor: "#77777733",
//     marginVertical: spacing.md,
//   },
//   modalContent: {
//     gap: spacing.md,
//   },
//   footer: {
//     alignItems: "center",
//     gap: spacing.xs,
//     paddingVertical: spacing.lg,
//   },
// });
