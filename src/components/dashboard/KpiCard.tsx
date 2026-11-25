// import type { ReactElement } from "react";
// import { cloneElement } from "react";
// import { StyleSheet, View } from "react-native";
// import Reanimated, {
//   interpolateColor,
//   useAnimatedStyle,
// } from "react-native-reanimated";

// import { ThemedCard, ThemedText } from "../shared";
// import { darkColors, lightColors, spacing, useTheme } from "../../theme";

// interface KpiCardProps {
//   title: string;
//   value: string;
//   description: string;
//   icon: ReactElement<{ color?: string; size?: number }>;
// }

// export default function KpiCard({
//   title,
//   value,
//   description,
//   icon,
// }: KpiCardProps) {
//   const { progress, colors } = useTheme();

//   const iconBoxAnimatedStyle = useAnimatedStyle(() => ({
//     backgroundColor: interpolateColor(
//       progress.value,
//       [0, 1],
//       [darkColors.surfaceSecondary, lightColors.surfaceSecondary],
//     ),
//   }));

//   const iconColor = colors.text.primary;

//   return (
//     <ThemedCard variant="default" padding="md" radius="lg" style={styles.card}>
//       <View style={styles.top}>
//         <ThemedText variant="bodySmall" color="secondary">
//           {title}
//         </ThemedText>

//         <Reanimated.View style={[styles.iconBox, iconBoxAnimatedStyle]}>
//           {cloneElement(icon, {
//             color: iconColor,
//             size: 19,
//           })}
//         </Reanimated.View>
//       </View>

//       <ThemedText variant="display">{value}</ThemedText>

//       <ThemedText variant="caption" color="muted">
//         {description}
//       </ThemedText>
//     </ThemedCard>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     flex: 1,
//     height: 120,
//     // minWidth: 145,
//   },
//   top: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     gap: spacing.sm,
//   },
//   iconBox: {
//     width: 34,
//     height: 34,
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

import type { ReactElement } from "react";
import { cloneElement } from "react";
import { StyleSheet, View } from "react-native";
import Reanimated, {
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";

import { ThemedCard, ThemedText } from "../shared";
import { darkColors, lightColors, spacing, useTheme } from "../../theme";

interface KpiCardProps {
  title: string;
  value: string;
  description: string;
  icon: ReactElement<{ color?: string; size?: number }>;
}

export default function KpiCard({
  title,
  value,
  description,
  icon,
}: KpiCardProps) {
  const { progress, mode } = useTheme();

  // Animated icon container background
  const iconBoxAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [darkColors.surfaceSecondary, lightColors.surfaceSecondary],
    ),
  }));

  // Theme-specific icon colors
  const iconColor = mode === "dark" ? darkColors.sage : lightColors.sage;

  return (
    <ThemedCard variant="default" padding="md" radius="lg" style={styles.card}>
      <View style={styles.top}>
        <ThemedText variant="bodySmall" color="secondary">
          {title}
        </ThemedText>

        <Reanimated.View style={[styles.iconBox, iconBoxAnimatedStyle]}>
          {cloneElement(icon, {
            color: iconColor,
            size: 19,
          })}
        </Reanimated.View>
      </View>

      <ThemedText variant="display">{value}</ThemedText>

      <ThemedText variant="caption" color="muted">
        {description}
      </ThemedText>
    </ThemedCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 120,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
