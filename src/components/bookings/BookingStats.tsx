// import type React from "react";
// import { CircleDot, Pause, Play, Layers } from "lucide-react-native";
// import { StyleSheet, View } from "react-native";

// import { ThemedCard, ThemedText } from "../shared";
// import { spacing, useTheme } from "../../theme";

// type Props = {
//   available: number;
//   running: number;
//   paused: number;
//   total: number;
// };

// export default function BookingStats({
//   available,
//   running,
//   paused,
//   total,
// }: Props) {
//   return (
//     <View style={styles.grid}>
//       <StatCard
//         label="Available"
//         value={available}
//         description="Ready to use"
//         icon={<CircleDot size={19} />}
//         tone="success"
//       />

//       <StatCard
//         label="Running"
//         value={running}
//         description="Currently occupied"
//         icon={<Play size={19} />}
//         tone="warning"
//       />

//       <StatCard
//         label="Paused"
//         value={paused}
//         description="Temporarily on hold"
//         icon={<Pause size={19} />}
//         tone="info"
//       />

//       <StatCard
//         label="Total Resources"
//         value={total}
//         description="Club inventory"
//         icon={<Layers size={19} />}
//         tone="neutral"
//       />
//     </View>
//   );
// }

// function StatCard({
//   label,
//   value,
//   description,
//   icon,
//   tone,
// }: {
//   label: string;
//   value: number;
//   description: string;
//   icon: React.ReactNode;
//   tone: "success" | "warning" | "info" | "neutral";
// }) {
//   const { colors } = useTheme();

//   const toneColors = {
//     success: colors.accent,
//     warning: colors.accentSecondary,
//     info: colors.sage,
//     neutral: colors.gold,
//   };

//   const accent = toneColors[tone];

//   return (
//     <ThemedCard padding="md" style={styles.card}>
//       <View style={styles.top}>
//         <View style={styles.labelGroup}>
//           <ThemedText variant="label" color="secondary">
//             {label}
//           </ThemedText>

//           <ThemedText variant="caption" color="secondary">
//             {description}
//           </ThemedText>
//         </View>

//         <View style={[styles.icon, { backgroundColor: `${accent}18` }]}>
//           {icon}
//         </View>
//       </View>

//       <ThemedText variant="display">{value.toLocaleString("en-IN")}</ThemedText>

//       <View style={[styles.accentLine, { backgroundColor: accent }]} />
//     </ThemedCard>
//   );
// }

// const styles = StyleSheet.create({
//   grid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: spacing.md,
//   },
//   card: {
//     flex: 1,
//     minWidth: 145,
//     height: 120,
//     justifyContent: "space-between",
//     gap: spacing.xs,
//     overflow: "hidden",
//   },
//   top: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     gap: spacing.xs,
//   },
//   labelGroup: {
//     flex: 1,
//     gap: 2,
//   },
//   icon: {
//     width: 36,
//     height: 36,
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   accentLine: {
//     height: 3,
//     width: 32,
//     borderRadius: 10,
//     marginTop: spacing.xxs,
//   },
// });

import type React from "react";
import { CircleDot, Pause, Play, Layers } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { ThemedCard, ThemedText } from "../shared";
import AnimatedCounter from "../shared/AnimatedCounter";

import { spacing, useTheme } from "../../theme";

type Props = {
  available: number;
  running: number;
  paused: number;
  total: number;
  ready: boolean;
};

export default function BookingStats({
  available,
  running,
  paused,
  total,
  ready,
}: Props) {
  return (
    <View style={styles.grid}>
      <StatCard
        label="Available"
        value={available}
        description="Ready to use"
        icon={<CircleDot size={19} />}
        tone="success"
        ready={ready}
      />

      <StatCard
        label="Running"
        value={running}
        description="Currently occupied"
        icon={<Play size={19} />}
        tone="warning"
        ready={ready}
      />

      <StatCard
        label="Paused"
        value={paused}
        description="Temporarily on hold"
        icon={<Pause size={19} />}
        tone="info"
        ready={ready}
      />

      <StatCard
        label="Total Resources"
        value={total}
        description="Club inventory"
        icon={<Layers size={19} />}
        tone="neutral"
        ready={ready}
      />
    </View>
  );
}

function StatCard({
  label,
  value,
  description,
  icon,
  tone,
  ready,
}: {
  label: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  tone: "success" | "warning" | "info" | "neutral";
  ready: boolean;
}) {
  const { colors } = useTheme();

  const toneColors = {
    success: colors.accent,
    warning: colors.accentSecondary,
    info: colors.sage,
    neutral: colors.gold,
  };

  const accent = toneColors[tone];

  return (
    <ThemedCard padding="md" style={styles.card}>
      <View style={styles.top}>
        <View style={styles.labelGroup}>
          <ThemedText variant="label" color="secondary">
            {label}
          </ThemedText>

          <ThemedText variant="caption" color="secondary">
            {description}
          </ThemedText>
        </View>

        <View style={[styles.icon, { backgroundColor: `${accent}18` }]}>
          {icon}
        </View>
      </View>

      <AnimatedCounter value={value} ready={ready} variant="display" />

      <View style={[styles.accentLine, { backgroundColor: accent }]} />
    </ThemedCard>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  card: {
    flex: 1,
    minWidth: 145,
    height: 120,
    justifyContent: "space-between",
    gap: spacing.xs,
    overflow: "hidden",
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.xs,
  },
  labelGroup: {
    flex: 1,
    gap: 2,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  accentLine: {
    height: 3,
    width: 32,
    borderRadius: 10,
    marginTop: spacing.xxs,
  },
});
