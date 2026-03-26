import { useCallback } from "react";

export interface ContextMenuItem {
  id?: string;
  label?: string;
  type?: "normal" | "separator" | "checkbox";
  enabled?: boolean;
  checked?: boolean;
}

export function useContextMenu() {
  return useCallback(async (items: ContextMenuItem[]): Promise<string | null> => {
    const { actionId } = await window.conveyor.contextMenu.show({ items });
    return actionId;
  }, []);
}
