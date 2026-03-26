import type { ComponentProps } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { cn } from "@/lib/utils";

type ResizablePanelGroupProps = ComponentProps<typeof Group>;

export function ResizablePanelGroup({ className, ...props }: ResizablePanelGroupProps) {
  return <Group className={cn("flex h-full w-full", className)} {...props} />;
}

export const ResizablePanel = Panel;

type ResizableHandleProps = ComponentProps<typeof Separator>;

export function ResizableHandle({ className, ...props }: ResizableHandleProps) {
  return (
    <Separator
      className={cn("w-px shrink-0 bg-opaque-separator transition-colors", className)}
      {...props}
    />
  );
}
