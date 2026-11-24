// import { StyleSheet, Text, View } from "react-native";

// import { useTheme } from "../../theme/ThemeProvider";
// import type { BottomStatusBarProps } from "./layout.types";

// export default function BottomStatusBar({
//   totalResources,
//   occupied,
//   available,
//   waiting,
//   isOnline = false,
// }: BottomStatusBarProps) {
//   const { colors } = useTheme();

//   return (
//     <View
//       style={[
//         styles.container,
//         {
//           backgroundColor: colors.surface,
//           borderColor: colors.border,
//         },
//       ]}
//     >
//       <View style={styles.leftContent}>
//         <View style={styles.connection}>
//           <View
//             style={[
//               styles.statusDot,
//               {
//                 backgroundColor: isOnline
//                   ? colors.status.available
//                   : colors.text.muted,
//               },
//             ]}
//           />

//           <Text style={[styles.text, { color: colors.text.secondary }]}>
//             {isOnline ? "Online" : "Offline mode"}
//           </Text>
//         </View>

//         <View style={[styles.divider, { backgroundColor: colors.border }]} />

//         <Text style={[styles.text, { color: colors.text.secondary }]}>
//           {totalResources} Resources
//         </Text>

//         <Text style={[styles.text, { color: colors.text.secondary }]}>
//           {occupied} Occupied
//         </Text>

//         <Text style={[styles.text, { color: colors.text.secondary }]}>
//           {available} Available
//         </Text>
//       </View>

//       <Text style={[styles.text, { color: colors.text.secondary }]}>
//         {waiting} Waiting
//       </Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     minHeight: 43,
//     borderRadius: 11,
//     borderWidth: 1,
//     paddingHorizontal: 15,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     gap: 10,
//   },
//   leftContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 13,
//     flexWrap: "wrap",
//   },
//   connection: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 7,
//   },
//   statusDot: {
//     width: 7,
//     height: 7,
//     borderRadius: 4,
//   },
//   text: {
//     fontFamily: "GoogleSans-Medium",
//     fontSize: 11,
//   },
//   divider: {
//     height: 15,
//     width: 1,
//   },
// });

import { StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";

import { useTheme } from "../../theme/ThemeProvider";
import { darkColors, lightColors } from "../../theme/colors";
import type { BottomStatusBarProps } from "./layout.types";

export default function BottomStatusBar({
  totalResources,
  occupied,
  available,
  waiting,
  isOnline = false,
}: BottomStatusBarProps) {
  const { progress } = useTheme();

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [darkColors.surface, lightColors.surface],
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [darkColors.border, lightColors.border],
    ),
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      [darkColors.text.secondary, lightColors.text.secondary],
    ),
  }));

  const dividerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [darkColors.border, lightColors.border],
    ),
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View style={styles.leftContent}>
        <View style={styles.connection}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: isOnline
                  ? darkColors.status.available
                  : darkColors.text.muted,
              },
            ]}
          />
          <Animated.Text style={[styles.text, textStyle]}>
            {isOnline ? "Online" : "Offline mode"}
          </Animated.Text>
        </View>

        <Animated.View style={[styles.divider, dividerStyle]} />

        <Animated.Text style={[styles.text, textStyle]}>
          {totalResources} Resources
        </Animated.Text>

        <Animated.Text style={[styles.text, textStyle]}>
          {occupied} Occupied
        </Animated.Text>

        <Animated.Text style={[styles.text, textStyle]}>
          {available} Available
        </Animated.Text>
      </View>

      <Animated.Text style={[styles.text, textStyle]}>
        {waiting} Waiting
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 43,
    borderRadius: 11,
    borderWidth: 1,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    flexWrap: "wrap",
  },
  connection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  text: {
    fontFamily: "GoogleSans-Medium",
    fontSize: 11,
  },
  divider: {
    height: 15,
    width: 1,
  },
});
