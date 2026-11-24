import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ListChecks,
  ReceiptText,
  Users,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import type { ElementRef } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { ThemedBadge, ThemedButton, ThemedCard, ThemedText } from "../shared";

import { spacing, useTheme } from "../../theme";

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
  const { colors } = useTheme();

  const scrollRef = useRef<ElementRef<typeof ScrollView>>(null);
  const [panelWidth, setPanelWidth] = useState(width);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!selectedResource) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveIndex(1);
    scrollRef.current?.scrollTo({
      x: panelWidth,
      animated: true,
    });
  }, [selectedResource, panelWidth]);

  const handleSwipe = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / panelWidth);

    setActiveIndex(Math.max(0, Math.min(index, sections.length - 1)));
  };

  const navigateTo = (index: number) => {
    const nextIndex = Math.max(0, Math.min(index, sections.length - 1));

    setActiveIndex(nextIndex);
    scrollRef.current?.scrollTo({
      x: panelWidth * nextIndex,
      animated: true,
    });
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
      <ThemedCard padding="md" radius="2xl" shadow="sm" style={styles.panel}>
        {/* PANEL HEADER */}
        <View style={styles.header}>
          <View style={styles.headerTitle}>
            <HeaderIcon size={19} strokeWidth={2} color={colors.accent} />
            <ThemedText variant="heading3">{activeSection.title}</ThemedText>
          </View>

          <View style={styles.headerControls}>
            <ThemedButton
              title=""
              size="sm"
              variant="ghost"
              leftIcon={<ChevronLeft size={17} color={colors.text.secondary} />}
              disabled={activeIndex === 0}
              onPress={() => navigateTo(activeIndex - 1)}
            />

            <ThemedButton
              title=""
              size="sm"
              variant="ghost"
              leftIcon={
                <ChevronRight size={17} color={colors.text.secondary} />
              }
              disabled={activeIndex === sections.length - 1}
              onPress={() => navigateTo(activeIndex + 1)}
            />
          </View>
        </View>

        <View
          style={[styles.headerDivider, { backgroundColor: colors.border }]}
        />

        {/* SWIPEABLE WORKSPACES */}
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
          <View style={{ width: panelWidth }}>
            <WaitlistWorkspace />
          </View>

          <View style={{ width: panelWidth }}>
            <BillingWorkspace resource={selectedResource} />
          </View>

          <View style={{ width: panelWidth }}>
            <AlertsWorkspace />
          </View>
        </ScrollView>

        {/* PAGE INDICATOR */}
        <View style={styles.pagination}>
          {sections.map((section, index) => (
            <ThemedButton
              key={section.key}
              title=""
              size="sm"
              variant="ghost"
              onPress={() => navigateTo(index)}
              style={[
                styles.paginationDot,
                {
                  backgroundColor:
                    activeIndex === index
                      ? colors.accent
                      : colors.surfaceSecondary,
                },
              ]}
            />
          ))}
        </View>
      </ThemedCard>
    </View>
  );
}

function WaitlistWorkspace() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.workspace}
    >
      <View style={styles.summaryRow}>
        <ThemedText variant="label" color="secondary">
          WAITING CUSTOMERS
        </ThemedText>
        <ThemedBadge label="0 Waiting" variant="neutral" />
      </View>

      <ThemedCard variant="secondary" padding="xl">
        <View style={styles.emptyState}>
          <Users size={30} color="#929999" />
          <ThemedText variant="heading3">No one in the queue</ThemedText>
          <ThemedText color="secondary" variant="bodySmall">
            Customers added to the waitlist will appear here.
          </ThemedText>
        </View>
      </ThemedCard>
    </ScrollView>
  );
}

function BillingWorkspace({
  resource,
}: {
  resource?: SelectedResource | null;
}) {
  if (!resource) {
    return (
      <View style={styles.emptyState}>
        <ReceiptText size={30} color="#929999" />
        <ThemedText variant="heading3">No resource selected</ThemedText>
        <ThemedText color="secondary" variant="bodySmall">
          Select a table card on the Dashboard to view its billing details.
        </ThemedText>
      </View>
    );
  }

  const elapsed = resource.elapsedMinutes ?? 0;
  const hours = Math.floor(elapsed / 60);
  const minutes = elapsed % 60;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.workspace}
    >
      <View style={styles.summaryRow}>
        <ThemedText variant="label" color="secondary">
          CURRENT SESSION
        </ThemedText>

        <ThemedBadge
          label={resource.status === "paused" ? "Paused" : "Occupied"}
          variant={resource.status === "paused" ? "info" : "warning"}
        />
      </View>

      <ThemedCard padding="lg">
        <ThemedText color="secondary" variant="caption">
          RESOURCE
        </ThemedText>

        <ThemedText variant="heading2">{resource.name}</ThemedText>

        <View style={styles.detailRow}>
          <ThemedText color="secondary">Hourly rate</ThemedText>
          <ThemedText variant="bodyMedium">₹{resource.ratePerHour}</ThemedText>
        </View>

        <View style={styles.detailRow}>
          <ThemedText color="secondary">Elapsed time</ThemedText>
          <View style={styles.inline}>
            <Clock3 size={14} color="#929999" />
            <ThemedText variant="bodyMedium">
              {hours}h {minutes}m
            </ThemedText>
          </View>
        </View>
      </ThemedCard>

      <ThemedCard variant="secondary" padding="lg">
        <ThemedText color="secondary" variant="label">
          CURRENT BILL
        </ThemedText>

        <ThemedText variant="display">₹{resource.amountDue ?? 0}</ThemedText>

        <ThemedText color="secondary" variant="caption">
          Estimated amount due
        </ThemedText>
      </ThemedCard>
    </ScrollView>
  );
}

function AlertsWorkspace() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.workspace}
    >
      <View style={styles.summaryRow}>
        <ThemedText variant="label" color="secondary">
          NOTIFICATIONS
        </ThemedText>
        <ThemedBadge label="All clear" variant="success" />
      </View>

      <ThemedCard variant="secondary" padding="xl">
        <View style={styles.emptyState}>
          <Bell size={30} color="#929999" />
          <ThemedText variant="heading3">You&apos;re all caught up</ThemedText>
          <ThemedText color="secondary" variant="bodySmall">
            Important session and payment alerts will appear here.
          </ThemedText>
        </View>
      </ThemedCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexShrink: 0,
    minHeight: 300,
  },
  panel: {
    flex: 1,
    overflow: "hidden",
  },
  header: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  headerControls: {
    position: "absolute",
    right: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  headerDivider: {
    height: 1,
    marginVertical: spacing.md,
  },
  pager: {
    flex: 1,
  },
  workspace: {
    flexGrow: 1,
    gap: spacing.lg,
    paddingVertical: spacing.sm,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
  },
  emptyState: {
    flex: 1,
    minHeight: 190,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.lg,
  },
  inline: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
  paginationDot: {
    width: 9,
    height: 9,
    minHeight: 9,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 99,
    borderWidth: 0,
  },
});
