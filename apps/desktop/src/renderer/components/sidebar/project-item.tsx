import { useCallback } from "react";
import { CaretRightIcon, FolderSimpleIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useProjectStore, type Project, type Session } from "@/stores/project-store";
import { SessionItem } from "./session-item";

interface ProjectItemProps {
  project: Project;
  sessions: Session[];
  isExpanded: boolean;
}

export function ProjectItem({ project, sessions, isExpanded }: ProjectItemProps) {
  const toggleProjectExpanded = useProjectStore((s) => s.toggleProjectExpanded);
  const hasSessions = sessions.length > 0;

  const handleToggle = useCallback(() => {
    if (hasSessions) {
      toggleProjectExpanded(project.id);
    }
  }, [hasSessions, toggleProjectExpanded, project.id]);

  return (
    <div>
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          "flex h-sidebar-item w-full items-center gap-item px-sidebar-item-x text-body text-secondary-label transition-colors duration-75",
          hasSessions ? "cursor-pointer hover:bg-sidebar-hover" : "cursor-default",
        )}
      >
        <CaretRightIcon
          size={12}
          className={cn(
            "shrink-0 transition-transform duration-150",
            isExpanded && "rotate-90",
            !hasSessions && "opacity-0",
          )}
        />
        <FolderSimpleIcon size={16} className="shrink-0" weight={isExpanded ? "fill" : "regular"} />
        <span className="truncate font-medium">{project.name}</span>
      </button>
      {isExpanded && hasSessions && (
        <div className="flex flex-col">
          {sessions.map((session) => (
            <SessionItem key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}
