import { SidebarSimple } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar/sidebar-context";

export function Toolbar() {
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <header
      role="banner"
      className={cn(
        "flex h-toolbar shrink-0 items-center drag-region",
        !isOpen && "pl-[78px]",
      )}
    >
      {!isOpen && (
        <button
          type="button"
          aria-label="Toggle Sidebar"
          onClick={toggleSidebar}
          className="no-drag flex h-sidebar-item w-sidebar-item items-center justify-center rounded-sm text-secondary-label transition-colors hover:bg-sidebar-hover"
        >
          <SidebarSimple size={16} />
        </button>
      )}
    </header>
  );
}
