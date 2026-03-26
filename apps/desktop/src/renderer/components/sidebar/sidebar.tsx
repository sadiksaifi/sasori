import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Sidebar({ className, ...props }: ComponentProps<"aside">) {
  return (
    <aside
      className={cn("flex h-full flex-col overflow-hidden bg-sidebar-background", className)}
      {...props}
    />
  );
}

export function SidebarHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("shrink-0", className)} {...props} />;
}

export function SidebarFixedItem({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("shrink-0", className)} {...props} />;
}

export function SidebarContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex-1 overflow-y-auto", className)} {...props} />;
}

export function SidebarFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("shrink-0", className)} {...props} />;
}
