import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  Clock,
  LayoutDashboard,
  Settings,
  Users,
  Utensils,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import Reanimated, {
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";

import { useTheme } from "../../theme/ThemeProvider";
import { darkColors, lightColors } from "../../theme/colors";
import type { SidebarProps } from "./layout.types";

const navigationItems = [
  { label: "Dashboard", route: "/dashboard", icon: LayoutDashboard },
  { label: "Bookings", route: "/bookings", icon: CalendarDays },
  { label: "Waitlist", route: "/waitlist", icon: ClipboardList },
  { label: "Analytics", route: "/analytics", icon: BarChart3 },
  { label: "History", route: "/booking-history", icon: Clock },
  { label: "Customers", route: "/customers", icon: Users },
  { label: "Eatery", route: "/food", icon: Utensils },
  { label: "Settings", route: "/settings", icon: Settings },
];

export default function Sidebar({
  activePath,
  collapsed,
  onNavigate,
}: SidebarProps) {
  const { progress } = useTheme();

  const [width] = useState(() => new Animated.Value(collapsed ? 68 : 170));

  const [collapseProgress] = useState(
    () => new Animated.Value(collapsed ? 1 : 0),
  );

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(width, {
        toValue: collapsed ? 68 : 170,
        duration: 320,
        useNativeDriver: false,
      }),
      Animated.timing(collapseProgress, {
        toValue: collapsed ? 1 : 0,
        duration: 280,
        useNativeDriver: true,
      }),
    ]);

    animation.start();
    return () => animation.stop();
  }, [collapsed, width, collapseProgress]);

  const sidebarStyle = useAnimatedStyle(() => ({
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

  const activeItemStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [darkColors.surfaceSecondary, lightColors.surfaceSecondary],
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

  const iconTranslate = collapseProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 4.5],
  });

  const labelTranslate = collapseProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const labelOpacity = collapseProgress.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [1, 0, 0],
  });

  return (
    <Animated.View style={[styles.widthContainer, { width }]}>
      <Reanimated.View style={[styles.sidebar, sidebarStyle]}>
        <View style={styles.navigation}>
          {navigationItems.map(({ label, route, icon: Icon }) => {
            const active =
              activePath === `/(main)${route}` || activePath === route;

            return (
              <Pressable
                key={route}
                accessibilityRole="button"
                accessibilityLabel={label}
                accessibilityState={{ selected: active }}
                onPress={() => onNavigate(route)}
                style={({ pressed }) => [
                  styles.navItem,
                  pressed && styles.pressed,
                ]}
              >
                {active && (
                  <Reanimated.View
                    pointerEvents="none"
                    style={[
                      StyleSheet.absoluteFill,
                      styles.activeBackground,
                      activeItemStyle,
                    ]}
                  />
                )}

            
                <Animated.View
                  style={[
                    styles.iconContainer,
                    {
                      transform: [{ translateX: iconTranslate }],
                    },
                  ]}
                >
                  <Icon
                    size={19}
                    strokeWidth={1.9}
                    color={active ? "#9DCAC0" : "#929999"}
                  />
                </Animated.View>

      
                <Animated.View
                  style={{
                    flex: 1,
                    opacity: labelOpacity,
                    transform: [{ translateX: labelTranslate }],
                  }}
                >
                  <Reanimated.Text
                    numberOfLines={1}
                    style={[
                      styles.navLabel,
                      active ? primaryTextStyle : secondaryTextStyle,
                    ]}
                  >
                    {label}
                  </Reanimated.Text>
                </Animated.View>
              </Pressable>
            );
          })}
        </View>
      </Reanimated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  widthContainer: {
    flexShrink: 0,
  },
  sidebar: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 10,
    overflow: "hidden",
  },
  navigation: {
    gap: 7,
  },
  navItem: {
    height: 43,
    width: "100%",
    borderRadius: 9,
    flexDirection: "row",
    paddingVertical: 6,
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    overflow: "hidden",
  },

  iconContainer: {
    width: 22,
    
    justifyContent: "center",
  },
  activeBackground: {
    borderRadius: 9,
  },
  navLabel: {
    flex: 1,
    fontFamily: "GoogleSans-Medium",
    fontSize: 13,
  },
  pressed: {
    opacity: 0.65,
    transform: [{ scale: 0.97 }],
  },
});
