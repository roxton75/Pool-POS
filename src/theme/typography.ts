import type { TextStyle } from "react-native";

export const fonts = {
  regular: "GoogleSans-Regular",
  medium: "GoogleSans-Medium",
  semiBold: "GoogleSans-SemiBold",
  bold: "GoogleSans-Bold",
} as const;

export const fontSizes = {
  "2xs": 10,
  xs: 11,
  sm: 12,
  md: 13,
  base: 14,
  lg: 16,
  xl: 18,
  "2xl": 20,
  "3xl": 24,
  "4xl": 28,
  "5xl": 32,
  "6xl": 36,
  "7xl": 42,
} as const;

export const lineHeights = {
  xs: 14,
  sm: 16,
  md: 18,
  base: 20,
  lg: 22,
  xl: 24,
  "2xl": 28,
  "3xl": 32,
  "4xl": 36,
  "5xl": 42,
  "6xl": 48,
} as const;

export const fontWeights = {
  regular: "400",
  medium: "500",
  semiBold: "600",
  bold: "700",
} as const;

export const typography = {
  display: {
    fontFamily: fonts.bold,
    fontSize: fontSizes["5xl"],
    lineHeight: lineHeights["6xl"],
  },
  heading1: {
    fontFamily: fonts.bold,
    fontSize: fontSizes["3xl"],
    lineHeight: lineHeights["4xl"],
  },
  heading2: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes["2xl"],
    lineHeight: lineHeights["3xl"],
  },
  heading3: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.xl,
    lineHeight: lineHeights["2xl"],
  },
  subtitle: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.lg,
    lineHeight: lineHeights.xl,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.base,
    lineHeight: lineHeights.lg,
  },
  bodyMedium: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.base,
    lineHeight: lineHeights.lg,
  },
  bodySmall: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.md,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.md,
    lineHeight: lineHeights.md,
  },
  caption: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.sm,
  },
  button: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.base,
    lineHeight: lineHeights.lg,
  },
  overline: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes["2xs"],
    lineHeight: lineHeights.xs,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
} satisfies Record<string, TextStyle>;
