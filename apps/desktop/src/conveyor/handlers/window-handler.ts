import type { BrowserWindow } from "electron";
import { handle } from "../../main/shared";

export function registerWindowHandlers(win: BrowserWindow): void {
  handle("window:init", () => {
    const [width, height] = win.getSize();
    return {
      width,
      height,
      minimizable: win.isMinimizable(),
      maximizable: win.isMaximizable(),
      closable: win.isClosable(),
      fullscreenable: win.isFullScreenable(),
      platform: process.platform,
    };
  });

  handle("window:minimize", () => {
    win.minimize();
  });

  handle("window:maximize", () => {
    win.maximize();
  });

  handle("window:maximize-toggle", () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });

  handle("window:close", () => {
    win.close();
  });

  handle("window:is-maximized", () => win.isMaximized());

  handle("window:is-fullscreen", () => win.isFullScreen());

  handle("window:toggle-fullscreen", () => {
    win.setFullScreen(!win.isFullScreen());
  });
}
