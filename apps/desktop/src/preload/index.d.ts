import type { Conveyor } from "../conveyor/api";

declare global {
  interface Window {
    conveyor: Conveyor;
    electron: {
      onNavigate: (callback: (path: string) => void) => void;
    };
    __ELECTRON_PLATFORM__: NodeJS.Platform;
  }
}
