# Generator API and CLI

`@hulla/ui` exposes `createLibrary`, the source-only `resolve` marker, `withRootDir`, public
configuration/result types, and `GeneratedOutputOutOfDateError`.

## Configuration

```ts
import { createLibrary } from "@hulla/ui"
import { fileURLToPath } from "node:url"

export const ui = createLibrary({
  name: "@acme/ui",
  version: "1.0.0",
  basePath: fileURLToPath(new URL("..", import.meta.url)),
  tsconfigPath: "./tsconfig.json",
  frameworks: ["astro", "react"],
  inputDirs: {
    astro: "./src/astro",
    react: ["./src/react", "./src/react-experimental"],
  },
  outputDirs: {
    rootDir: "../../generated",
    frameworks: {
      astro: "astro",
      react: "react",
    },
  },
  copyFilesRoot: "./src",
  copyFiles: {
    shared: ["lib/style.ts", "styles.css"],
  },
  packageJson: {
    base: { private: true, type: "module" },
    modifier: (packageJson) => ({
      ...packageJson,
      dependencies: { ...packageJson.dependencies, "@acme/style": "catalog:" },
    }),
    frameworkModifiers: {
      react: (packageJson) => ({
        ...packageJson,
        dependencies: { ...packageJson.dependencies, react: "^19.0.0" },
      }),
    },
  },
  tsconfig: {
    frameworks: {
      react: { compilerOptions: { jsx: "react-jsx" } },
    },
  },
})
```

| Field             | Contract                                                                 |
| ----------------- | ------------------------------------------------------------------------ |
| `name`, `version` | Non-empty library name and semantic version written to registry metadata |
| `frameworks`      | Unique lowercase identifiers; drives all framework-keyed records         |
| `basePath`        | Base for relative paths; defaults to the current working directory       |
| `inputDirs`       | One or more readable component roots per framework                       |
| `outputDirs`      | Registry root and a distinct child directory for every framework         |
| `tsconfigPath`    | Authoring config used only for module resolution while transforming      |
| `copyFilesRoot`   | Root for `copyFiles` sources; defaults to `./src`                        |
| `copyFiles`       | Shared or framework-specific files copied into generated output          |
| `packageJson`     | Base metadata plus global and framework-specific pure modifiers          |
| `tsconfig`        | Self-contained generated TypeScript base and framework overrides         |
| `author`, `url`   | Optional registry metadata                                               |

Workspace dependency versions written as `catalog:` or `catalog:<name>` are resolved from the
nearest ancestor `package.json` with `workspaces.catalog`. A missing catalog entry is an error.

The generator does not install dependencies or run arbitrary pre/post shell commands. Generation
is therefore reproducible and safe to run in CI; dependency installation remains an explicit
repository or consumer workflow.

## Programmatic builds

```ts
const result = await ui.build()
const check = await ui.build({ mode: "check", quiet: true })
```

`build()` defaults to write mode and returns:

```ts
type BuildResult = {
  changed: boolean
  components: number
  files: number
  mode: "check" | "write"
  outputRoot: string
}
```

Check mode throws `GeneratedOutputOutOfDateError` when output differs. Its `differences` property
contains stable `missing`, `changed`, and `unexpected` entries suitable for CI reporting.

## CLI

The package installs `uigen`:

```bash
uigen ./src/ui.ts
uigen --check ./src/ui.ts
uigen --quiet ./src/ui.ts
uigen --help
uigen --version
```

The TypeScript or JavaScript config must export a `createLibrary(...)` result as `ui` or as the
default export. Relative config paths are resolved from the current working directory. Invalid
arguments exit with status 2; config or build failures exit with status 1 and a concise `uigen:`
message.

## Generated registry

The registry root contains:

- one directory per configured framework;
- `ui.config.ts`, the typed metadata consumed by TypeScript-aware tooling;
- `ui.manifest.json`, the JSON availability map plus SHA-256 file inventory.

Each framework directory contains generated components, copied shared files, a resolved
`package.json`, and a standalone `tsconfig.json`.
