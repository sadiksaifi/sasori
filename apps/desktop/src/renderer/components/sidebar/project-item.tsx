import { useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CaretRightIcon, FolderSimpleIcon, PencilSimpleIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useProjectStore, type Project, type Session } from "@/stores/project-store";
import { useProfileStore } from "@/stores/profile-store";
import { SessionItem } from "./session-item";

interface ProjectItemProps {
  project: Project;
  sessions: Session[];
  isExpanded: boolean;
  isActive: boolean;
}

export function ProjectItem({ project, sessions, isExpanded, isActive }: ProjectItemProps) {
  const navigate = useNavigate();
  const toggleProjectExpanded = useProjectStore((s) => s.toggleProjectExpanded);
  const createSession = useProjectStore((s) => s.createSession);
  const expandProject = useProjectStore((s) => s.expandProject);
  const setActiveProject = useProfileStore((s) => s.setActiveProject);
  const setActiveSession = useProfileStore((s) => s.setActiveSession);
  const hasSessions = sessions.length > 0;

  const lastActiveSessionId = useProfileStore((s) => s.lastActiveSessionId);
  const hasActiveSession = sessions.some((s) => s.id === lastActiveSessionId);
  const showHighlight = isActive && !hasActiveSession;

  const handleClick = useCallback(() => {
    setActiveProject(project.id);
    if (hasSessions) {
      toggleProjectExpanded(project.id);
    }
  }, [hasSessions, toggleProjectExpanded, setActiveProject, project.id]);

  const handleNewSession = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      const session = await createSession(project.id);
      setActiveSession(project.id, session.id);
      expandProject(project.id);
      navigate({
        to: "/projects/$projectId/$sessionId",
        params: { projectId: project.id, sessionId: session.id },
      });
    },
    [createSession, setActiveSession, expandProject, navigate, project.id],
  );

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "group flex h-sidebar-item w-full items-center gap-item px-sidebar-item-x text-body text-secondary-label transition-colors duration-75",
          showHighlight ? "bg-sidebar-selected" : "hover:bg-sidebar-hover",
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
        <span className="flex-1 truncate text-left font-medium">{project.name}</span>
        <PencilSimpleIcon
          size={14}
          className="shrink-0 opacity-0 transition-opacity duration-75 hover:text-label group-hover:opacity-100"
          onClick={handleNewSession}
        />
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
