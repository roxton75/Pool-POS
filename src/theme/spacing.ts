export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 64,
  "7xl": 80,
} as const;

export const componentSpacing = {
  screenPadding: spacing["2xl"],
  cardPadding: spacing.lg,
  cardGap: spacing.md,
  sectionGap: spacing["2xl"],
  inputPaddingHorizontal: spacing.md,
  inputPaddingVertical: spacing.md,
  buttonPaddingHorizontal: spacing.lg,
  buttonPaddingVertical: spacing.md,
  iconTextGap: spacing.sm,
  inlineGap: spacing.sm,
  sidebarPadding: spacing.sm,
  headerPadding: spacing.md,
} as const;

export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  "2xl": 16,
  "3xl": 20,
  "4xl": 24,
  full: 999,
} as const;

export const sizes = {
  icon: {
    xs: 14,
    sm: 16,
    md: 18,
    lg: 20,
    xl: 24,
    "2xl": 28,
  },
  control: {
    sm: 32,
    md: 40,
    lg: 44,
    xl: 48,
  },
  sidebar: {
    collapsed: 68,
    expanded: 170,
  },
  header: {
    height: 64,
  },
} as const;
