import type { Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface SidebarActionProps {
  label: string;
  icon: Icon;
  onClick: () => void;
  className?: string;
}

export function SidebarAction({
  label,
  icon: IconComponent,
  onClick,
  className,
}: SidebarActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-sidebar-item w-full items-center gap-item rounded-sm px-sidebar-item-x text-body text-secondary-label transition-colors duration-75 hover:bg-sidebar-hover",
        className,
      )}
    >
      <IconComponent size={16} />
      {label}
    </button>
  );
}
