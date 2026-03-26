import type { App } from "electron";
import { handle } from "../../main/shared";

export function registerAppHandlers(app: App): void {
  handle("app:version", () => app.getVersion());
}
