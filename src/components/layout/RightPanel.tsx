/* eslint-disable react-hooks/set-state-in-effect */
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  ListChecks,
  ReceiptText,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import type { ComponentRef } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { ThemedCard, ThemedText } from "../shared";
import { darkColors, lightColors, spacing, useTheme } from "../../theme";

export type RightPanelSection = "waitlist" | "billing" | "alerts";

export interface SelectedResource {
  id: string;
  name: string;
  ratePerHour: number;
  elapsedMinutes?: number;
  amountDue?: number;
  status?: "occupied" | "paused";
}

interface RightPanelProps {
  selectedResource?: SelectedResource | null;
  width?: number;
  style?: StyleProp<ViewStyle>;
}

const sections = [
  { key: "waitlist", title: "Waitlist", icon: ListChecks },
  { key: "billing", title: "Billing", icon: ReceiptText },
  { key: "alerts", title: "Alerts", icon: Bell },
] as const;

export default function RightPanel({
  selectedResource,
  width = 330,
  style,
}: RightPanelProps) {
  const { mode } = useTheme();
  const colors = mode === "dark" ? darkColors : lightColors;

  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const [panelWidth, setPanelWidth] = useState(width);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!selectedResource) return;

    setActiveIndex(1);
    scrollRef.current?.scrollTo({
      x: panelWidth,
      animated: true,
    });
  }, [selectedResource, panelWidth]);

  const navigateTo = (index: number) => {
    const nextIndex = Math.max(0, Math.min(index, sections.length - 1));

    setActiveIndex(nextIndex);

    scrollRef.current?.scrollTo({
      x: panelWidth * nextIndex,
      animated: true,
    });
  };

  const handleSwipe = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / panelWidth);

    setActiveIndex(Math.max(0, Math.min(index, sections.length - 1)));
  };

  const activeSection = sections[activeIndex];
  const HeaderIcon = activeSection.icon;

  return (
    <View
      style={[styles.container, { width }, style]}
      onLayout={(event) => {
        const measuredWidth = event.nativeEvent.layout.width;
        if (measuredWidth > 0) setPanelWidth(measuredWidth);
      }}
    >
      <ThemedCard padding="md" radius="xl" shadow="none" style={styles.panel}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => navigateTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            hitSlop={8}
            style={styles.chevronButton}
          >
            <ChevronLeft
              size={19}
              color={
                activeIndex === 0 ? colors.text.muted : colors.text.primary
              }
            />
          </Pressable>

          <View style={styles.headerTitle}>
            <HeaderIcon size={19} strokeWidth={2} color={colors.accent} />

            <ThemedText variant="heading3">{activeSection.title}</ThemedText>
          </View>

          <Pressable
            onPress={() => navigateTo(activeIndex + 1)}
            disabled={activeIndex === sections.length - 1}
            hitSlop={8}
            style={styles.chevronButton}
          >
            <ChevronRight
              size={19}
              color={
                activeIndex === sections.length - 1
                  ? colors.text.muted
                  : colors.text.primary
              }
            />
          </Pressable>
        </View>

        <View style={[styles.divider, { backgroundColor: "#91919134" }]} />

        {/* Empty swipeable workspace */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleSwipe}
          scrollEventThrottle={16}
          decelerationRate="fast"
          style={styles.pager}
        >
          {sections.map((section) => (
            <View key={section.key} style={{ width: panelWidth, flex: 1 }} />
          ))}
        </ScrollView>
      </ThemedCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexShrink: 0,
    minHeight: 0,
  },
  panel: {
    flex: 1,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: darkColors.border,
  },
  header: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },
  headerTitle: {
    position: "absolute",
    left: 36,
    right: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  chevronButton: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    zIndex: 1,
  },
  divider: {
    height: 1,
    marginVertical: spacing.sm,
  },
  pager: {
    flex: 1,
  },
});
