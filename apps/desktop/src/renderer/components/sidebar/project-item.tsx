import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CaretRightIcon,
  DotsThreeIcon,
  FolderSimpleIcon,
  PencilSimpleIcon,
  PushPinIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useProjectStore, type Project, type Session } from "@/stores/project-store";
import { useProfileStore } from "@/stores/profile-store";
import { useContextMenu, type ContextMenuItem } from "@/hooks/use-context-menu";
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
  const removeProject = useProjectStore((s) => s.removeProject);
  const renameProject = useProjectStore((s) => s.renameProject);
  const pinProject = useProjectStore((s) => s.pinProject);
  const unpinProject = useProjectStore((s) => s.unpinProject);
  const archiveProject = useProjectStore((s) => s.archiveProject);
  const unarchiveProject = useProjectStore((s) => s.unarchiveProject);
  const renamingItemId = useProjectStore((s) => s.renamingItemId);
  const setRenamingItemId = useProjectStore((s) => s.setRenamingItemId);
  const setActiveProject = useProfileStore((s) => s.setActiveProject);
  const setActiveSession = useProfileStore((s) => s.setActiveSession);

  const showContextMenu = useContextMenu();
  const isRenaming = renamingItemId === project.id;
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingRename, setPendingRename] = useState(false);

  useEffect(() => {
    if (isRenaming) inputRef.current?.focus();
  }, [isRenaming]);

  const hasSessions = sessions.length > 0;
  const lastActiveSessionId = useProfileStore((s) => s.lastActiveSessionId);
  const hasActiveSession = sessions.some((s) => s.id === lastActiveSessionId);
  const showHighlight = isActive && !hasActiveSession;

  const handleClick = useCallback(() => {
    if (isRenaming) return;
    setActiveProject(project.id);
    if (hasSessions) {
      toggleProjectExpanded(project.id);
    }
  }, [isRenaming, hasSessions, toggleProjectExpanded, setActiveProject, project.id]);

  const handleNewSession = useCallback(
    async (e?: React.MouseEvent) => {
      e?.stopPropagation();
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

  const buildMenuItems = useCallback((): ContextMenuItem[] => {
    return [
      { id: "rename", label: "Rename" },
      { id: "new-session", label: "New Session" },
      { type: "separator" },
      { id: "pin", label: project.pinnedAt ? "Unpin" : "Pin" },
      { id: "archive", label: project.archivedAt ? "Unarchive" : "Archive" },
      { type: "separator" },
      { id: "copy-path", label: "Copy Path" },
      { type: "separator" },
      { id: "remove", label: "Remove Project" },
    ];
  }, [project.pinnedAt, project.archivedAt]);

  const handleAction = useCallback(
    async (actionId: string | null) => {
      if (!actionId) return;
      switch (actionId) {
        case "rename":
          setRenamingItemId(project.id);
          break;
        case "new-session":
          await handleNewSession();
          break;
        case "pin":
          if (project.pinnedAt) await unpinProject(project.id);
          else await pinProject(project.id);
          break;
        case "archive":
          if (project.archivedAt) await unarchiveProject(project.id);
          else await archiveProject(project.id);
          break;
        case "copy-path":
          await navigator.clipboard.writeText(project.path);
          break;
        case "remove": {
          const { confirmed } = await window.conveyor.dialog.confirm({
            message: "Remove Project?",
            detail: `"${project.name}" and all its sessions will be removed.`,
            confirmLabel: "Remove",
          });
          if (confirmed) await removeProject(project.id);
          break;
        }
      }
    },
    [
      project,
      setRenamingItemId,
      handleNewSession,
      pinProject,
      unpinProject,
      archiveProject,
      unarchiveProject,
      removeProject,
    ],
  );

  const handleContextMenu = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      const actionId = await showContextMenu(buildMenuItems());
      await handleAction(actionId);
    },
    [showContextMenu, buildMenuItems, handleAction],
  );

  const handleEllipsisClick = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      const actionId = await showContextMenu(buildMenuItems());
      await handleAction(actionId);
    },
    [showContextMenu, buildMenuItems, handleAction],
  );

  const commitRename = useCallback(
    (value: string) => {
      if (pendingRename) return;
      setPendingRename(true);
      const trimmed = value.trim();
      if (trimmed && trimmed !== project.name) {
        renameProject(project.id, trimmed);
      }
      setRenamingItemId(null);
      setPendingRename(false);
    },
    [project.id, project.name, renameProject, setRenamingItemId, pendingRename],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        commitRename(e.currentTarget.value);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setRenamingItemId(null);
      }
    },
    [commitRename, setRenamingItemId],
  );

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        onContextMenu={handleContextMenu}
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
        {project.pinnedAt && (
          <PushPinIcon size={12} className="shrink-0 text-tertiary-label" weight="fill" />
        )}
        <FolderSimpleIcon size={16} className="shrink-0" weight={isExpanded ? "fill" : "regular"} />
        {isRenaming ? (
          <input
            ref={inputRef}
            type="text"
            defaultValue={project.name}
            onClick={(e) => e.stopPropagation()}
            onBlur={(e) => commitRename(e.currentTarget.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 truncate rounded-xs bg-control-background px-1 text-left font-medium text-label outline-none ring-1 ring-focus-ring"
          />
        ) : (
          <span className="flex-1 truncate text-left font-medium">{project.name}</span>
        )}
        {!isRenaming && (
          <>
            <PencilSimpleIcon
              size={14}
              className="shrink-0 opacity-0 transition-opacity duration-75 hover:text-label group-hover:opacity-100"
              onClick={(e) => handleNewSession(e)}
            />
            <button
              type="button"
              onClick={handleEllipsisClick}
              className="shrink-0 rounded-xs opacity-0 transition-opacity duration-75 hover:text-label group-hover:opacity-100"
            >
              <DotsThreeIcon size={14} weight="bold" />
            </button>
          </>
        )}
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
