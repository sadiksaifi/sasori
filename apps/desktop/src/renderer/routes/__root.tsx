import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Link, useMatchRoute } from "@tanstack/react-router";
import {
  House,
  MagnifyingGlass,
  Sparkle,
  FolderSimple,
  GearSix,
  SidebarSimple,
  type Icon,
} from "@phosphor-icons/react";
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

export const Route = createRootRoute({
  component: RootLayout,
});

interface NavItem {
  to: string;
  label: string;
  icon: Icon;
}

const topNavItems: NavItem[] = [
  { to: "/", label: "Home", icon: House },
  { to: "/search", label: "Search", icon: MagnifyingGlass },
  { to: "/skills", label: "Skills", icon: Sparkle },
];

const threadItems = Array.from({ length: 18 }, (_, i) => ({
  id: `thread-${i + 1}`,
  label: `Thread ${i + 1}`,
}));

function RootLayout() {
  return (
    <SidebarProvider>
      <RootLayoutInner />
    </SidebarProvider>
  );
}

function RootLayoutInner() {
  useElectronEvents();
  const { sidebarIconHidden, toggleSidebar, panelRef, panelElementRef } = useSidebar();

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel
          id="sidebar"
          panelRef={panelRef}
          elementRef={panelElementRef}
          defaultSize="280px"
          minSize="250px"
          maxSize="360px"
          collapsible
          collapsedSize={0}
        >
          <Sidebar>
            <SidebarHeader>
              <div className="flex h-toolbar items-center justify-end px-2 drag-region">
                <button
                  type="button"
                  aria-label="Toggle Sidebar"
                  onClick={toggleSidebar}
                  className={cn(
                    "no-drag flex h-sidebar-item w-sidebar-item items-center justify-center rounded-sm text-secondary-label transition-all duration-100 hover:bg-sidebar-hover",
                    sidebarIconHidden && "-translate-x-1 opacity-0",
                  )}
                >
                  <SidebarSimple size={16} />
                </button>
              </div>
              <nav className="flex flex-col gap-related px-sidebar-section-x pb-2">
                {topNavItems.map((item) => (
                  <SidebarLink key={item.to} item={item} />
                ))}
              </nav>
            </SidebarHeader>
            <SidebarFixedItem>
              <div className="px-sidebar-section-x py-1">
                <span className="text-subheadline font-medium text-secondary-label">Threads</span>
              </div>
            </SidebarFixedItem>
            <SidebarContent>
              <div className="flex flex-col gap-related px-sidebar-section-x py-1">
                {threadItems.map((thread) => (
                  <div
                    key={thread.id}
                    className="flex h-sidebar-item items-center gap-item rounded-sm px-sidebar-item-x text-body text-secondary-label transition-colors duration-75 hover:bg-sidebar-hover"
                  >
                    <FolderSimple size={16} />
                    {thread.label}
                  </div>
                ))}
              </div>
            </SidebarContent>
            <SidebarFooter>
              <div className="border-t border-separator px-sidebar-section-x py-2">
                <SidebarLink item={{ to: "/settings", label: "Settings", icon: GearSix }} />
              </div>
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
    </div>
  );
}

function SidebarLink({ item }: { item: NavItem }) {
  const matchRoute = useMatchRoute();
  const isActive = !!matchRoute({ to: item.to, fuzzy: item.to !== "/" });
  const IconComponent = item.icon;

  return (
    <Link
      to={item.to}
      className={cn(
        "flex h-sidebar-item items-center gap-item rounded-sm px-sidebar-item-x text-body transition-colors duration-75",
        isActive
          ? "bg-sidebar-selected font-medium text-label"
          : "text-secondary-label hover:bg-sidebar-hover",
      )}
    >
      <IconComponent size={16} weight="regular" />
      {item.label}
    </Link>
  );
}
