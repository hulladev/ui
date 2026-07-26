import { createLibrary } from "@hulla/ui"
import { fileURLToPath } from "node:url"

function withPackageJsonUpdates<T extends object, U extends object>(
  packageJson: T,
  updates: U
): T & U {
  return { ...packageJson, ...updates }
}

export const ui = createLibrary({
  name: "@hulla/ui",
  version: "0.0.0",
  author: "Samuel Hulla",
  url: "https://hulla.dev/docs/ui",
  basePath: fileURLToPath(new URL("..", import.meta.url)),
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
      astro: "astro",
      react: "react",
      solid: "solid",
      svelte: "svelte",
      vue: "vue",
    },
  },
  copyFilesRoot: "./src",
  copyFiles: {
    shared: [
      {
        src: "lib/style.ts",
        description: "Shared class and variant composition helpers",
      },
      {
        src: "lib/layer-stack.ts",
        description: "Internal deterministic dialog stack",
      },
      {
        src: "lib/dialog.ts",
        description: "Framework-neutral modal dialog behavior",
      },
      {
        src: "lib/dropdown-menu.ts",
        description: "Framework-neutral dropdown menu behavior",
      },
      {
        src: "lib/floating-layer.ts",
        description: "Shared hover, focus, and Floating UI positioning behavior",
      },
      {
        src: "styles.css",
        description: "Shared Hulla design tokens and Tailwind theme",
      },
    ],
  },
  packageJson: {
    base: {
      private: true,
      type: "module",
    },
    modifier: (packageJson) =>
      withPackageJsonUpdates(packageJson, {
        dependencies: {
          ...packageJson.dependencies,
          "@floating-ui/dom": "catalog:",
          "@fontsource-variable/schibsted-grotesk": "^5.3.0",
          "@fontsource/ibm-plex-mono": "^5.3.0",
          "@hulla/style": "catalog:",
          "tailwind-merge": "^3.3.1",
          tailwindcss: "^4.1.13",
        },
        devDependencies: {
          ...packageJson.devDependencies,
          typescript: "*",
        },
      }),
    frameworkModifiers: {
      astro: (packageJson) =>
        withPackageJsonUpdates(packageJson, {
          dependencies: {
            ...packageJson.dependencies,
            astro: "^5.0.0",
          },
        }),
      react: (packageJson) =>
        withPackageJsonUpdates(packageJson, {
          dependencies: {
            ...packageJson.dependencies,
            react: "^19.0.0",
            "react-dom": "^19.0.0",
          },
          devDependencies: {
            ...packageJson.devDependencies,
            "@types/react": "^19.0.0",
            "@types/react-dom": "^19.0.0",
          },
        }),
      solid: (packageJson) =>
        withPackageJsonUpdates(packageJson, {
          dependencies: {
            ...packageJson.dependencies,
            "solid-js": "^1.9.0",
          },
        }),
      svelte: (packageJson) =>
        withPackageJsonUpdates(packageJson, {
          dependencies: {
            ...packageJson.dependencies,
            svelte: "^5.0.0",
          },
        }),
      vue: (packageJson) =>
        withPackageJsonUpdates(packageJson, {
          dependencies: {
            ...packageJson.dependencies,
            vue: "^3.5.0",
          },
        }),
    },
  },
  tsconfig: {
    frameworks: {
      astro: {
        compilerOptions: {
          jsx: "preserve",
          types: ["astro/client"],
        },
      },
      react: {
        compilerOptions: {
          jsx: "react-jsx",
          jsxImportSource: "react",
        },
      },
      solid: {
        compilerOptions: {
          jsx: "preserve",
          jsxImportSource: "solid-js",
        },
      },
      vue: {
        compilerOptions: {
          jsx: "preserve",
        },
      },
    },
  },
})
