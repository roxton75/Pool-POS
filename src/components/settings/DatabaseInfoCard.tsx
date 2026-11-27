import React from "react";
import { ThemedCard, ThemedText } from "../shared";

export default function DatabaseInfoCard() {
  return (
    <ThemedCard padding="lg">
      <ThemedText variant="subtitle">Local SQLite database</ThemedText>
      <ThemedText color="secondary" variant="bodySmall">
        Q-Zone currently uses the local qzone.db database. Database export, file backup and restore are not enabled in this screen; no fake backup action is shown.
      </ThemedText>
    </ThemedCard>
  );
}
