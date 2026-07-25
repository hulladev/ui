# Component authoring

Component templates live under `packages/components/src/<framework>`. The generator configuration
in `packages/components/src/ui.ts` declares the authoritative frameworks, inputs, output layout,
shared files, dependency metadata, and generated TypeScript settings.

## Add a component

Create the same component directory name in each framework you support:

```text
packages/components/src/
├── astro/button/
│   ├── package.json
│   └── button.astro
└── react/button/
    ├── package.json
    ├── button.react.tsx
    └── index.button.react.tsx
```

The local `package.json` is a discovery marker and is copied with the component. A directory without
that marker is intentionally ignored. A component may support only a subset of configured
frameworks; `ui.config.ts` and `ui.manifest.json` record the actual availability matrix.

Use a framework segment immediately before the extension when a source filename or relative module
specifier is framework-specific:

- `button.react.tsx` becomes `button.tsx`.
- `index.button.react.tsx` becomes `index.tsx`.
- `export * from "./button.react"` becomes `export * from "./button"`.

Run `bun run generate` after creating or deleting component files. The full-tree build handles
pruning; no cache cleanup is required.

## Inlining shared values with `resolve`

Shared values such as variant definitions can be authored once and inserted into multiple
framework templates:

```ts
// src/+css/button.css.ts
import { vn } from "@/lib/style"

export const buttonStyles = {
  base: "inline-flex items-center rounded-md",
  variant: vn({
    primary: "bg-primary text-primary-foreground",
    outline: "border border-border bg-transparent text-foreground",
  }),
}
```

```tsx
// src/react/button/button.react.tsx
import { buttonStyles } from "@/+css/button.css"
import { resolve } from "@hulla/ui"

const styles = resolve(buttonStyles)
```

`resolve(...)` exists only in source templates. Generated code contains the initializer itself and
never imports or calls `resolve` at runtime.

The contract is intentionally strict:

- Import `resolve` from `@hulla/ui`; aliases are supported.
- Pass exactly one imported identifier.
- The referenced source export must be a directly exported variable with an initializer.
- That initializer must be self-contained apart from imports. It cannot reference another local
  variable, function, or class in its module.
- Relative imports required by the initializer must also be emitted, usually through `copyFiles`.
- Do not use one source import partly at runtime and partly through `resolve` unless that source
  module is emitted too.
- Put calls in normal script code, Astro frontmatter, or Vue/Svelte `script` blocks.

The generator rejects unsupported cases with the source path and corrective action instead of
emitting code that fails later in a consumer.

## Shared files

Declare cross-framework files through `copyFiles.shared` in `src/ui.ts`. Use framework keys for
framework-only files. String entries copy to the same relative destination and are required by
default; object entries can choose a destination, description, and optional status:

```ts
copyFiles: {
  shared: [
    "lib/style.ts",
    {
      src: "styles.css",
      dest: "styles.css",
      description: "Shared design tokens",
    },
    {
      src: "experimental.css",
      required: false,
    },
  ],
}
```

Copy destinations are relative to each framework output. They cannot escape that output or replace
the generated `package.json` and `tsconfig.json`.

## Definition of done

Before submitting a component:

1. Implement each intended framework and add its marker `package.json`.
2. Add shared values and files to the generator config rather than duplicating them.
3. Run `bun run generate` and inspect the catalog in both contrast modes and at a narrow viewport.
4. Exercise pointer, keyboard focus, disabled, and loading states that the component exposes.
5. Run `bun run verify` and commit the generated registry with the source change.
6. Use a sibling consumer sandbox for `hulla ui add` or update-flow changes.
