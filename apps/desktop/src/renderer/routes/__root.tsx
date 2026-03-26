import { createRootRoute, Outlet } from "@tanstack/react-router";
import {
  ChatDotsIcon,
  MagnifyingGlassIcon,
  SparkleIcon,
  FolderPlusIcon,
  GearSixIcon,
  SidebarSimpleIcon,
} from "@phosphor-icons/react";
import {
  SidebarProvider,
  useSidebar,
  PANEL_SLIDE_MS,
  Sidebar,
  SidebarHeader,
  SidebarFixedItem,
  SidebarContent,
  SidebarFooter,
  SidebarLink,
  SidebarAction,
  ProjectTree,
  type NavItem,
} from "@/components/sidebar";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Toolbar } from "@/components/toolbar";
import { useElectronEvents } from "@/hooks/use-electron-events";
import { useNewSession } from "@/hooks/use-new-session";
import { useConveyor } from "@/hooks/use-conveyor";
import { useProjectStore } from "@/stores/project-store";
import { useProfileStore } from "@/stores/profile-store";
import { cn } from "@/lib/utils";
import { useCallback, useEffect } from "react";

export const Route = createRootRoute({
  component: RootLayout,
});

const navItems: NavItem[] = [
  { to: "/search", label: "Search", icon: MagnifyingGlassIcon },
  { to: "/skills", label: "Skills", icon: SparkleIcon },
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
  const {
    sidebarIconHidden,
    transitionIcon,
    toggleSidebar,
    panelRef,
    panelElementRef,
    sidebarToggleRef,
  } = useSidebar();

  useEffect(() => {
    useProjectStore.getState().hydrate();
    useProfileStore.getState().hydrate();
  }, []);

  const handleNewSession = useNewSession();
  const dialog = useConveyor("dialog");
  const addProject = useProjectStore((s) => s.addProject);

  const handleAddProject = useCallback(async () => {
    const { path } = await dialog.openDirectory();
    if (!path) return;
    await addProject(path);
  }, [dialog, addProject]);

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
                  ref={sidebarToggleRef}
                  type="button"
                  aria-label="Toggle Sidebar"
                  onClick={toggleSidebar}
                  className={cn(
                    "no-drag flex h-sidebar-item w-sidebar-item items-center justify-center rounded-sm text-secondary-label hover:bg-sidebar-hover",
                    sidebarIconHidden ? "invisible" : "",
                  )}
                >
                  <SidebarSimpleIcon size={16} />
                </button>
              </div>
              <nav className="flex flex-col gap-related px-sidebar-section-x pb-2">
                <SidebarAction label="New Session" icon={ChatDotsIcon} onClick={handleNewSession} />
                {navItems.map((item) => (
                  <SidebarLink key={item.to} item={item} />
                ))}
              </nav>
            </SidebarHeader>
            <SidebarFixedItem>
              <div className="flex items-center justify-between px-sidebar-section-x py-1">
                <span className="text-subheadline font-medium text-secondary-label">Projects</span>
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="rounded-xs p-0.5 text-tertiary-label transition-colors hover:text-secondary-label"
                  aria-label="Add project"
                >
                  <FolderPlusIcon size={14} />
                </button>
              </div>
            </SidebarFixedItem>
            <SidebarContent>
              <ProjectTree />
            </SidebarContent>
            <SidebarFooter>
              <div className="border-t border-separator px-sidebar-section-x py-2">
                <SidebarLink item={{ to: "/settings", label: "Settings", icon: GearSixIcon }} />
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

      {/* Floating icon that animates between sidebar and toolbar positions */}
      {transitionIcon && (
        <div
          className="pointer-events-none fixed z-50 flex h-sidebar-item w-sidebar-item items-center justify-center text-secondary-label"
          style={{
            left: transitionIcon.animating ? transitionIcon.targetX : transitionIcon.x,
            top: transitionIcon.animating ? transitionIcon.targetY : transitionIcon.y,
            transition: transitionIcon.animating
              ? `left ${PANEL_SLIDE_MS}ms ease-in-out, top ${PANEL_SLIDE_MS}ms ease-in-out`
              : "none",
          }}
        >
          <SidebarSimpleIcon size={16} />
        </div>
      )}
    </div>
  );
}
