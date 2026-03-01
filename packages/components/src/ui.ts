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
    installDepCommand: "pnpm add",
    installDevDepCommand: "pnpm add -D",
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
    postBuild: 'cd .. && pnpm prettier --write "./generated/**/*.{ts,tsx,md,json,css}"',
  },
})
