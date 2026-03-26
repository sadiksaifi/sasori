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
}
