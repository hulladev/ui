# @hulla/ui

Deterministic, atomic source-component registry generation for Astro, React, Solid, Svelte, and
Vue.

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
[Hulla UI repository](https://github.com/hulladev/ui/tree/master/docs).
