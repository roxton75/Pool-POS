// export type ThemeMode = "dark" | "light";

// export interface SidebarProps {
//   activePath: string;
//   collapsed: boolean;
//   onNavigate: (route: string) => void;
//   onToggle: () => void;
// }

// export interface TopHeaderProps {
//   themeMode: ThemeMode;
//   onToggleTheme: () => void;
//   onLogoPress: () => void;
// }

// export interface BottomStatusBarProps {
//   totalResources: number;
//   occupied: number;
//   available: number;
//   waiting: number;
//   isOnline?: boolean;
// }

export type ThemeMode = "dark" | "light";

export interface SidebarProps {
  activePath: string;
  collapsed: boolean;
  onNavigate: (route: string) => void;
}

export interface TopHeaderProps {
  themeMode: ThemeMode;
  onToggleTheme: () => void;
  onLogoPress: () => void;
}

export interface BottomStatusBarProps {
  totalResources: number;
  occupied: number;
  available: number;
  waiting: number;
  isOnline?: boolean;
}
