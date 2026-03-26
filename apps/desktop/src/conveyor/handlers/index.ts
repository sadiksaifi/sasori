import type { App, BrowserWindow } from "electron";
import { registerAppHandlers } from "./app-handler";
import { registerWindowHandlers } from "./window-handler";
import { registerWebContentHandlers } from "./webcontent-handler";

export function registerAllHandlers(win: BrowserWindow, app: App): void {
  registerAppHandlers(app);
  registerWindowHandlers(win);
  registerWebContentHandlers(win);
}
