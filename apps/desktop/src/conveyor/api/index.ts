import type { ElectronAPI } from "./base";
import { AppApi } from "./app-api";
import { DialogApi } from "./dialog-api";
import { WindowApi } from "./window-api";
import { WebContentApi } from "./webcontent-api";

export type { ElectronAPI } from "./base";

export function createConveyor(electronAPI: ElectronAPI) {
  return {
    app: new AppApi(electronAPI),
    dialog: new DialogApi(electronAPI),
    window: new WindowApi(electronAPI),
    webcontent: new WebContentApi(electronAPI),
  };
}

export type Conveyor = ReturnType<typeof createConveyor>;
