import { dialog, type BrowserWindow } from "electron";
import { handle } from "../../main/shared";

export function registerDialogHandlers(win: BrowserWindow): void {
  handle("dialog:open-directory", async () => {
    const result = await dialog.showOpenDialog(win, {
      properties: ["openDirectory"],
    });
    return {
      path: result.filePaths[0] ?? null,
    };
  });

  handle("dialog:confirm", ({ message, detail, confirmLabel, cancelLabel }) => {
    const result = dialog.showMessageBoxSync(win, {
      type: "warning",
      message,
      detail,
      buttons: [cancelLabel ?? "Cancel", confirmLabel ?? "OK"],
      defaultId: 1,
      cancelId: 0,
    });
    return { confirmed: result === 1 };
  });
}
