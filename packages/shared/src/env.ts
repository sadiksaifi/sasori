// Environment — works in all electron-vite contexts (main, preload, renderer)
// Use type assertion to avoid requiring Vite types in this package
const meta = (import.meta as unknown as Record<string, unknown>).env as
  | { DEV: boolean; PROD: boolean }
  | undefined;

export const isDev: boolean = meta?.DEV ?? process.env.NODE_ENV === "development";
export const isProd: boolean = meta?.PROD ?? process.env.NODE_ENV === "production";

// Platform — resolves from process (main/preload) or preload-exposed global (renderer)
export const platform: NodeJS.Platform =
  typeof process !== "undefined" && process.platform
    ? process.platform
    : ((globalThis as Record<string, unknown>).__ELECTRON_PLATFORM__ as NodeJS.Platform) ??
      "darwin";

export const isMac: boolean = platform === "darwin";
export const isWindows: boolean = platform === "win32";
export const isLinux: boolean = platform === "linux";
