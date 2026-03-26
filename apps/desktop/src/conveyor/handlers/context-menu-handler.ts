import { Menu, type BrowserWindow } from "electron";
import { handle } from "../../main/shared";

export function registerContextMenuHandlers(win: BrowserWindow): void {
  handle("context-menu:show", ({ items }) => {
    return new Promise((resolve) => {
      let selectedId: string | null = null;

      const template = items.map((item) => {
        if (item.type === "separator") {
          return { type: "separator" as const };
        }
        return {
          label: item.label ?? "",
          type: (item.type ?? "normal") as "normal" | "checkbox",
          enabled: item.enabled ?? true,
          checked: item.checked,
          click: () => {
            selectedId = item.id ?? null;
          },
        };
      });

      const menu = Menu.buildFromTemplate(template);
      menu.popup({
        window: win,
        callback: () => {
          resolve({ actionId: selectedId });
        },
      });
    });
  });
}
