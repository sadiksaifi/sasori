import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
  component: Settings,
});

function Settings() {
  return (
    <div className="flex-1 overflow-auto p-window">
      <div className="flex flex-col gap-related">
        <h1 className="text-title-2 text-label">Settings</h1>
        <p className="text-body text-secondary-label">Configure Sasori.</p>
      </div>
    </div>
  );
}
