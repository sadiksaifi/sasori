import { ChatCircleDotsIcon } from "@phosphor-icons/react";

interface EmptyStateProps {
  projectName: string;
}

export function EmptyState({ projectName }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-related">
      <ChatCircleDotsIcon size={40} className="text-tertiary-label" weight="light" />
      <h2 className="text-large-title text-label">Let's build</h2>
      <span className="text-body text-secondary-label">{projectName}</span>
    </div>
  );
}
