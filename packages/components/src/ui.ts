import { createLibrary } from "@hulla/ui"

export const ui = createLibrary({
  name: "@hulla/ui",
  version: "0.0.0",
  author: "Samuel Hulla",
  url: "https://hulla.dev/docs/ui",
  tsconfigPath: "./tsconfig.json",
  frameworks: ["astro", "react", "solid", "svelte", "vue"],
  inputDirs: {
    astro: "./src/astro",
    react: "./src/react",
    solid: "./src/solid",
    svelte: "./src/svelte",
    vue: "./src/vue",
  },
  outputDirs: {
    rootDir: "../../generated",
    frameworks: {
      astro: "./astro",
      react: "./react",
      solid: "./solid",
      svelte: "./svelte",
      vue: "./vue",
    },
  },
  copyFiles: {
    shared: ["lib/style.ts"],
  },
  tsconfig: {},
  packageJson: {
    installDepCommand: "bun add",
    installDevDepCommand: "bun add -d",
    modifier: (pkg) => ({
      ...pkg,
      dependencies: {
        ...pkg.dependencies,
        "@hulla/style": "catalog:",
      },
      devDependencies: {
        ...pkg.devDependencies,
        typescript: "*",
      },
    }),
    frameworkModifiers: {
      astro: (pkg) => ({
        ...pkg,
        dependencies: {
          ...pkg.dependencies,
          astro: "^5.0.0",
        },
      }),
      react: (pkg) => ({
        ...pkg,
        dependencies: {
          ...pkg.dependencies,
          react: "*",
          "react-dom": "*",
        },
        devDependencies: {
          ...pkg.devDependencies,
          "@types/react": "*",
          "@types/react-dom": "*",
        },
      }),
    },
  },
  scripts: {
    postBuild: 'cd ../.. && bun run prettier --write "./generated/**/*.{ts,tsx,md,json,css}"',
  },
})
