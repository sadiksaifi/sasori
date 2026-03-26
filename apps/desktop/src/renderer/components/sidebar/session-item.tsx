import { Link, useMatchRoute } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { relativeTime } from "@/lib/relative-time";
import type { Session } from "@/stores/project-store";

interface SessionItemProps {
  session: Session;
}

export function SessionItem({ session }: SessionItemProps) {
  const matchRoute = useMatchRoute();
  const isActive = !!matchRoute({
    to: "/projects/$projectId/$sessionId",
    params: { projectId: session.projectId, sessionId: session.id },
  });

  return (
    <Link
      to="/projects/$projectId/$sessionId"
      params={{ projectId: session.projectId, sessionId: session.id }}
      className={cn(
        "flex h-sidebar-item items-center rounded-sm px-sidebar-item-x text-body transition-colors duration-75",
        isActive
          ? "bg-sidebar-selected font-medium text-label"
          : "text-secondary-label hover:bg-sidebar-hover",
      )}
    >
      <span className="flex-1 truncate pl-6">{session.title}</span>
      <span className="shrink-0 pl-2 text-footnote text-tertiary-label">
        {relativeTime(session.createdAt)}
      </span>
    </Link>
  );
}
