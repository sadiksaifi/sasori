# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev              # Start Electron dev server (HMR)
bun run build            # Production build (electron-vite + electron-builder, macOS arm64)
bun run check            # Typecheck → lint → format:check (run before finishing work)
bun run test             # Run vitest suite
bun run lint:fix         # Auto-fix oxlint issues
bun run format:fix       # Auto-fix formatting with oxfmt
```

Desktop-specific shortcuts (faster iteration):
```bash
bun run desktop:dev      # electron-vite dev only
bun run desktop:check    # Check desktop app only
bun run desktop:test     # Test desktop app only
```

## Architecture

Turborepo monorepo with Bun:
- `apps/desktop/` — Electron 41 app (main + preload + renderer)
- `packages/shared/` — Universal utilities (env detection, platform helpers)
- `packages/tsconfig-config/` — Shared TypeScript configs (base, node, react)

### Conveyor (IPC System)

Typesafe, Zod-validated IPC replacing raw `ipcMain`/`ipcRenderer`. Located at `apps/desktop/src/conveyor/`.

To add a new IPC channel:
1. Define Zod schema in `conveyor/schemas/` (args + return type)
2. Add handler in `conveyor/handlers/`
3. Register handler in `conveyor/handlers/index.ts`
4. Expose API in preload — renderer calls via `window.conveyor.<namespace>.<method>()`

### Renderer

- **Routing**: TanStack Router (file-based, auto code-splitting). Routes in `src/renderer/routes/`.
- **Do not edit** `routeTree.gen.ts` — auto-generated, gitignored.
- **Path aliases**: `@/*` → `src/renderer/*`, `@conveyor/*` → `src/conveyor/*`

## Styling

Tailwind CSS v4 with custom macOS Human Interface Guidelines tokens. Use semantic tokens, not raw values:
- Colors: `bg-background`, `bg-sidebar-background`, `text-label`, `text-secondary-label`
- Typography: `text-large-title`, `text-title-1`, `text-body`, `text-caption-1`
- Spacing: `p-window`, `gap-section`, `gap-related`
- Layout: `h-toolbar`, `w-sidebar`
- Icons: Phosphor Icons React (`@phosphor-icons/react`) with weight variants

## Code Style

- **Linter**: oxlint (not ESLint). Config: `.oxlintrc.json`
- **Formatter**: oxfmt (not Prettier). Config: `.oxfmtrc.json` — 100 char width, 2-space indent, trailing commas
- **Commits**: Conventional commits (`feat:`, `fix:`, `chore:`, `refactor:`, etc.)
- **TypeScript**: Avoid `any` (oxlint warns). Use Zod for runtime validation.

Subdirectory CLAUDE.md files can be added for module-specific instructions (e.g., `apps/desktop/CLAUDE.md`). They load automatically when working in those directories.
