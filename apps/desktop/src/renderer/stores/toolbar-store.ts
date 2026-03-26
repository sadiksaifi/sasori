import type { Icon } from "@phosphor-icons/react";
import { create } from "zustand";

export interface ToolbarAction {
  key: string;
  label: string;
  icon: Icon;
  onClick?: () => void;
}

export interface ToolbarConfig {
  title: string;
  onTitleClick?: () => void;
  actions: ToolbarAction[];
}

interface ToolbarState {
  config: ToolbarConfig | null;
  setConfig: (config: ToolbarConfig) => void;
  clearConfig: () => void;
}

export const useToolbarStore = create<ToolbarState>()((set) => ({
  config: null,
  setConfig: (config) => set({ config }),
  clearConfig: () => set({ config: null }),
}));
