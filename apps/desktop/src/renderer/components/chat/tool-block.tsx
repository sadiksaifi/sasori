import { useState } from "react";
import { CaretRightIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface ToolBlockProps {
  summary: string;
  detail?: string;
}

export function ToolBlock({ summary, detail }: ToolBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="my-1">
      <button
        type="button"
        onClick={() => detail && setIsExpanded(!isExpanded)}
        className={cn(
          "flex items-center gap-related text-callout text-secondary-label",
          detail && "cursor-pointer hover:text-label",
          !detail && "cursor-default",
        )}
      >
        {detail && (
          <CaretRightIcon
            size={10}
            className={cn("shrink-0 transition-transform duration-150", isExpanded && "rotate-90")}
          />
        )}
        <span>{summary}</span>
      </button>
      {isExpanded && detail && (
        <pre className="mt-related overflow-x-auto rounded-sm bg-secondary-background p-2 text-callout text-secondary-label">
          {detail}
        </pre>
      )}
    </div>
  );
}
