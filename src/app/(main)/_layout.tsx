// import { Stack, usePathname, useRouter, type Href } from "expo-router";
// import { useState } from "react";
// import { StyleSheet, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// import { BottomStatusBar, Sidebar, TopHeader } from "../../components/layout";
// import { useTheme } from "../../theme/ThemeProvider";

// export default function MainLayout() {
//   const { colors, mode, toggleTheme } = useTheme();
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

//   const pathname = usePathname();
//   const router = useRouter();

//   const navigate = (route: string) => {
//     router.push(`/(main)${route}` as Href);
//   };

//   return (
//     <SafeAreaView
//       style={[styles.screen, { backgroundColor: colors.background }]}
//       edges={["top", "left", "right"]}
//     >
//       <View style={styles.container}>
//         <TopHeader
//           themeMode={mode}
//           onToggleTheme={toggleTheme}
//           onLogoPress={() => setSidebarCollapsed((value) => !value)}
//         />

//         <View style={styles.main}>
//           <Sidebar
//             activePath={pathname}
//             collapsed={sidebarCollapsed}
//             onNavigate={navigate}
//           />

//           <View style={styles.workspace}>
//             <Stack
//               screenOptions={{
//                 headerShown: false,
//                 contentStyle: {
//                   backgroundColor: colors.background,
//                 },
//                 animation: "fade",
//               }}
//             />
//           </View>
//         </View>
//       </View>

//       <View style={styles.bottomBar}>
//         <BottomStatusBar
//           totalResources={5}
//           occupied={0}
//           available={5}
//           waiting={0}
//         />
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     gap: 5,
//   },
//   main: {
//     flex: 1,
//     flexDirection: "row",
//     gap: 10,
//   },
//   workspace: {
//     flex: 1,
//     minWidth: 0,
//   },
//   bottomBar: {
//     paddingHorizontal: 10,
//     paddingBottom: 6,
//   },
// });

import { Stack, usePathname, useRouter, type Href } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";

import { BottomStatusBar, Sidebar, TopHeader } from "../../components/layout";
import { useTheme } from "../../theme/ThemeProvider";
import { darkColors, lightColors } from "../../theme/colors";

export default function MainLayout() {
  const { mode, progress, toggleTheme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const pathname = usePathname();
  const router = useRouter();

  const navigate = (route: string) => {
    router.push(`/(main)${route}` as Href);
  };

  const screenStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [darkColors.background, lightColors.background],
    ),
  }));

  return (
    <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
      <Animated.View style={[styles.screenBackground, screenStyle]} />

      <View style={styles.container}>
        <TopHeader
          themeMode={mode}
          onToggleTheme={toggleTheme}
          onLogoPress={() => setSidebarCollapsed((value) => !value)}
        />

        <View style={styles.main}>
          <Sidebar
            activePath={pathname}
            collapsed={sidebarCollapsed}
            onNavigate={navigate}
          />

          <View style={styles.workspace}>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: {
                  backgroundColor: "transparent",
                },
                animation: "fade",
              }}
            />
          </View>
        </View>
      </View>

      <View style={styles.bottomBar}>
        <BottomStatusBar
          totalResources={5}
          occupied={0}
          available={5}
          waiting={0}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "transparent",
  },
  screenBackground: {
    ...StyleSheet.absoluteFill,
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
  },
  main: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
  },
  workspace: {
    flex: 1,
    minWidth: 0,
  },
  bottomBar: {
    paddingHorizontal: 10,
    paddingBottom: 6,
  },
});
