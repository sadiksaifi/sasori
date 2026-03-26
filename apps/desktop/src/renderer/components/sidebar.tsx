import { Link, useMatchRoute } from "@tanstack/react-router";
import { House, GearSix, type Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
  icon: Icon;
}

const navItems: NavItem[] = [
  { to: "/", label: "Home", icon: House },
  { to: "/settings", label: "Settings", icon: GearSix },
];

export function Sidebar() {
  const matchRoute = useMatchRoute();

  return (
    <aside className="flex w-sidebar shrink-0 flex-col bg-sidebar-background">
      {/* Traffic light drag region */}
      <div className="h-toolbar shrink-0 drag-region" />

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-related px-sidebar-section-x">
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
    </aside>
  );
}
