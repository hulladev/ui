# Contributing

This repository owns both component templates and the generated registry consumed by the `hulla`
CLI. Source and generated output are intentionally committed together.

## Prerequisites

- Bun 1.3.9, matching the root `packageManager` field and CI.
- Node.js 20 or newer, matching the published `@hulla/ui` runtime contract.

Install the locked dependency graph from the repository root:

```bash
bun install --frozen-lockfile
```

## Daily development workflow

Start the generator watcher and component catalog together:

```bash
bun run dev
```

The generator watches `packages/components/src` and serializes rebuilds so a burst of file changes
cannot create overlapping writes. The catalog compiles components from `generated/astro`, which
means it exercises the same transformed files consumers receive.

The catalog task is linked to the generator watcher, so this equivalent command also keeps
generated output current:

```bash
bun run dev:catalog
```

Use the narrower commands only when you deliberately need one side of the loop:

```bash
bun run dev:generator
bun run dev:catalog-only
```

Author only in `packages/components/src`. A successful generator run replaces `generated` as a
complete tree; edits made directly in `generated` will be reported by `generate:check` and removed
by the next write build.

See [Component authoring](./docs/component-authoring.md) before adding a component. In particular,
every component directory needs a `package.json` marker, and `resolve(...)` has a deliberately
strict source-template contract.

## Verification

Run the full local and CI gate before requesting review:

```bash
bun run verify
```

This checks formatting, lint, source types, unit and integration tests, package builds, generated
drift, and isolated framework compilation. To diagnose one layer, run its root script directly.

When a pull request intentionally changes `@hulla/ui`, add a changeset:

```bash
bun run changeset
```

Generated component content is not published as its own workspace package, so `components` is
excluded from changesets.

## Testing the consumer workflow

Use a sibling sandbox to avoid duplicate source and generated search results in this repository:

```text
ui/          # this repository
ui-sandbox/  # application used for hulla CLI smoke tests
```

Point the sandbox's `.hulla/ui.json` at this repository's generated registry:

```json
{
  "version": 1,
  "sources": ["../ui/generated"],
  "installs": []
}
```

Keep `bun run dev:generator` running here, then exercise `hulla ui init`, add, and update flows in
the sandbox. This validates file ownership and installation behavior without coupling the library
build to a consumer project.

## Commit and release workflow

Commit messages are checked with Commitlint through the Husky `commit-msg` hook. CI runs
`bun run verify` on pull requests and pushes to `master`. Changesets opens version pull requests and
publishes `@hulla/ui` only when the repository's npm token is configured.
