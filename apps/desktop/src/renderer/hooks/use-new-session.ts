import { useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useConveyor } from "@/hooks/use-conveyor";
import { useProjectStore } from "@/stores/project-store";
import { useProfileStore } from "@/stores/profile-store";

export function useNewSession() {
  const navigate = useNavigate();
  const dialog = useConveyor("dialog");
  const projects = useProjectStore((s) => s.projects);
  const addProject = useProjectStore((s) => s.addProject);
  const createSession = useProjectStore((s) => s.createSession);
  const expandProject = useProjectStore((s) => s.expandProject);
  const lastActiveProjectId = useProfileStore((s) => s.lastActiveProjectId);
  const setActiveSession = useProfileStore((s) => s.setActiveSession);

  return useCallback(async () => {
    let projectId = lastActiveProjectId;

    if (!projectId && projects.length > 0) {
      projectId = projects[0].id;
    }

    if (!projectId) {
      const { path } = await dialog.openDirectory();
      if (!path) return;
      const project = addProject(path);
      if (!project) return;
      projectId = project.id;
    }

    const session = createSession(projectId);
    setActiveSession(projectId, session.id);
    expandProject(projectId);
    navigate({
      to: "/projects/$projectId/$sessionId",
      params: { projectId, sessionId: session.id },
    });
  }, [
    lastActiveProjectId,
    projects,
    dialog,
    addProject,
    createSession,
    expandProject,
    setActiveSession,
    navigate,
  ]);
}
