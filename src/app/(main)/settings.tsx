/* eslint-disable react-hooks/set-state-in-effect */
// import ScreenPlaceholder from "../../components/shared/ScreenPlaceholder";

// export default function SettingsScreen() {
//   return <ScreenPlaceholder title="Settings" />;
// }

import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Check, RotateCcw } from "lucide-react-native";

import {
  ThemedBadge,
  ThemedButton,
  ThemedCard,
  ThemedInput,
  ThemedText,
} from "../../components/shared";
import { useResources } from "../../hooks";
import { spacing } from "../../theme";

const formatRate = (rate: number) => String(rate);

export default function SettingsScreen() {
  const { resources, loading, error, updateResource } = useResources();

  const [draftRates, setDraftRates] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setDraftRates(
      Object.fromEntries(
        resources.map((resource) => [
          resource.id,
          formatRate(resource.ratePerHour),
        ]),
      ),
    );
  }, [resources]);

  const handleRateChange = (id: string, value: string) => {
    setDraftRates((current) => ({
      ...current,
      [id]: value.replace(/[^0-9]/g, ""),
    }));

    setSavedId(null);
    setSaveError(null);
  };

  const handleSave = async (id: string) => {
    const value = draftRates[id]?.trim();

    if (!value || !Number.isSafeInteger(Number(value))) {
      setSaveError("Enter a valid whole-number rate.");
      return;
    }

    setSavingId(id);
    setSaveError(null);
    setSavedId(null);

    try {
      await updateResource(id, {
        ratePerHour: Number(value),
      });

      setSavedId(id);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Unable to save the rate.",
      );
    } finally {
      setSavingId(null);
    }
  };

  const handleReset = (id: string, rate: number) => {
    setDraftRates((current) => ({
      ...current,
      [id]: formatRate(rate),
    }));

    setSavedId(null);
    setSaveError(null);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        {/* <View style={styles.headerIcon}>
          <Settings2 size={21} />
        </View> */}

        <View style={styles.headerText}>
          <ThemedText variant="heading1">Settings</ThemedText>
          <ThemedText color="secondary" variant="bodySmall">
            Configure your club resources and hourly pricing.
          </ThemedText>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <ThemedText variant="heading2">Resource Pricing</ThemedText>
            <ThemedText color="secondary" variant="caption">
              Changes are saved directly to your local database.
            </ThemedText>
          </View>

          <ThemedBadge
            label={`${resources.length} Resources`}
            variant="neutral"
          />
        </View>

        {loading ? (
          <ThemedCard padding="lg">
            <ThemedText color="secondary">Loading resources...</ThemedText>
          </ThemedCard>
        ) : error ? (
          <ThemedCard padding="lg">
            <ThemedText color="sage">{error}</ThemedText>
          </ThemedCard>
        ) : (
          resources.map((resource) => {
            const currentRate = draftRates[resource.id] ?? "";
            const hasChanges = currentRate !== formatRate(resource.ratePerHour);

            return (
              <ThemedCard
                key={resource.id}
                padding="lg"
                style={styles.resourceCard}
              >
                <View style={styles.resourceHeader}>
                  <View style={styles.resourceInfo}>
                    <ThemedText variant="subtitle">{resource.name}</ThemedText>

                    <ThemedText color="secondary" variant="caption">
                      {resource.type.replaceAll("_", " ")}
                    </ThemedText>
                  </View>

                  <ThemedBadge
                    label={resource.isActive ? "Active" : "Inactive"}
                    variant={resource.isActive ? "success" : "neutral"}
                    size="sm"
                  />
                </View>

                <View style={styles.rateRow}>
                  <View style={styles.inputWrapper}>
                    <ThemedInput
                      label="Hourly Rate (₹)"
                      value={currentRate}
                      onChangeText={(value) =>
                        handleRateChange(resource.id, value)
                      }
                      keyboardType="number-pad"
                      placeholder="Enter hourly rate"
                    />
                  </View>

                  <View style={styles.actions}>
                    <ThemedButton
                      title=""
                      variant="ghost"
                      size="md"
                      disabled={!hasChanges || savingId === resource.id}
                      leftIcon={<RotateCcw size={17} />}
                      onPress={() =>
                        handleReset(resource.id, resource.ratePerHour)
                      }
                    />

                    <ThemedButton
                      title="Save"
                      size="md"
                      loading={savingId === resource.id}
                      disabled={!hasChanges || savingId !== null}
                      leftIcon={<Check size={15} />}
                      onPress={() => void handleSave(resource.id)}
                    />
                  </View>
                </View>

                {savedId === resource.id && (
                  <ThemedText color="accent" variant="caption">
                    Rate saved successfully.
                  </ThemedText>
                )}
              </ThemedCard>
            );
          })
        )}

        {saveError && (
          <ThemedText color="sage" variant="bodySmall">
            {saveError}
          </ThemedText>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing["5xl"],
    gap: spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  headerText: {
    flex: 1,
    gap: spacing.xs,
  },
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  resourceCard: {
    gap: spacing.md,
  },
  resourceHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  resourceInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  rateRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.md,
  },
  inputWrapper: {
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
});
