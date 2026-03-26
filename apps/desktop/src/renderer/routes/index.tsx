import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="flex-1 overflow-auto p-window">
      <div className="flex flex-col gap-related">
        <h1 className="text-title-2 text-label">Welcome to Sasori</h1>
        <p className="text-body text-secondary-label">Your desktop workspace.</p>
      </div>
    </div>
  );
}
