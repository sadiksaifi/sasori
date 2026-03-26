import { Sidebar, PaperPlaneTilt, ArrowSquareOut } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar/sidebar-context";

export function Toolbar() {
  const { isOpen, toggleSidebar, toolbarToggleRef } = useSidebar();

  return (
    <header
      role="banner"
      className={cn(
        "flex h-toolbar shrink-0 items-center justify-between drag-region",
        !isOpen && "pl-[78px]",
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
            <Sidebar size={16} />
          </button>
        )}
        <span className="text-body text-secondary-label no-drag select-none">New Thread</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-related px-3">
        <button
          type="button"
          className="no-drag flex h-control items-center gap-related rounded-sm px-2 text-callout text-secondary-label transition-colors hover:bg-sidebar-hover"
        >
          <PaperPlaneTilt size={14} />
          Push
        </button>
        <button
          type="button"
          className="no-drag flex h-control items-center gap-related rounded-sm px-2 text-callout text-secondary-label transition-colors hover:bg-sidebar-hover"
        >
          <ArrowSquareOut size={14} />
          Open
        </button>
      </div>
    </header>
  );
}
