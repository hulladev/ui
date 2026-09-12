`@hulla/ui`

`@hulla/ui` is the source-component registry and deterministic generator used by the
[`hulla` CLI](https://github.com/hulladev/cli). This repository is for library authors and
contributors; application developers install components through `hulla` (CLI), not directly from this
workspace.

The generator turns framework-specific source templates into complete, validated registries. The
official component registry currently ships Astro, React, and Solid components; Svelte and Vue adapters
remain planned. Every build is staged, compared by content, and swapped into place atomically, so
failed generation never leaves a partially updated registry.

## Start developing

Requirements: Bun 1.3.9 and Node.js 20 or newer.

```bash
bun install --frozen-lockfile
bun run dev
```

`bun run dev` starts both the component generator watcher and the Astro catalog at
`http://localhost:4321`. Edit files under `packages/components/src`; do not edit `generated`
directly.

Before opening a pull request, run the same gate used by CI:

```bash
bun run verify
```

## Common commands

| Command                    | Purpose                                                            |
| -------------------------- | ------------------------------------------------------------------ |
| `bun run dev`              | Watch, regenerate, and hot-reload the linked catalog               |
| `bun run dev:generator`    | Watch and regenerate without the catalog                           |
| `bun run dev:catalog`      | Run the catalog together with its generator watcher                |
| `bun run dev:catalog-only` | Run only Astro against the current generated output                |
| `bun run generate`         | Rebuild the committed registry atomically                          |
| `bun run generate:check`   | Report generated drift without writing files                       |
| `bun run check-generated`  | Type-check generated output in isolated framework projects         |
| `bun run verify`           | Format, lint, type-check, test, build, and verify generated output |

## Repository map

- `packages/ui` — published `@hulla/ui` generator API and `uigen` CLI.
- `packages/components/src` — canonical Astro, React, and Solid component templates plus shared
  source files.
- `generated` — committed registry consumed by the `hulla` CLI.
- `apps/catalog` — real Astro compilation and visual inspection environment.
- `docs` — generator API, architecture, and component-authoring contracts.

## Generator guarantees

- Builds are deterministic and never depend on timestamps or an incremental cache.
- The complete output is staged before the current registry is replaced.
- Deleted source files and components are pruned automatically.
- `--check` detects missing, changed, and unexpected files without overwriting them.
- Paths are contained within their declared roots, output cannot overlap source inputs, and
  generated metadata cannot be overwritten by copied files.
- A content-hashed `ui.manifest.json` records component availability and every generated file.
- Generated framework trees are type-checked independently of monorepo-only configuration.

## Documentation

- [Contributing](./contributing.md)
- [Component authoring](./docs/component-authoring.md)
- [File upload, tag input, and stepper](./docs/form-and-stepper-primitives.md)
- [Iconography](./docs/iconography.md)
- [Generator API and CLI](./docs/generator-api.md)
- [Build architecture](./docs/architecture.md)
- [Framework generation](./docs/framework-generation.md)
- [Consumer installation and local dogfooding](./docs/consumer-installation.md)
- [Beta compatibility and release process](./docs/beta-release.md)

For application installation flows, see the [`hulla` CLI](https://github.com/hulladev/cli).
