import React from "react";
import { ScrollView } from "react-native";
import { ThemedText } from "../shared";
import { spacing } from "../../theme";
import type { CategoryId, SettingDefinition, SettingMap, SettingValue } from "./types";
import SettingField from "./SettingField";
import ResourceRateCard from "./ResourceRateCard";
import DatabaseInfoCard from "./DatabaseInfoCard";

type Resource = { id: string; name: string; rate_per_hour: number };

type Props = {
  category: CategoryId;
  definitions: SettingDefinition[];
  settings: SettingMap;
  resources: Resource[];
  resourceDrafts: Record<string, string>;
  loading: boolean;
  saving: boolean;
  onSettingChange: (key: string, value: SettingValue) => void;
  onResourceDraftChange: (id: string, value: string) => void;
  onSaveResourceRate: (id: string) => void;
};

export default function SettingsCategoryContent({
  category, definitions, settings, resources, resourceDrafts,
  loading, saving, onSettingChange, onResourceDraftChange, onSaveResourceRate,
}: Props) {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}
      keyboardShouldPersistTaps="handled"
    >
      {loading ? (
        <ThemedText color="secondary">Loading settings…</ThemedText>
      ) : category === "resources" ? (
        <>
          <ThemedText color="secondary" variant="bodySmall">
            Resource rates are stored in SQLite as whole rupees. Changes apply to the selected resource.
          </ThemedText>
          {resources.map((resource) => (
            <ResourceRateCard
              key={resource.id}
              name={resource.name}
              value={resourceDrafts[resource.id] ?? ""}
              disabled={saving}
              onChange={(value) => onResourceDraftChange(resource.id, value)}
              onSave={() => onSaveResourceRate(resource.id)}
            />
          ))}
          {definitions.map((definition) => (
            <SettingField
              key={definition.key}
              definition={definition}
              value={settings[definition.key] ?? ""}
              disabled={saving}
              onChange={(value) => onSettingChange(definition.key, value)}
            />
          ))}
        </>
      ) : category === "data" ? (
        <DatabaseInfoCard />
      ) : (
        definitions.map((definition) => (
          <SettingField
            key={definition.key}
            definition={definition}
            value={settings[definition.key] ?? ""}
            disabled={saving}
            onChange={(value) => onSettingChange(definition.key, value)}
          />
        ))
      )}
    </ScrollView>
  );
}
