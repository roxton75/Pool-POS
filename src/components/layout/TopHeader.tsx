// import { Bell, Moon, Sun } from "lucide-react-native";
// import { Image, Pressable, StyleSheet, Text, View } from "react-native";

// import { useTheme } from "../../theme/ThemeProvider";
// import type { TopHeaderProps } from "./layout.types";

// export default function TopHeader({
//   themeMode,
//   onToggleTheme,
//   onLogoPress,
// }: TopHeaderProps) {
//   const { colors } = useTheme();

//   const date = new Date().toLocaleDateString("en-IN", {
//     weekday: "long",
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   });

//   return (
//     <View
//       style={[
//         styles.header,
//         {
//           backgroundColor: colors.surface,
//           borderColor: colors.border,
//         },
//       ]}
//     >
//       <Pressable
//         accessibilityRole="button"
//         accessibilityLabel="Toggle sidebar"
//         onPress={onLogoPress}
//         style={({ pressed }) => [
//           styles.brandContainer,
//           pressed && styles.logoPressed,
//         ]}
//       >
//         {/* <View
//           style={[styles.logoPlaceholder, { backgroundColor: colors.accent }]}
//         >
//           <Text style={styles.logoText}>Q</Text>
//         </View> */}
//         <View style={styles.logoPlaceholder}>
//           <Image
//             source={require("../../../assets/logos/enhanced.avif")}
//             style={styles.logoImage}
//             resizeMode="cover"
//           />
//         </View>

//         <View style={styles.brandText}>
//           <Text style={[styles.brand, { color: colors.text.primary }]}>
//             Q-Zone
//           </Text>
//           <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
//             Pool POS Manager
//           </Text>
//         </View>
//       </Pressable>

//       <View style={styles.actions}>
//         <Text style={[styles.date, { color: colors.text.secondary }]}>
//           {date}
//         </Text>

//         <Pressable
//           accessibilityRole="button"
//           accessibilityLabel="Toggle theme"
//           onPress={onToggleTheme}
//           style={({ pressed }) => [
//             styles.iconButton,
//             { backgroundColor: colors.surfaceSecondary },
//             pressed && styles.pressed,
//           ]}
//         >
//           {themeMode === "dark" ? (
//             <Sun size={18} color={colors.text.primary} />
//           ) : (
//             <Moon size={18} color={colors.text.primary} />
//           )}
//         </Pressable>

//         <Pressable
//           accessibilityRole="button"
//           accessibilityLabel="Notifications"
//           style={({ pressed }) => [
//             styles.iconButton,
//             { backgroundColor: colors.surfaceSecondary },
//             pressed && styles.pressed,
//           ]}
//         >
//           <Bell size={18} color={colors.text.primary} />
//         </Pressable>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     height: 64,
//     borderRadius: 12,
//     borderWidth: 1,
//     paddingHorizontal: 10,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   brandContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     padding: 0,
//   },
//   logoPlaceholder: {
//     width: 42,
//     height: 42,
//     borderRadius: 8,
//     backgroundColor: "#E7E7E7",
//     alignItems: "center",
//     padding: 5,
//     justifyContent: "center",
//   },
//   logoText: {
//     fontFamily: "GoogleSans-Bold",
//     fontSize: 20,
//     color: "#111315",
//   },
//   brandText: {
//     justifyContent: "center",
//     gap: 0,
//   },
//   brand: {
//     fontFamily: "GoogleSans-Bold",
//     fontSize: 18,
//     lineHeight: 24,
//     letterSpacing: -0.5,
//   },
//   subtitle: {
//     fontFamily: "GoogleSans-Regular",
//     fontSize: 10,
//     lineHeight: 14,
//   },
//   actions: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 9,
//   },
//   date: {
//     fontFamily: "GoogleSans-Regular",
//     fontSize: 13,
//     marginRight: 4,
//   },
//   iconButton: {
//     width: 38,
//     height: 38,
//     borderRadius: 8,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   logoImage: {
//     width: "160%",
//     height: "160%",
//     borderRadius: 10,
//   },
//   logoPressed: {
//     opacity: 0.75,
//     transform: [{ scale: 0.97 }],
//   },
//   pressed: {
//     opacity: 0.65,
//     transform: [{ scale: 0.95 }],
//   },
// });

import { Bell, Moon, Sun } from "lucide-react-native";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";

import { useTheme } from "../../theme/ThemeProvider";
import { darkColors, lightColors } from "../../theme/colors";
import type { TopHeaderProps } from "./layout.types";

export default function TopHeader({
  themeMode,
  onToggleTheme,
  onLogoPress,
}: TopHeaderProps) {
  const { progress } = useTheme();

  const headerStyle = useAnimatedStyle(() => ({
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

  const primaryTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      [darkColors.text.primary, lightColors.text.primary],
    ),
  }));

  const secondaryTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      [darkColors.text.secondary, lightColors.text.secondary],
    ),
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [darkColors.surfaceSecondary, lightColors.surfaceSecondary],
    ),
  }));

  const logoBackgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["#E7E7E7", "#E7E7E7"],
    ),
  }));

  const date = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Animated.View style={[styles.header, headerStyle]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Toggle sidebar"
        onPress={onLogoPress}
        style={({ pressed }) => [
          styles.brandContainer,
          pressed && styles.logoPressed,
        ]}
      >
        <Animated.View style={[styles.logoPlaceholder, logoBackgroundStyle]}>
          <Image
            source={require("../../../assets/logos/enhanced.avif")}
            style={styles.logoImage}
            resizeMode="cover"
          />
        </Animated.View>

        <View style={styles.brandText}>
          <Animated.Text style={[styles.brand, primaryTextStyle]}>
            Q-Zone
          </Animated.Text>
          <Animated.Text style={[styles.subtitle, secondaryTextStyle]}>
            Pool POS Manager
          </Animated.Text>
        </View>
      </Pressable>

      <View style={styles.actions}>
        <Animated.Text style={[styles.date, secondaryTextStyle]}>
          {date}
        </Animated.Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Toggle theme"
          onPress={onToggleTheme}
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.pressed,
          ]}
        >
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              buttonStyle,
              styles.buttonBackground,
            ]}
          />
          {themeMode === "dark" ? (
            <Sun size={18} color={darkColors.text.primary} />
          ) : (
            <Moon size={18} color={lightColors.text.primary} />
          )}
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.pressed,
          ]}
        >
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              buttonStyle,
              styles.buttonBackground,
            ]}
          />
          <Bell
            size={18}
            color={
              themeMode === "dark"
                ? darkColors.text.primary
                : lightColors.text.primary
            }
          />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 64,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoPlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: "center",
    padding: 5,
    justifyContent: "center",
    overflow: "hidden",
  },
  brandText: {
    justifyContent: "center",
    gap: 0,
  },
  brand: {
    fontFamily: "GoogleSans-Bold",
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: "GoogleSans-Regular",
    fontSize: 10,
    lineHeight: 14,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  date: {
    fontFamily: "GoogleSans-Regular",
    fontSize: 13,
    marginRight: 4,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  buttonBackground: {
    borderRadius: 8,
  },
  logoImage: {
    width: "160%",
    height: "160%",
    borderRadius: 10,
  },
  logoPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  pressed: {
    opacity: 0.65,
    transform: [{ scale: 0.95 }],
  },
});
