import type React from "react";

export type CategoryId =
  | "general" | "resources" | "billing" | "sessions"
  | "waitlist" | "food" | "appearance" | "data";

export type SettingValue = string | number | boolean;
export type SettingMap = Record<string, SettingValue>;

export type SettingDefinition = {
  key: string;
  label: string;
  type: "text" | "number" | "textarea" | "select" | "switch";
  placeholder?: string;
  suffix?: string;
  help?: string;
  min?: number;
  max?: number;
  options?: { label: string; value: string }[];
};

export type SettingsCategory = {
  id: CategoryId;
  label: string;
  description: string;
  icon: React.ReactNode;
};
