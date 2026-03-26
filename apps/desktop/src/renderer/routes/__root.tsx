import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Sidebar } from "@/components/sidebar";
import { Titlebar } from "@/components/titlebar";
import { useElectronEvents } from "@/hooks/use-electron-events";
import { isDev } from "@repo/shared/env";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  useElectronEvents();

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar — transparent bg lets Electron vibrancy show through */}
      <Sidebar />

      {/* Separator line between sidebar and content */}
      <div className="w-px shrink-0 bg-opaque-separator" />

      {/* Main content — opaque background covers vibrancy */}
      <div className="flex flex-1 flex-col bg-background">
        <Titlebar />
        <main className="flex-1 overflow-auto p-window">
          <Outlet />
        </main>
      </div>
      {isDev && <TanStackRouterDevtools />}
    </div>
  );
}
