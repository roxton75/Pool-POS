import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";

interface ScreenPlaceholderProps {
  title: string;
}

export default function ScreenPlaceholder({ title }: ScreenPlaceholderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text.primary }]}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "GoogleSans-Bold",
    fontSize: 28,
  },
});
