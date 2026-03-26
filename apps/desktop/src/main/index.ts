import { app, BrowserWindow, session } from "electron";
import { join } from "node:path";
import { registerAllHandlers } from "../conveyor/handlers";
import { closeDatabase, initDatabase } from "../database";
import { createApplicationMenu } from "./menu";

const ALLOWED_WEBVIEW_ORIGIN = "https://skills.sh";

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
      webviewTag: true,
    },
  });

  // Security: restrict webview creation to allowed origins only
  mainWindow.webContents.on("will-attach-webview", (event, webPreferences, params) => {
    delete webPreferences.preload;
    webPreferences.nodeIntegration = false;
    webPreferences.contextIsolation = true;

    if (!params.src.startsWith(ALLOWED_WEBVIEW_ORIGIN)) {
      event.preventDefault();
    }
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
  initDatabase();

  app.setAboutPanelOptions({
    applicationName: "Sasori",
    applicationVersion: app.getVersion(),
    version: "", // hides build number line
    copyright: "Copyright © 2026 Sadik Saifi",
    credits: "Multi-model AI coding agent harness",
  });

  // Pre-warm the skills webview session and preconnect for faster first load
  const skillsSession = session.fromPartition("persist:skills");
  skillsSession.preconnect({ url: ALLOWED_WEBVIEW_ORIGIN, numSockets: 2 });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("quit", () => {
  closeDatabase();
});
