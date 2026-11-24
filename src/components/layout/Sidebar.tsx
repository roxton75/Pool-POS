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

import { useTheme } from "../../theme/ThemeProvider";
import type { SidebarProps } from "./layout.types";

const navigationItems = [
  { label: "Dashboard", route: "/dashboard", icon: LayoutDashboard },
  { label: "Bookings", route: "/bookings", icon: CalendarDays },
  { label: "Waitlist", route: "/waitlist", icon: ClipboardList },
  { label: "History", route: "/booking-history", icon: Clock },
  { label: "Analytics", route: "/analytics", icon: BarChart3 },
  { label: "Customers", route: "/customers", icon: Users },
  { label: "Eatery ", route: "/food", icon: Utensils },
  { label: "Settings", route: "/settings", icon: Settings },
];

export default function Sidebar({
  activePath,
  collapsed,
  onNavigate,
}: SidebarProps) {
  const { colors } = useTheme();

  const [width] = useState(() => new Animated.Value(collapsed ? 68 : 170));

  const [progress] = useState(() => new Animated.Value(collapsed ? 1 : 0));

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(width, {
        toValue: collapsed ? 68 : 170,
        duration: 320,
        useNativeDriver: false,
      }),
      Animated.timing(progress, {
        toValue: collapsed ? 1 : 0,
        duration: 280,
        useNativeDriver: true,
      }),
    ]);

    animation.start();

    return () => animation.stop();
  }, [collapsed, width, progress]);

  const iconTranslate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 4.5],
  });

  const labelTranslate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const labelOpacity = progress.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [1, 0, 0],
  });

  return (
    <Animated.View
      style={[
        styles.sidebar,
        {
          width,
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
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
                active && { backgroundColor: colors.surfaceSecondary },
                pressed && styles.pressed,
              ]}
            >
              <Animated.View
                style={{
                  width: 22,
                  transform: [{ translateX: iconTranslate }],
                }}
              >
                <Icon
                  size={19}
                  strokeWidth={1.9}
                  color={active ? colors.accent : colors.text.secondary}
                />
              </Animated.View>

              <Animated.Text
                numberOfLines={1}
                style={[
                  styles.navLabel,
                  {
                    color: active ? colors.text.primary : colors.text.secondary,
                    opacity: labelOpacity,
                    transform: [{ translateX: labelTranslate }],
                  },
                ]}
              >
                {label}
              </Animated.Text>
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    flexShrink: 0,
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
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 11,
    overflow: "hidden",
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
