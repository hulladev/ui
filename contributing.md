# Contributing

This repository authors component templates and generates framework outputs used by `hulla` CLI.

## Local Setup

From repo root:

```bash
bun install
```

## Development Loop (Generator Watch)

Run watcher from repo root:

```bash
bun run dev
```

This runs `components` package `dev` task and watches:

- `packages/components/src/**`

On each change it rebuilds generated output into:

- `generated/**`

The watcher includes debounce and queued rebuild behavior so bursts of file changes do not spawn overlapping builds.

## External Sandbox Hookup

For cleaner file search and no duplicate component noise in this repo, use a sibling sandbox project (recommended):

- `../ui-sandbox`

Configure sandbox `.hulla/ui.json` with local generated source:

```json
{
  "version": 1,
  "sources": ["../ui/generated"],
  "installs": []
}
```

Then:

1. Keep `bun run dev` running in this repo.
2. In sandbox, run `hulla ui init` and `hulla ui add <component>`.
3. Re-run add/update flows after template edits to pick up local generated changes.

## Core Paths

- Source templates: `packages/components/src`
- Generator entry: `packages/components/src/ui.ts`
- Generated output: `generated`
