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
              // import handled in copyFiles step above
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
  packageJson: {
    installDepCommand: "pnpm add",
    installDevDepCommand: "pnpm add -D",
    modifier: (pkg) => ({
      ...pkg,
      dependencies: {
        ...pkg.dependencies,
        "@hulla/style": "*",
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
