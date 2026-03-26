import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/search")({
  component: Search,
});

function Search() {
  return (
    <div className="flex flex-col gap-related">
      <h1 className="text-title-2 text-label">Search</h1>
      <p className="text-body text-secondary-label">Search across projects and sessions.</p>
    </div>
  );
}
