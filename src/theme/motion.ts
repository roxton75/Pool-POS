import { Easing } from "react-native-reanimated";

export const duration = {
  instant: 0,
  fast: 150,
  normal: 220,
  moderate: 300,
  slow: 400,
  slower: 500,
} as const;

export const easing = {
  linear: Easing.linear,
  ease: Easing.ease,
  easeIn: Easing.in(Easing.ease),
  easeOut: Easing.out(Easing.ease),
  easeInOut: Easing.inOut(Easing.ease),
  smooth: Easing.bezier(0.22, 1, 0.36, 1),
} as const;

export const timing = {
  fast: {
    duration: duration.fast,
    easing: easing.easeOut,
  },
  normal: {
    duration: duration.normal,
    easing: easing.easeInOut,
  },
  smooth: {
    duration: duration.moderate,
    easing: easing.smooth,
  },
  slow: {
    duration: duration.slow,
    easing: easing.easeInOut,
  },
} as const;

export const spring = {
  gentle: {
    damping: 18,
    stiffness: 120,
    mass: 1,
  },
  standard: {
    damping: 20,
    stiffness: 180,
    mass: 1,
  },
  snappy: {
    damping: 16,
    stiffness: 240,
    mass: 0.8,
  },
} as const;

export const transitions = {
  theme: timing.smooth,
  sidebar: {
    duration: 320,
    easing: easing.smooth,
  },
  modal: timing.normal,
  press: timing.fast,
  dropdown: timing.normal,
  page: timing.normal,
} as const;
