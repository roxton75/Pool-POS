import { Image } from "expo-image";
import { Check, Gamepad2 } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import {
  ThemedBadge,
  ThemedButton,
  ThemedInput,
  ThemedModal,
  ThemedText,
} from "../shared";

import { spacing, useTheme } from "../../theme";
import type { BookingResource } from "./types";

type Props = {
  visible: boolean;
  resources: BookingResource[];
  selectedResourceId: string;
  customerName: string;
  customerPhone: string;
  notes: string;
  saving: boolean;
  onClose: () => void;
  onStart: () => void;
  onSelectResource: (id: string) => void;
  onCustomerNameChange: (value: string) => void;
  onCustomerPhoneChange: (value: string) => void;
  onNotesChange: (value: string) => void;
};

const money = (amount: number) =>
  `₹${Math.max(0, Math.ceil(amount)).toLocaleString("en-IN")}`;

// Adjust each resource image independently here.
const RESOURCE_IMAGES = {
  "Big Snooker 01": {
    source: require("../../../assets/resources/snooker.avif"),
    width: 170,
    height: 105,
    scale: 1.15,
  },
  "Big Snooker 02": {
    source: require("../../../assets/resources/snooker.avif"),
    width: 170,
    height: 105,
    scale: 1.15,
  },
  "Mini Snooker": {
    source: require("../../../assets/resources/snooker.avif"),
    width: 145,
    height: 90,
    scale: 1,
  },
  "American Pool": {
    source: require("../../../assets/resources/pool.avif"),
    width: 150,
    height: 90,
    scale: 1,
  },
  "PS5 Console": {
    source: require("../../../assets/resources/ps5-dualshocks.avif"),
    width: 100,
    height: 100,
    scale: 1.1,
  },
} as const;

type ResourceName = keyof typeof RESOURCE_IMAGES;

function getResourceImage(name: string) {
  return RESOURCE_IMAGES[name as ResourceName] ?? null;
}

export default function StartSessionModal({
  visible,
  resources,
  selectedResourceId,
  customerName,
  customerPhone,
  notes,
  saving,
  onClose,
  onStart,
  onSelectResource,
  onCustomerNameChange,
  onCustomerPhoneChange,
  onNotesChange,
}: Props) {
  const { colors } = useTheme();

  // Only resources that can currently accept a session.
  const availableResources = resources.filter(
    (resource) => resource.isActive && !resource.isMaintenance,
  );

  return (
    <ThemedModal
      visible={visible}
      onClose={onClose}
      title="Start new session"
      description="Choose a resource and enter customer details."
      footer={
        <View style={styles.footer}>
          <ThemedButton
            title="Cancel"
            variant="outline"
            onPress={onClose}
            disabled={saving}
          />

          <ThemedButton
            title="Start session"
            loading={saving}
            disabled={
              saving ||
              !availableResources.some(
                (resource) => resource.id === selectedResourceId,
              )
            }
            onPress={onStart}
          />
        </View>
      }
    >
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText variant="label">SELECT RESOURCE</ThemedText>

            <ThemedText variant="caption" color="secondary">
              {availableResources.length} available
            </ThemedText>
          </View>

          {availableResources.length === 0 ? (
            <View style={styles.empty}>
              <Gamepad2 size={26} color={colors.text.secondary} />
              <ThemedText variant="bodySmall" color="secondary">
                No resources are currently available.
              </ThemedText>
            </View>
          ) : (
            <View style={styles.grid}>
              {availableResources.map((resource) => {
                const selected = selectedResourceId === resource.id;

                const image = getResourceImage(resource.name);

                return (
                  <Pressable
                    key={resource.id}
                    onPress={() => onSelectResource(resource.id)}
                    style={[
                      styles.resourceCard,
                      {
                        borderColor: selected ? colors.accent : colors.border,
                        backgroundColor: selected
                          ? colors.surfaceSecondary
                          : colors.surface,
                      },
                    ]}
                  >
                    <View style={styles.imageStage}>
                      {image ? (
                        <Image
                          source={image.source}
                          contentFit="contain"
                          cachePolicy="memory-disk"
                          style={{
                            width: image.width,
                            height: image.height,
                            transform: [{ scale: image.scale }],
                          }}
                        />
                      ) : (
                        <Gamepad2 size={38} color={colors.text.secondary} />
                      )}
                    </View>

                    <View style={styles.resourceDetails}>
                      <View style={styles.resourceTitle}>
                        <ThemedText variant="bodyMedium" numberOfLines={1}>
                          {resource.name}
                        </ThemedText>

                        {selected && <Check size={16} color={colors.accent} />}
                      </View>

                      <ThemedText variant="caption" color="secondary">
                        {money(resource.ratePerHour)} / hour
                      </ThemedText>
                    </View>

                    {selected && (
                      <View
                        style={[
                          styles.selectedIndicator,
                          { backgroundColor: colors.accent },
                        ]}
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <ThemedText variant="label">CUSTOMER DETAILS</ThemedText>

          <ThemedInput
            label="Customer name"
            placeholder="Walk-in customer"
            value={customerName}
            onChangeText={onCustomerNameChange}
          />

          <ThemedInput
            label="Phone number"
            placeholder="Optional"
            value={customerPhone}
            onChangeText={onCustomerPhoneChange}
            keyboardType="phone-pad"
          />

          <ThemedInput
            label="Notes"
            placeholder="Optional session notes"
            value={notes}
            onChangeText={onNotesChange}
            multiline
            numberOfLines={3}
          />
        </View>

        <ThemedText variant="caption" color="secondary">
          Billing starts when the session begins. The configured grace period is
          applied automatically.
        </ThemedText>
      </ScrollView>
    </ThemedModal>
  );
}

const styles = StyleSheet.create({
  body: {
    maxHeight: 470,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.sm,
  },
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  resourceCard: {
    width: "48%",
    minHeight: 165,
    flexGrow: 1,
    flexBasis: "46%",
    borderWidth: 1,
    borderRadius: 13,
    padding: spacing.sm,
    overflow: "hidden",
    justifyContent: "space-between",
    position: "relative",
  },
  imageStage: {
    height: 95,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },
  resourceDetails: {
    gap: spacing.xxs,
  },
  resourceTitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.xs,
  },
  selectedIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 3,
    height: "100%",
  },
  empty: {
    minHeight: 130,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: "#88888830",
    borderRadius: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});
