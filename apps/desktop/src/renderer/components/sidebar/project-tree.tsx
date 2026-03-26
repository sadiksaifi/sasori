import { useProjectStore } from "@/stores/project-store";
import { ProjectItem } from "./project-item";

export function ProjectTree() {
  const projects = useProjectStore((s) => s.projects);
  const sessions = useProjectStore((s) => s.sessions);
  const expandedProjectIds = useProjectStore((s) => s.expandedProjectIds);

  if (projects.length === 0) {
    return (
      <div className="px-sidebar-section-x py-2">
        <p className="text-subheadline text-tertiary-label">No projects yet. Click + to add one.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-sidebar-section-x py-1">
      {projects.map((project) => (
        <ProjectItem
          key={project.id}
          project={project}
          sessions={sessions.filter((s) => s.projectId === project.id)}
          isExpanded={expandedProjectIds.includes(project.id)}
        />
      ))}
    </div>
  );
}
