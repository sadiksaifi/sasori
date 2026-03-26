import { useEffect, useRef } from "react";
import { useToolbarStore, type ToolbarConfig } from "@/stores/toolbar-store";

export type { ToolbarConfig, ToolbarAction } from "@/stores/toolbar-store";

export function useToolbar(config: ToolbarConfig) {
  const setConfig = useToolbarStore((s) => s.setConfig);
  const clearConfig = useToolbarStore((s) => s.clearConfig);

  // Keep latest config in ref to avoid stale closures
  const configRef = useRef(config);
  configRef.current = config;

  // Derive a stable key from config structure so effect re-runs on structural changes
  const key = `${config.title}:${config.actions.map((a) => a.key).join(",")}`;

  useEffect(() => {
    setConfig(configRef.current);
    return () => clearConfig();
  }, [key, setConfig, clearConfig]);
}
