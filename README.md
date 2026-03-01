# @hulla/ui

`@hulla/ui` the revolutionary UI lib builder for new age of coding

> [!IMPORTANT]
> If you're looking to add components to your application, use the **`hulla` CLI**
> [github.com/hulladev/cli](https://github.com/hulladev/cli)
>
> This repository is mainly aimed at developers/teams who want to create their own UI Libraries coppatible with `hulla` cli or people who want to update or add new components to the hulla ui library.

## What This Repo Contains

- `packages/ui`: core generation API (`createLibrary`, `resolve`, types)
- `packages/components`: component source templates per framework
- `generated`: generated framework outputs from the build pipeline _(what you use in `hulla` cli)_
- `apps/*`: local playground/example apps for framework validation

## Component Sources

Components are authored in [`packages/components/src`](packages/components/src) by framework:

- `astro/`
- `react/`
- `solid/`
- `svelte/`
- `vue/`
- `+css/` - Shared styles/classes between frameworks

A library definition lives in [`packages/components/src/ui.ts`](packages/components/src/ui.ts).

## Basic `@hulla/ui` API

`@hulla/ui` exports:

- `createLibrary(config)`
- `resolve(...)`
- `withRootDir(...)`
- public types from `types.public.ts`

### Minimal Example

```ts
import { createLibrary } from "@hulla/ui"

export const ui = createLibrary({
  name: "your-library-name",
  version: "0.0.0",
  frameworks: ["react", "vue"],
  inputDirs: {
    react: "./src/react",
    vue: "./src/vue",
  },
  outputDirs: {
    rootDir: "./generated",
    frameworks: {
      react: "./react",
      vue: "./vue",
    },
  },
  packageJson: {
    installDepCommand: "pnpm add",
    installDevDepCommand: "pnpm add -D",
  },
  scripts: {},
})
```

### Core Config Fields

- `frameworks`: frameworks to generate
- `inputDirs`: source directories per framework
- `outputDirs`: root and framework output directories
- `copyFiles`: optional files copied into generated outputs
- `packageJson`: dependency installation commands + optional modifiers
- `tsconfig`: optional modifiers for generated tsconfig files
- `scripts`: optional `preBuild` / `postBuild` hooks

## Generate Output Locally

From this repository root:

```bash
pnpm install
pnpm build
```

For direct generator usage, `@hulla/ui` also ships `uigen`:

```bash
uigen ./packages/components/src/ui.ts
```

(Used internally by the build flow and typically wrapped by the `hulla` CLI.)
