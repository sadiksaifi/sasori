import { useMemo } from "react";
import {
  useProjectStore,
  type Project,
  type Session,
  type SidebarFilter,
} from "@/stores/project-store";
import { useProfileStore } from "@/stores/profile-store";
import { ProjectItem } from "./project-item";

function sortWithPins<T extends { pinnedAt: string | null; createdAt: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    if (a.pinnedAt && !b.pinnedAt) return -1;
    if (!a.pinnedAt && b.pinnedAt) return 1;
    if (a.pinnedAt && b.pinnedAt) return b.pinnedAt.localeCompare(a.pinnedAt);
    return b.createdAt.localeCompare(a.createdAt);
  });
}

function hasPinnedBoundary<T extends { pinnedAt: string | null }>(items: T[]): number {
  const lastPinned = items.findLastIndex((item) => item.pinnedAt);
  return lastPinned !== -1 && lastPinned < items.length - 1 ? lastPinned : -1;
}

function filterProjects(
  projects: Project[],
  sessions: Session[],
  filter: SidebarFilter,
): { project: Project; sessions: Session[] }[] {
  const result: { project: Project; sessions: Session[] }[] = [];

  for (const project of projects) {
    const projectSessions = sessions.filter((s) => s.projectId === project.id);

    if (filter === "all") {
      result.push({ project, sessions: sortWithPins(projectSessions) });
      continue;
    }

    if (filter === "active") {
      if (!project.archivedAt) {
        const activeSessions = projectSessions.filter((s) => !s.archivedAt);
        result.push({ project, sessions: sortWithPins(activeSessions) });
      }
      continue;
    }

    // "archived" filter
    if (project.archivedAt) {
      result.push({ project, sessions: sortWithPins(projectSessions) });
    } else {
      const archivedSessions = projectSessions.filter((s) => s.archivedAt);
      if (archivedSessions.length > 0) {
        result.push({ project, sessions: sortWithPins(archivedSessions) });
      }
    }
  }

  return result;
}

export function ProjectTree() {
  const projects = useProjectStore((s) => s.projects);
  const sessions = useProjectStore((s) => s.sessions);
  const expandedProjectIds = useProjectStore((s) => s.expandedProjectIds);
  const lastActiveProjectId = useProfileStore((s) => s.lastActiveProjectId);
  const sidebarFilter = useProjectStore((s) => s.sidebarFilter);

  const sortedProjects = useMemo(() => sortWithPins(projects), [projects]);
  const projectBoundary = useMemo(() => hasPinnedBoundary(sortedProjects), [sortedProjects]);

  const filtered = useMemo(
    () => filterProjects(sortedProjects, sessions, sidebarFilter),
    [sortedProjects, sessions, sidebarFilter],
  );

  if (filtered.length === 0) {
    return (
      <div className="px-sidebar-section-x py-2">
        <p className="text-subheadline text-tertiary-label">
          {sidebarFilter === "archived"
            ? "No archived items."
            : "No projects yet. Click + to add one."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-sidebar-section-x py-1">
      {filtered.map(({ project, sessions: projectSessions }, index) => {
        const sortedIndex = sortedProjects.findIndex((p) => p.id === project.id);
        const showSeparator = projectBoundary !== -1 && sortedIndex === projectBoundary;

        return (
          <div key={project.id}>
            <ProjectItem
              project={project}
              sessions={projectSessions}
              isExpanded={expandedProjectIds.includes(project.id)}
              isActive={project.id === lastActiveProjectId}
            />
            {showSeparator && index < filtered.length - 1 && (
              <div className="mx-2 my-1 border-t border-separator" />
            )}
          </div>
        );
      })}
    </div>
  );
}
