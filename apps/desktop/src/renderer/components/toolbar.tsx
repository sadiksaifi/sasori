import { SidebarIcon, PaperPlaneTiltIcon, ArrowSquareOutIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useSidebar, TRAFFIC_LIGHT_ZONE } from "./sidebar/sidebar-context";
import { useNewSession } from "@/hooks/use-new-session";

export function Toolbar() {
  const { isOpen, toolbarInset, toggleSidebar, toolbarToggleRef } = useSidebar();
  const handleNewSession = useNewSession();

  return (
    <header
      role="banner"
      className={cn(
        "flex border-b h-toolbar shrink-0 items-center justify-between px-3 drag-region transition-[padding-left] duration-200 ease-in-out",
        toolbarInset && `pl-[${TRAFFIC_LIGHT_ZONE}px]`,
      )}
    >
      {/* Left */}
      <div className="flex items-center gap-item">
        {!isOpen && (
          <button
            ref={toolbarToggleRef}
            type="button"
            aria-label="Toggle Sidebar"
            onClick={toggleSidebar}
            className="no-drag flex h-sidebar-item w-sidebar-item items-center justify-center rounded-sm text-secondary-label transition-colors hover:bg-sidebar-hover"
          >
            <SidebarIcon size={16} />
          </button>
        )}
        <button
          type="button"
          onClick={handleNewSession}
          className="text-body text-secondary-label no-drag select-none transition-colors hover:text-label"
        >
          New Session
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-related px-3">
        <button
          type="button"
          className="no-drag flex h-control items-center gap-related rounded-sm px-2 text-callout text-secondary-label transition-colors hover:bg-sidebar-hover"
        >
          <PaperPlaneTiltIcon size={14} />
          Push
        </button>
        <button
          type="button"
          className="no-drag flex h-control items-center gap-related rounded-sm px-2 text-callout text-secondary-label transition-colors hover:bg-sidebar-hover"
        >
          <ArrowSquareOutIcon size={14} />
          Open
        </button>
      </div>
    </header>
  );
}
