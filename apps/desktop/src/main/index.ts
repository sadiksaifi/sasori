import { app, BrowserWindow } from "electron";
import { join } from "node:path";
import { registerAllHandlers } from "../conveyor/handlers";
import { createApplicationMenu } from "./menu";

// Set app name before anything else — Electron defaults to package.json "name"
app.name = "Sasori";

function createWindow(): BrowserWindow {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    show: false,
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 16, y: 18 },
    vibrancy: "sidebar",
    visualEffectState: "active",
    transparent: true,
    backgroundColor: "#00000000",
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  mainWindow.on("ready-to-show", () => mainWindow.show());

  registerAllHandlers(mainWindow, app);
  createApplicationMenu(mainWindow);

  if (!app.isPackaged && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  return mainWindow;
}

app.whenReady().then(() => {
  app.setAboutPanelOptions({
    applicationName: "Sasori",
    applicationVersion: app.getVersion(),
    version: "", // hides build number line
    copyright: "Copyright © 2026 Sadik Saifi",
    credits: "Multi-model AI coding agent harness",
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
