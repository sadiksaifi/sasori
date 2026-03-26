import { createFileRoute } from "@tanstack/react-router";
import { useProjectStore } from "@/stores/project-store";
import { useProfileStore } from "@/stores/profile-store";
import { useEffect } from "react";

export const Route = createFileRoute("/projects/$projectId/$sessionId")({
  component: SessionView,
});

function SessionView() {
  const { projectId, sessionId } = Route.useParams();
  const projects = useProjectStore((s) => s.projects);
  const sessions = useProjectStore((s) => s.sessions);
  const setActiveSession = useProfileStore((s) => s.setActiveSession);

  const project = projects.find((p) => p.id === projectId);
  const session = sessions.find((s) => s.id === sessionId);

  useEffect(() => {
    setActiveSession(projectId, sessionId);
  }, [projectId, sessionId, setActiveSession]);

  if (!project || !session) {
    return (
      <div className="flex flex-col gap-related">
        <h1 className="text-title-2 text-label">Not Found</h1>
        <p className="text-body text-secondary-label">This session does not exist.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-related">
      <h1 className="text-title-2 text-label">{session.title}</h1>
      <p className="text-body text-secondary-label">
        Project: {project.name} &middot; {project.path}
      </p>
    </div>
  );
}
