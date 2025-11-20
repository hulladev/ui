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
    react: ["@types/react", "@types/react-dom"],
  },
  copyFiles: {
    shared: ["lib/style.ts"],
  },
  tsconfig: {
    modifier: (config) => {
      if (!config.compilerOptions) {
        config.compilerOptions = {}
      }

      // Adjust for generated structure (no src/ directory)
      // Set baseUrl to current directory instead of parent
      if (config.compilerOptions.baseUrl === "..") {
        config.compilerOptions.baseUrl = "."
      }

      // Remove rootDir as it points outside generated directory
      delete config.compilerOptions.rootDir

      // Update include paths to reference local files
      if (config.include) {
        config.include = config.include
          .map((path: string) => {
            // Remove parent directory references
            if (path.startsWith("..")) {
              // Transform "../lib/style.ts" to "lib/style.ts"
              return path.replace(/^\.\.\//, "")
            }
            return path
          })
          .filter((path: string) => {
            // Remove paths that no longer exist (like +css)
            return !path.includes("+css")
          })
      }

      return config
    },
  },
  scripts: {
    installDep: "pnpm add",
    installDevDep: "pnpm add -D",
  },
})
