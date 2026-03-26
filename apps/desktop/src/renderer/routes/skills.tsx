import { createFileRoute } from "@tanstack/react-router";
import { DownloadSimpleIcon } from "@phosphor-icons/react";
import { z } from "zod";
import { SkillsWebview } from "@/components/skills-webview";
import { useToolbar } from "@/hooks/use-toolbar";

const searchSchema = z.object({
  path: z.string().optional(),
});

export const Route = createFileRoute("/skills")({
  validateSearch: searchSchema,
  component: Skills,
});

function Skills() {
  const { path } = Route.useSearch();

  useToolbar({
    title: "Skills",
    actions: [{ key: "install", label: "Install", icon: DownloadSimpleIcon }],
  });

  return (
    <div className="-m-window" style={{ height: "calc(100% + var(--window-padding) * 2)" }}>
      <SkillsWebview initialPath={path} />
    </div>
  );
}
