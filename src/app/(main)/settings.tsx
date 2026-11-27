/* eslint-disable react-hooks/set-state-in-effect */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { useDatabase } from "../../database";
import {
  Clock3,
  Database,
  DollarSign,
  List,
  Monitor,
  Settings as SettingsIcon,
  Utensils,
  Wrench,
} from "lucide-react-native";
import {
  ThemedButton,
  ThemedCard,
  ThemedDivider,
  ThemedText,
} from "../../components/shared";
import {
  DatabaseInfoCard,
  ResourceRateCard,
  SettingField,
  SettingsCategoryContent,
  SettingsSidebar,
  type CategoryId,
  type SettingDefinition,
  type SettingMap,
  type SettingValue,
} from "../../components/settings";
import { spacing, useTheme } from "../../theme";

const CATEGORIES: {
  id: CategoryId;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "general",
    label: "General",
    description: "Club information and operating hours",
    icon: <SettingsIcon size={19} />,
  },
  {
    id: "resources",
    label: "Resources",
    description: "Table and console hourly rates",
    icon: <Wrench size={19} />,
  },
  {
    id: "billing",
    label: "Billing",
    description: "Grace period and billing rules",
    icon: <DollarSign size={19} />,
  },
  {
    id: "sessions",
    label: "Sessions",
    description: "Pause and session defaults",
    icon: <Clock3 size={19} />,
  },
  {
    id: "waitlist",
    label: "Waitlist",
    description: "Queue behaviour",
    icon: <List size={19} />,
  },
  {
    id: "food",
    label: "Food & Menu",
    description: "Food defaults and tax",
    icon: <Utensils size={19} />,
  },
  {
    id: "appearance",
    label: "Appearance",
    description: "Theme and display preferences",
    icon: <Monitor size={19} />,
  },
  {
    id: "data",
    label: "Data & Backup",
    description: "Database information",
    icon: <Database size={19} />,
  },
];

const DEFINITIONS: Record<CategoryId, SettingDefinition[]> = {
  general: [
    {
      key: "club_name",
      label: "Club Name",
      type: "text",
      placeholder: "Q-Zone Pool & Snooker Club",
    },
    {
      key: "club_phone",
      label: "Phone Number",
      type: "text",
      placeholder: "+91...",
    },
    {
      key: "club_email",
      label: "Email",
      type: "text",
      placeholder: "info@qzone.com",
    },
    {
      key: "club_address",
      label: "Address",
      type: "textarea",
      placeholder: "Club address",
    },
    {
      key: "club_open_hour",
      label: "Opening Hour",
      type: "number",
      min: 0,
      max: 23,
      suffix: "h",
    },
    {
      key: "club_close_hour",
      label: "Closing Hour",
      type: "number",
      min: 0,
      max: 23,
      suffix: "h",
    },
    {
      key: "gst_rate",
      label: "GST Rate",
      type: "number",
      min: 0,
      max: 100,
      suffix: "%",
    },
  ],
  resources: [
    {
      key: "default_rate_pool",
      label: "American Pool Rate",
      type: "number",
      min: 0,
      suffix: "₹ / hr",
    },
    {
      key: "default_rate_mini_snooker",
      label: "Mini Snooker Rate",
      type: "number",
      min: 0,
      suffix: "₹ / hr",
    },
    {
      key: "default_rate_big_snooker",
      label: "Big Snooker Rate",
      type: "number",
      min: 0,
      suffix: "₹ / hr",
    },
    {
      key: "default_rate_ps5",
      label: "PS5 Rate",
      type: "number",
      min: 0,
      suffix: "₹ / hr",
    },
  ],
  billing: [
    {
      key: "grace_period_minutes",
      label: "Grace Period",
      type: "number",
      min: 0,
      max: 60,
      suffix: "min",
    },
    {
      key: "minimum_charge",
      label: "Minimum Charge",
      type: "number",
      min: 0,
      suffix: "₹",
    },
    {
      key: "round_up_to",
      label: "Round Up To",
      type: "select",
      options: [
        { label: "Nearest ₹1 (round up)", value: "1" },
        { label: "Nearest ₹5 (round up)", value: "5" },
        { label: "Nearest ₹10 (round up)", value: "10" },
      ],
    },
  ],
  sessions: [
    {
      key: "max_pause_minutes",
      label: "Maximum Pause",
      type: "number",
      min: 0,
      max: 240,
      suffix: "min",
    },
    {
      key: "auto_complete_after_hours",
      label: "Auto Complete After",
      type: "number",
      min: 0,
      max: 48,
      suffix: "hours",
      help: "Set 0 to disable.",
    },
    {
      key: "default_session_notes",
      label: "Default Session Notes",
      type: "textarea",
      placeholder: "Optional notes",
    },
  ],
  waitlist: [
    {
      key: "waitlist_claim_minutes",
      label: "Claim Window",
      type: "number",
      min: 1,
      max: 60,
      suffix: "min",
    },
    {
      key: "auto_assign_when_available",
      label: "Auto-assign when available",
      type: "switch",
    },
    { key: "notify_on_turn", label: "Notify when turn comes", type: "switch" },
  ],
  food: [
    {
      key: "food_auto_assign_category",
      label: "Default Food Category",
      type: "select",
      options: [
        { label: "Beverages", value: "cat_beverages" },
        { label: "Snacks", value: "cat_snacks" },
        { label: "Meals", value: "cat_meals" },
      ],
    },
    {
      key: "default_food_tax_rate",
      label: "Food Tax Rate",
      type: "number",
      min: 0,
      max: 100,
      suffix: "%",
    },
  ],
  appearance: [
    {
      key: "theme_mode",
      label: "Theme Mode",
      type: "select",
      options: [
        { label: "System", value: "system" },
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" },
      ],
    },
    {
      key: "font_scale",
      label: "Font Size",
      type: "select",
      options: [
        { label: "Small", value: "0.85" },
        { label: "Normal", value: "1" },
        { label: "Large", value: "1.15" },
        { label: "Extra Large", value: "1.3" },
      ],
    },
    { key: "show_animations", label: "Enable Animations", type: "switch" },
    { key: "compact_mode", label: "Compact Mode", type: "switch" },
  ],
  data: [],
};

const DEFAULTS: SettingMap = {
  club_name: "Q-Zone Pool & Snooker Club",
  club_phone: "",
  club_email: "",
  club_address: "",
  club_open_hour: 10,
  club_close_hour: 2,
  gst_rate: 0,
  default_rate_pool: 250,
  default_rate_mini_snooker: 250,
  default_rate_big_snooker: 350,
  default_rate_ps5: 0,
  grace_period_minutes: 12,
  minimum_charge: 0,
  round_up_to: "1",
  max_pause_minutes: 30,
  auto_complete_after_hours: 0,
  default_session_notes: "",
  waitlist_claim_minutes: 5,
  auto_assign_when_available: true,
  notify_on_turn: true,
  food_auto_assign_category: "cat_beverages",
  default_food_tax_rate: 0,
  theme_mode: "system",
  font_scale: "1",
  show_animations: true,
  compact_mode: false,
};

function parseStoredValue(value: string): SettingValue {
  if (value === "true") return true;
  if (value === "false") return false;
  if (value.trim() !== "" && Number.isFinite(Number(value)))
    return Number(value);
  return value;
}

export default function SettingsScreen() {
  const db = useDatabase();
  const { setMode } = useTheme();
  const [category, setCategory] = useState<CategoryId>("general");
  const [settings, setSettings] = useState<SettingMap>(DEFAULTS);
  const [savedSettings, setSavedSettings] = useState<SettingMap>(DEFAULTS);
  const [resourceDrafts, setResourceDrafts] = useState<Record<string, string>>(
    {},
  );
  const [resources, setResources] = useState<
    { id: string; name: string; rate_per_hour: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const rows = await db.getAllAsync<{ key: string; value: string }>(
        "SELECT key, value FROM settings",
      );
      const next = { ...DEFAULTS };
      for (const row of rows) next[row.key] = parseStoredValue(row.value);
      setSettings(next);
      setSavedSettings(next);

      const resourceRows = await db.getAllAsync<{
        id: string;
        name: string;
        rate_per_hour: number;
      }>(
        "SELECT id, name, rate_per_hour FROM resources WHERE is_active = 1 ORDER BY display_order ASC",
      );
      setResources(resourceRows);
      // rate_per_hour is stored and displayed as whole rupees.
      setResourceDrafts(
        Object.fromEntries(
          resourceRows.map((row) => [row.id, String(row.rate_per_hour)]),
        ),
      );
    } catch (error) {
      console.error("[Settings] Load failed", error);
      setStatus("Could not load settings. Check the database schema.");
    } finally {
      setLoading(false);
    }
  }, [db]);

  useEffect(() => {
    void load();
  }, [load]);

  const updateSetting = useCallback((key: string, value: SettingValue) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setDirty(true);
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      await db.withTransactionAsync(async () => {
        for (const [key, value] of Object.entries(settings)) {
          await db.runAsync(
            "INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now'))",
            [key, String(value)],
          );
        }
      });
      setSavedSettings(settings);
      setDirty(false);
      setStatus("Settings saved.");
      if (settings.theme_mode === "light" || settings.theme_mode === "dark") {
        setMode(settings.theme_mode);
      }
    } catch (error) {
      console.error("[Settings] Save failed", error);
      setStatus(
        error instanceof Error ? error.message : "Could not save settings.",
      );
    } finally {
      setSaving(false);
    }
  }, [db, settings, setMode]);

  const resetCategory = useCallback(() => {
    const next = { ...settings };
    for (const definition of DEFINITIONS[category])
      next[definition.key] = DEFAULTS[definition.key];
    setSettings(next);
    setDirty(true);
  }, [category, settings]);

  const saveResourceRate = useCallback(
    async (resourceId: string) => {
      const raw = resourceDrafts[resourceId]?.trim();
      const rupees = Number(raw);
      if (!raw || !Number.isSafeInteger(rupees) || rupees < 0) {
        Alert.alert(
          "Invalid rate",
          "Enter a valid non-negative whole-rupee hourly rate.",
        );
        return;
      }
      try {
        await db.runAsync(
          "UPDATE resources SET rate_per_hour = ?, updated_at = datetime('now') WHERE id = ?",
          [rupees, resourceId],
        );
        setResources((current) =>
          current.map((resource) =>
            resource.id === resourceId
              ? { ...resource, rate_per_hour: rupees }
              : resource,
          ),
        );
        setStatus("Resource rate updated.");
      } catch (error) {
        console.error("[Settings] Resource rate update failed", error);
        setStatus("Could not update this resource rate.");
      }
    },
    [db, resourceDrafts],
  );

  const selected = useMemo(
    () => CATEGORIES.find((item) => item.id === category)!,
    [category],
  );

  return (
    <View style={styles.screen}>
      <View style={styles.pageHeader}>
        <ThemedText variant="heading1">Settings</ThemedText>
        <ThemedText color="secondary" variant="bodySmall">
          Configure Q-Zone and its operating rules
        </ThemedText>
      </View>

      {!!status && (
        <View style={styles.status}>
          <ThemedText color="secondary" variant="bodySmall">
            {status}
          </ThemedText>
        </View>
      )}

      <View style={styles.panels}>
        <SettingsSidebar
          categories={CATEGORIES}
          selectedId={category}
          onSelect={setCategory}
        />
        <ThemedCard padding="none" style={styles.content}>
          <View style={styles.contentHeader}>
            <View style={styles.flex}>
              <ThemedText variant="heading2">{selected.label}</ThemedText>
              <ThemedText color="secondary" variant="caption">
                {selected.description}
              </ThemedText>
            </View>
            {dirty && (
              <View style={styles.actions}>
                <ThemedButton
                  title="Reset"
                  size="sm"
                  variant="ghost"
                  onPress={resetCategory}
                />
                <ThemedButton
                  title="Save"
                  size="sm"
                  loading={saving}
                  disabled={saving}
                  onPress={save}
                />
              </View>
            )}
          </View>
          <ThemedDivider />
          <SettingsCategoryContent
            category={category}
            definitions={DEFINITIONS[category]}
            settings={settings}
            resources={resources}
            resourceDrafts={resourceDrafts}
            loading={loading}
            saving={saving}
            onSettingChange={updateSetting}
            onResourceDraftChange={(id, value) =>
              setResourceDrafts((current) => ({ ...current, [id]: value }))
            }
            onSaveResourceRate={(id) => void saveResourceRate(id)}
          />
        </ThemedCard>
      </View>

      {dirty && (
        <View style={styles.footer}>
          <ThemedButton
            title="Discard Changes"
            variant="ghost"
            onPress={() => {
              setSettings(savedSettings);
              setDirty(false);
            }}
          />
          <ThemedButton
            title="Save All Changes"
            loading={saving}
            disabled={saving}
            onPress={() => void save()}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: spacing.lg, gap: spacing.md },
  pageHeader: { gap: spacing.xs },
  status: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  panels: { flex: 1, flexDirection: "row", gap: spacing.md },
  content: { flex: 1, minWidth: 0 },
  contentHeader: {
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  flex: { flex: 1, gap: spacing.xs },
  actions: { flexDirection: "row", gap: spacing.xs },
  footer: { flexDirection: "row", justifyContent: "flex-end", gap: spacing.sm },
});
