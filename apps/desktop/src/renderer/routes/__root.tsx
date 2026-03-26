import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { House, GearSix, SidebarSimple, type Icon } from "@phosphor-icons/react";
import {
  SidebarProvider,
  useSidebar,
  Sidebar,
  SidebarHeader,
  SidebarFixedItem,
  SidebarContent,
  SidebarFooter,
} from "@/components/sidebar";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Toolbar } from "@/components/toolbar";
import { useElectronEvents } from "@/hooks/use-electron-events";
import { cn } from "@/lib/utils";
import { isDev } from "@repo/shared/env";

export const Route = createRootRoute({
  component: RootLayout,
});

interface NavItem {
  to: string;
  label: string;
  icon: Icon;
}

const navItems: NavItem[] = [
  { to: "/", label: "Home", icon: House },
  { to: "/settings", label: "Settings", icon: GearSix },
];

function RootLayout() {
  return (
    <SidebarProvider>
      <RootLayoutInner />
    </SidebarProvider>
  );
}

function RootLayoutInner() {
  useElectronEvents();
  const { isOpen, toggleSidebar, panelRef, setIsOpen } = useSidebar();

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel
          id="sidebar"
          panelRef={panelRef}
          defaultSize="240px"
          minSize="180px"
          maxSize="360px"
          collapsible
          collapsedSize={0}
          onResize={(size) => {
            const collapsed = size.inPixels === 0;
            if (collapsed && isOpen) setIsOpen(false);
            if (!collapsed && !isOpen) setIsOpen(true);
          }}
        >
          <Sidebar>
            <SidebarHeader>
              <div className="flex h-toolbar items-center justify-end px-2 drag-region">
                <button
                  type="button"
                  aria-label="Toggle Sidebar"
                  onClick={toggleSidebar}
                  className="no-drag flex h-sidebar-item w-sidebar-item items-center justify-center rounded-sm text-secondary-label transition-colors hover:bg-sidebar-hover"
                >
                  <SidebarSimple size={16} />
                </button>
              </div>
            </SidebarHeader>
            <SidebarFixedItem>
              <div className="px-sidebar-section-x" />
            </SidebarFixedItem>
            <SidebarContent>
              <SidebarNav />
            </SidebarContent>
            <SidebarFooter>
              <div className="px-sidebar-section-x py-2" />
            </SidebarFooter>
          </Sidebar>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel id="content" defaultSize="100%">
          <div className="flex h-full flex-1 flex-col bg-background">
            <Toolbar />
            <main className="flex-1 overflow-auto p-window">
              <Outlet />
            </main>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      {isDev && <TanStackRouterDevtools />}
    </div>
  );
}

function SidebarNav() {
  const matchRoute = useMatchRoute();

  return (
    <nav className="flex flex-col gap-related px-sidebar-section-x">
      {navItems.map((item) => {
        const isActive = !!matchRoute({ to: item.to, fuzzy: item.to !== "/" });
        const IconComponent = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex h-sidebar-item items-center gap-item rounded-sm px-sidebar-item-x text-body transition-colors duration-75",
              isActive
                ? "bg-sidebar-selected font-medium text-label"
                : "text-secondary-label hover:bg-sidebar-hover",
            )}
          >
            <IconComponent size={16} weight={isActive ? "fill" : "regular"} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
