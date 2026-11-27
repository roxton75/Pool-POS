import { Plus } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { ThemedButton, ThemedText } from "../shared";
import { spacing } from "../../theme";

type Props = {
  onNewSession: () => void;
  disabled?: boolean;
};

export default function BookingHeader({ onNewSession, disabled }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <ThemedText variant="heading1">Bookings</ThemedText>
        <ThemedText variant="bodySmall" color="secondary">
          Manage walk-in sessions and resource availability.
        </ThemedText>
      </View>

      <ThemedButton
        title="New Session"
        variant="primary"
        size="md"
        leftIcon={<Plus size={16} />}
        onPress={onNewSession}
        disabled={disabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  heading: {
    flex: 1,
    gap: spacing.xs,
  },
});
