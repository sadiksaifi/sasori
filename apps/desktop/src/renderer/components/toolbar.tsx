import { SidebarIcon, PaperPlaneTiltIcon, ArrowSquareOutIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useSidebar, TRAFFIC_LIGHT_ZONE } from "./sidebar/sidebar-context";
import { useNewSession } from "@/hooks/use-new-session";
import { useToolbarStore, type ToolbarAction } from "@/stores/toolbar-store";

export function Toolbar() {
  const { isOpen, toolbarInset, toggleSidebar, toolbarToggleRef } = useSidebar();
  const handleNewSession = useNewSession();
  const config = useToolbarStore((s) => s.config);

  const title = config?.title ?? "New Session";
  const onTitleClick = config?.onTitleClick ?? handleNewSession;
  const actions: ToolbarAction[] = config?.actions ?? [
    { key: "push", label: "Push", icon: PaperPlaneTiltIcon },
    { key: "open", label: "Open", icon: ArrowSquareOutIcon },
  ];

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
          onClick={onTitleClick}
          className="text-body text-secondary-label no-drag select-none transition-colors hover:text-label"
        >
          {title}
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-related px-3">
        {actions.map((action) => (
          <button
            key={action.key}
            type="button"
            onClick={action.onClick}
            className="no-drag flex h-control-lg items-center gap-2.5 rounded-sm border border-separator bg-control-background px-3 text-callout text-secondary-label transition-colors hover:brightness-110 active:brightness-95"
          >
            <action.icon size={14} />
            {action.label}
          </button>
        ))}
      </div>
    </header>
  );
}
