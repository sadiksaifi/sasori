# Sasori

Multi-model AI coding agent harness. Native macOS desktop app built with Electron, React, and TypeScript.

## Stack

- **Runtime:** Electron 41, React 19, TypeScript 6
- **Build:** Turborepo, Bun, electron-vite (Vite 8)
- **Routing:** TanStack Router (file-based)
- **Styling:** Tailwind CSS v4 with macOS HIG design tokens
- **IPC:** Conveyor (typesafe, Zod-validated)
- **Icons:** Phosphor Icons (weight variants for macOS-native feel)
- **Quality:** oxlint, oxfmt, vitest

## Structure

```
apps/
  desktop/          → Electron desktop app
packages/
  tsconfig-config/  → Shared TypeScript configs (base, node, react)
  shared/           → Universal env tokens (isDev, isProd, platform)
```

## Development

```bash
bun install
bun run desktop:dev
```

## Scripts

| Command | Description |
|---|---|
| `bun run desktop:dev` | Start dev server with HMR |
| `bun run desktop:build` | Production build + DMG/ZIP |
| `bun run desktop:check` | typecheck → lint → format |
| `bun run desktop:test` | Run tests |
| `bun run desktop:lint` | Lint with oxlint |
| `bun run desktop:lint:fix` | Auto-fix lint issues |
| `bun run desktop:format:check` | Check formatting with oxfmt |
| `bun run desktop:format:fix` | Auto-fix formatting |
| `bun run desktop:typecheck` | Type-check both tsconfigs |
| `bun run desktop:clean` | Remove build artifacts |

All commands also available without `desktop:` prefix to run across all workspaces.

## License

MIT
