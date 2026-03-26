import { Link, useMatchRoute } from "@tanstack/react-router";
import type { Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export interface NavItem {
  to: string;
  label: string;
  icon: Icon;
}

export function SidebarLink({ item }: { item: NavItem }) {
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
      <IconComponent size={16} weight={isActive ? "fill" : "regular"} />
      {item.label}
    </Link>
  );
}
