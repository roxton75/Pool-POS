import { useColorScheme } from 'react-native';
import { Colors, type ThemeColor } from '@/constants/theme';

export function useTheme() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  return {
    colorScheme,
    theme,
    colors: theme,
  };
}