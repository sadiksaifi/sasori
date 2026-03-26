import type { Message } from "./types";

export const mockMessages: Message[] = [
  {
    id: "msg-1",
    role: "user",
    content: [{ type: "text", text: "can you explain me this project?" }],
    createdAt: new Date(Date.now() - 5 * 60_000).toISOString(),
  },
  {
    id: "msg-2",
    role: "assistant",
    content: [
      {
        type: "text",
        text: "I'm going to map the repo structure and read the key workspace configs so I can give you a practical overview of how this project is put together.",
      },
      { type: "thinking" },
      {
        type: "tool_use",
        id: "tool-1",
        name: "Explore",
        summary: "Explored 1 search",
      },
      {
        type: "tool_result",
        toolUseId: "tool-1",
        content:
          "Ran pwd && fd AGENTS.md . && fd package.json . && fd turbo.json . && fd tsconfig.json . && fd README.md .",
      },
      {
        type: "text",
        text: `This is a Bun + Turborepo monorepo with two frontends and a few shared TypeScript packages. At the top level, \`README.md\` and \`package.json\` show the core idea: one repo, shared code in \`packages/*\`, and app-specific code in \`apps/*\`, with Turbo orchestrating build/lint/typecheck from \`turbo.json\`.

The two apps are:

- **apps/desktop**: an Electron 41 app with main + preload + renderer processes. Uses React with TanStack Router for file-based routing.
- **apps/web**: a Vite + React web app used for device pairing/testing.

The shared packages are the real backbone:

- \`packages/shared\`: universal utilities (env detection, platform helpers)
- \`packages/tsconfig-config\`: shared TypeScript configs (base, node, react)

Architecturally, the project uses **vertical slices**: each feature gets its own folder with related client/types/validation/query/store files.`,
      },
    ],
    createdAt: new Date(Date.now() - 4 * 60_000).toISOString(),
  },
  {
    id: "msg-3",
    role: "user",
    content: [{ type: "text", text: "what does the conveyor system do?" }],
    createdAt: new Date(Date.now() - 2 * 60_000).toISOString(),
  },
  {
    id: "msg-4",
    role: "assistant",
    content: [
      {
        type: "tool_use",
        id: "tool-2",
        name: "Read",
        summary: "Read 3 files",
      },
      {
        type: "tool_result",
        toolUseId: "tool-2",
        content:
          "Read conveyor/schemas/db-schema.ts, conveyor/handlers/db-handler.ts, conveyor/api/db-api.ts",
      },
      {
        type: "text",
        text: `**Conveyor** is the app's typesafe IPC layer — it replaces raw \`ipcMain\`/\`ipcRenderer\` calls with Zod-validated channels.

Here's how it works:

\`\`\`typescript
// 1. Define schema in conveyor/schemas/
export const dbSchemas = {
  "db:get-all-sessions": {
    args: z.object({}),
    returns: z.array(sessionSchema),
  },
};

// 2. Handle in main process
handle("db:get-all-sessions", () => getAllSessions());

// 3. Call from renderer via preload bridge
const sessions = await window.conveyor.db.getAllSessions();
\`\`\`

Every channel gets **runtime arg + return validation** through Zod schemas. If the main process returns a shape that doesn't match the schema, it throws rather than silently passing bad data to the renderer.`,
      },
    ],
    createdAt: new Date(Date.now() - 1 * 60_000).toISOString(),
  },
];
