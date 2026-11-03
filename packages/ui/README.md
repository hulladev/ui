# @hulla/ui

Deterministic, atomic source-component registry generation. The official `@hulla/ui` registry currently
publishes Astro, React, and Solid targets.

```ts
import { createLibrary } from "@hulla/ui"

export const ui = createLibrary({
  name: "@acme/ui",
  version: "1.0.0",
  frameworks: ["react"],
  inputDirs: { react: "./src/react" },
  outputDirs: {
    rootDir: "./generated",
    frameworks: { react: "react" },
  },
})
```

```bash
uigen ./src/ui.ts
uigen --check ./src/ui.ts
```

The package is intended for component-library authors. Application developers consume generated
registries through the [`hulla` CLI](https://github.com/hulladev/cli).

Full documentation is available in the
[@hulla/ui repository](https://github.com/hulladev/ui/tree/master/docs).

## AI agent guidance

For application work with installed components, use the [@hulla/ui skill](https://github.com/hulladev/skills/tree/main/skills/ui). It covers consumer composition, themes, and native interactions; generator authoring remains covered by this package's documentation.

```sh
npx skills add hulladev/skills --skill ui
```

See the [agent skills guide](https://hulla.dev/docs/cli/agent-skills) for agent selection and package compatibility.
