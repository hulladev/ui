import { defineConfig } from "@hulla/ui"

export const ui = defineConfig({
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
    astro: "../../generated/astro",
    react: "../../generated/react",
    solid: "../../generated/solid",
    svelte: "../../generated/svelte",
    vue: "../../generated/vue",
  },
  dependencies: {
    shared: ["@hulla/style"],
    react: ["react", "react-dom"],
  },
  devDependencies: {
    shared: ["typescript"],
  },
  scripts: {
    installDep: "pnpm add",
    installDevDep: "pnpm add -D",
  },
})
