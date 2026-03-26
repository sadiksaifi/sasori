import { contextBridge, ipcRenderer } from "electron";
import type { ChannelName, ChannelArgs, ChannelReturn } from "../conveyor/schemas";

function invoke<T extends ChannelName>(
  channel: T,
  ...args: ChannelArgs<T> extends Record<string, never> ? [] : [ChannelArgs<T>]
): Promise<ChannelReturn<T>> {
  return ipcRenderer.invoke(channel, ...args) as Promise<ChannelReturn<T>>;
}

const conveyor = {
  app: {
    version: () => invoke("app:version"),
  },
  window: {
    init: () => invoke("window:init"),
    minimize: () => invoke("window:minimize"),
    maximize: () => invoke("window:maximize"),
    maximizeToggle: () => invoke("window:maximize-toggle"),
    close: () => invoke("window:close"),
    isMaximized: () => invoke("window:is-maximized"),
    isFullscreen: () => invoke("window:is-fullscreen"),
    toggleFullscreen: () => invoke("window:toggle-fullscreen"),
  },
  webcontent: {
    undo: () => invoke("webcontent:undo"),
    redo: () => invoke("webcontent:redo"),
    cut: () => invoke("webcontent:cut"),
    copy: () => invoke("webcontent:copy"),
    paste: () => invoke("webcontent:paste"),
    selectAll: () => invoke("webcontent:select-all"),
    reload: () => invoke("webcontent:reload"),
    forceReload: () => invoke("webcontent:force-reload"),
    toggleDevtools: () => invoke("webcontent:toggle-devtools"),
    zoomIn: () => invoke("webcontent:zoom-in"),
    zoomOut: () => invoke("webcontent:zoom-out"),
    zoomReset: () => invoke("webcontent:zoom-reset"),
    openUrl: (args: { url: string }) => invoke("webcontent:open-url", args),
  },
};

const electron = {
  onNavigate: (callback: (path: string) => void) => {
    ipcRenderer.on("navigate", (_event, path: string) => callback(path));
  },
  onToggleSidebar: (callback: () => void) => {
    ipcRenderer.on("toggle-sidebar", () => callback());
  },
};

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld("conveyor", conveyor);
  contextBridge.exposeInMainWorld("electron", electron);
  contextBridge.exposeInMainWorld("__ELECTRON_PLATFORM__", process.platform);
} else {
  const g = globalThis as Record<string, unknown>;
  g.conveyor = conveyor;
  g.electron = electron;
  g.__ELECTRON_PLATFORM__ = process.platform;
}
