import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/skills")({
  component: Skills,
});

function Skills() {
  return (
    <div className="flex flex-col gap-related">
      <h1 className="text-title-2 text-label">Skills</h1>
      <p className="text-body text-secondary-label">Manage your skills.</p>
    </div>
  );
}
