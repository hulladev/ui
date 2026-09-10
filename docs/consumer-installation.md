# Consumer installation and local dogfooding

Four artifacts have separate jobs:

- `@hulla/ui` is the library-author API and the package containing `uigen`.
- `uigen` converts component templates into a deterministic generated registry.
- `generated/` is the registry artifact with framework trees, config, and manifest.
- `hulla` is the consumer CLI that initializes projects and copies selected source into them.

Application code should install through `hulla ui`; it should not import this repository's source or
generated directory at runtime.

## Consumer workflow

```sh
hulla init
hulla ui init
hulla ui add --framework astro button dialog tabs
hulla ui add --framework solid command dialog input
hulla ui remove button
```

`hulla ui init` configures aliases, TypeScript/Vite integration, design tokens, fonts, support
files, and dependencies. `add` copies component source and its declared dependencies. Re-running
`init` or `add` is expected to be idempotent; review overwrite diffs when updating.

## Local registry dogfood

Build and pack `@hulla/ui`, install the tarball into an isolated tool fixture, and run `uigen` from
that packed installation. Point a consumer's `.hulla/ui.json` at the resulting local registry:

```json
{ "version": 1, "sources": ["../ui/generated"], "installs": [] }
```

Relative sources are loaded through the registry's generated `ui.config.ts`. Use a separately
packed `hulla` CLI to run init/add/remove/update checks. Never add the tarball or sibling registry
as a tracked `file:` dependency. Finally make the sibling repositories unavailable and prove the
consumer still installs, checks, builds, and runs from copied source.

Before a public release, replace the local path with an immutable GitHub beta tag and require zero
meaningful regenerated diff.

Run `bun run test:consumers` to execute the repository-owned clean-room gate. It packs and installs
both `@hulla/ui` and `hulla`, verifies ESM/CommonJS and deterministic `uigen` output, exercises
init/add/remove/re-add for Astro, React, and Solid, builds every consumer, then compares browser
computed styles and visual baselines.

## Catalog parity gate

The catalog imports generated components and the generated global stylesheet. Product examples
use public props; their local classes are limited to layout constraints, table alignment, and
intentional skeleton geometry. Component appearance overrides are rejected by the catalog unit
suite. Catalog chrome and illustrations live in the `catalog` CSS layer. Browser tests remove
that layer and compare component paint, typography, spacing, and focus styling at desktop and
mobile widths in both themes.

`bun run test:consumers` installs every supported family through the packed CLI for Astro, React,
and Solid. It compares every installed component, runtime helper, and theme file with the catalog
registry (allowing only import relocation), builds detached consumers, and compares the installed
button's computed styles directly with the catalog. Existing interaction tests exercise the
shared components; the catalog does not implement substitute component behavior.

This guarantee applies to the same registry revision, theme, and public props. Publish the
verified registry before expecting an external CLI installation to contain local design changes.
