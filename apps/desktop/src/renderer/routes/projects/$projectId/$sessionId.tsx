import { createFileRoute } from "@tanstack/react-router";
import { useProjectStore } from "@/stores/project-store";
import { useProfileStore } from "@/stores/profile-store";
import { useEffect } from "react";
import { ChatView } from "@/components/chat";

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
      <div className="flex-1 overflow-auto p-window">
        <div className="flex flex-col gap-related">
          <h1 className="text-title-2 text-label">Not Found</h1>
          <p className="text-body text-secondary-label">This session does not exist.</p>
        </div>
      </div>
    );
  }

  return <ChatView project={project} session={session} />;
}
