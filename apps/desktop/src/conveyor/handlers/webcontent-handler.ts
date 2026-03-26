import { shell, type BrowserWindow } from "electron";
import { handle } from "../../main/shared";

export function registerWebContentHandlers(win: BrowserWindow): void {
  const wc = () => win.webContents;

  handle("webcontent:undo", () => {
    wc().undo();
  });

  handle("webcontent:redo", () => {
    wc().redo();
  });

  handle("webcontent:cut", () => {
    wc().cut();
  });

  handle("webcontent:copy", () => {
    wc().copy();
  });

  handle("webcontent:paste", () => {
    wc().paste();
  });

  handle("webcontent:select-all", () => {
    wc().selectAll();
  });

  handle("webcontent:reload", () => {
    wc().reload();
  });

  handle("webcontent:force-reload", () => {
    wc().reloadIgnoringCache();
  });

  handle("webcontent:toggle-devtools", () => {
    wc().toggleDevTools();
  });

  handle("webcontent:zoom-in", () => {
    const current = wc().getZoomLevel();
    wc().setZoomLevel(current + 0.5);
  });

  handle("webcontent:zoom-out", () => {
    const current = wc().getZoomLevel();
    wc().setZoomLevel(current - 0.5);
  });

  handle("webcontent:zoom-reset", () => {
    wc().setZoomLevel(0);
  });

  handle("webcontent:open-url", async ({ url }) => {
    await shell.openExternal(url);
  });
}
