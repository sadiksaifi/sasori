import type { App, BrowserWindow } from "electron";
import { registerAppHandlers } from "./app-handler";
import { registerDialogHandlers } from "./dialog-handler";
import { registerWindowHandlers } from "./window-handler";
import { registerWebContentHandlers } from "./webcontent-handler";
import { registerDbHandlers } from "./db-handler";

export function registerAllHandlers(win: BrowserWindow, app: App): void {
  registerAppHandlers(app);
  registerDialogHandlers(win);
  registerWindowHandlers(win);
  registerWebContentHandlers(win);
  registerDbHandlers();
}
