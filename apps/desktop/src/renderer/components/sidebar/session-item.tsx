import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { DotsThreeIcon, PushPinIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useProjectStore, type Session } from "@/stores/project-store";
import { useContextMenu, type ContextMenuItem } from "@/hooks/use-context-menu";
import { relativeTime } from "@/lib/relative-time";

interface SessionItemProps {
  session: Session;
}

export function SessionItem({ session }: SessionItemProps) {
  const matchRoute = useMatchRoute();
  const isActive = !!matchRoute({
    to: "/projects/$projectId/$sessionId",
    params: { projectId: session.projectId, sessionId: session.id },
  });

  const showContextMenu = useContextMenu();
  const renameSession = useProjectStore((s) => s.renameSession);
  const deleteSession = useProjectStore((s) => s.deleteSession);
  const pinSession = useProjectStore((s) => s.pinSession);
  const unpinSession = useProjectStore((s) => s.unpinSession);
  const archiveSession = useProjectStore((s) => s.archiveSession);
  const unarchiveSession = useProjectStore((s) => s.unarchiveSession);
  const renamingItemId = useProjectStore((s) => s.renamingItemId);
  const setRenamingItemId = useProjectStore((s) => s.setRenamingItemId);

  const isRenaming = renamingItemId === session.id;
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingRename, setPendingRename] = useState(false);

  useEffect(() => {
    if (isRenaming) inputRef.current?.focus();
  }, [isRenaming]);

  const buildMenuItems = useCallback((): ContextMenuItem[] => {
    return [
      { id: "rename", label: "Rename" },
      { id: "pin", label: session.pinnedAt ? "Unpin" : "Pin" },
      { id: "archive", label: session.archivedAt ? "Unarchive" : "Archive" },
      { type: "separator" },
      { id: "copy-title", label: "Copy Title" },
      { type: "separator" },
      { id: "delete", label: "Delete" },
    ];
  }, [session.pinnedAt, session.archivedAt]);

  const handleAction = useCallback(
    async (actionId: string | null) => {
      if (!actionId) return;
      switch (actionId) {
        case "rename":
          setRenamingItemId(session.id);
          break;
        case "pin":
          if (session.pinnedAt) await unpinSession(session.id);
          else await pinSession(session.id);
          break;
        case "archive":
          if (session.archivedAt) await unarchiveSession(session.id);
          else await archiveSession(session.id);
          break;
        case "copy-title":
          await navigator.clipboard.writeText(session.title);
          break;
        case "delete": {
          const { confirmed } = await window.conveyor.dialog.confirm({
            message: "Delete Session?",
            detail: `"${session.title}" will be permanently deleted.`,
            confirmLabel: "Delete",
          });
          if (confirmed) await deleteSession(session.id);
          break;
        }
      }
    },
    [
      session,
      setRenamingItemId,
      pinSession,
      unpinSession,
      archiveSession,
      unarchiveSession,
      deleteSession,
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
      e.preventDefault();
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
      if (trimmed && trimmed !== session.title) {
        renameSession(session.id, trimmed);
      }
      setRenamingItemId(null);
      setPendingRename(false);
    },
    [session.id, session.title, renameSession, setRenamingItemId, pendingRename],
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

  const handleLinkClick = useCallback(
    (e: React.MouseEvent) => {
      if (isRenaming) {
        e.preventDefault();
      }
    },
    [isRenaming],
  );

  return (
    <Link
      to="/projects/$projectId/$sessionId"
      params={{ projectId: session.projectId, sessionId: session.id }}
      onClick={handleLinkClick}
      onContextMenu={handleContextMenu}
      className={cn(
        "group flex h-sidebar-item items-center rounded-sm px-sidebar-item-x text-body transition-colors duration-75",
        isActive
          ? "bg-sidebar-selected font-medium text-label"
          : "text-secondary-label hover:bg-sidebar-hover",
      )}
    >
      <span className="flex flex-1 items-center gap-1 truncate pl-6">
        {session.pinnedAt && (
          <PushPinIcon size={12} className="shrink-0 text-tertiary-label" weight="fill" />
        )}
        {isRenaming ? (
          <input
            ref={inputRef}
            type="text"
            defaultValue={session.title}
            onBlur={(e) => commitRename(e.currentTarget.value)}
            onKeyDown={handleKeyDown}
            className="w-full rounded-xs bg-control-background px-1 text-body text-label outline-none ring-1 ring-focus-ring"
          />
        ) : (
          <span className="truncate">{session.title}</span>
        )}
      </span>
      {!isRenaming && (
        <>
          <span className="shrink-0 pl-2 text-footnote text-tertiary-label group-hover:hidden">
            {relativeTime(session.createdAt)}
          </span>
          <button
            type="button"
            onClick={handleEllipsisClick}
            className="hidden shrink-0 rounded-xs p-0.5 text-secondary-label hover:text-label group-hover:flex"
          >
            <DotsThreeIcon size={14} weight="bold" />
          </button>
        </>
      )}
    </Link>
  );
}
