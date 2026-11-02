import type { CopyFileEntry } from "@hulla/ui"
import { createLibrary } from "@hulla/ui"
import { fileURLToPath } from "node:url"

function withPackageJsonUpdates<T extends object, U extends object>(
  packageJson: T,
  updates: U
): T & U {
  return { ...packageJson, ...updates }
}

const webCopyFiles = [
  {
    src: "lib/collapsible.ts",
    description: "Framework-neutral user-activated native disclosure transitions",
  },
  {
    src: "lib/table-of-contents.ts",
    description: "Framework-neutral section discovery and scroll tracking",
  },
  {
    src: "lib/tag-input.ts",
    description: "Framework-neutral tag entry keyboard and commit behavior",
  },
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
    src: "lib/navigation-menu.ts",
    description: "Framework-neutral navigation menu disclosure behavior",
  },
  {
    src: "lib/combobox.ts",
    description: "Framework-neutral editable combobox and listbox behavior",
  },
  {
    src: "lib/command.ts",
    description: "Framework-neutral command menu filtering and keyboard behavior",
  },
  {
    src: "lib/select.ts",
    description: "Framework-neutral select and listbox behavior",
  },
  {
    src: "lib/floating-layer.ts",
    description: "Shared hover, focus, and Floating UI positioning behavior",
  },
  {
    src: "lib/spatial-interaction.ts",
    description: "Framework-neutral draggable and resizable element behavior",
  },
  {
    src: "lib/range-slider.ts",
    description: "Framework-neutral two-thumb range slider behavior",
  },
  {
    src: "lib/tabs.ts",
    description: "Framework-neutral tabs selection and keyboard behavior",
  },
  {
    src: "lib/toggle.ts",
    description: "Framework-neutral toggle and toggle group state behavior",
  },
  {
    src: "lib/tree-view.ts",
    description: "Framework-neutral tree view focus, selection, and disclosure behavior",
  },
  {
    src: "lib/calendar.ts",
    description: "Framework-neutral ISO calendar rendering and selection behavior",
  },
  {
    src: "lib/date-picker.ts",
    description: "Framework-neutral date and local date-time picker behavior",
  },
  {
    src: "lib/time-picker.ts",
    description: "Framework-neutral local time picker behavior",
  },
  {
    src: "lib/toast.ts",
    description: "Framework-neutral toast store, utility API, and presentation contract",
  },
  {
    src: "styles.css",
    description: "Shared @hulla/ui design tokens and Tailwind theme",
    globalStyle: true,
  },
  { src: "theme.css", description: "Shared semantic theme generated from theme.json" },
] satisfies readonly CopyFileEntry[]

export const ui = createLibrary({
  name: "@hulla/ui",
  version: "0.0.2-beta.0",
  author: "Samuel Hulla",
  url: "https://hulla.dev/docs/ui",
  basePath: fileURLToPath(new URL("..", import.meta.url)),
  tsconfigPath: "./tsconfig.json",
  frameworks: ["astro", "react", "solid", "react-native"],
  inputDirs: {
    astro: ["./src/astro", "./src/shared"],
    react: ["./src/react", "./src/shared"],
    solid: ["./src/solid", "./src/shared"],
    "react-native": ["./src/react-native"],
  },
  outputDirs: {
    rootDir: "../../generated",
    frameworks: {
      astro: "astro",
      react: "react",
      solid: "solid",
      "react-native": "react-native",
    },
  },
  copyFilesRoot: "./src",
  copyFiles: {
    astro: webCopyFiles,
    react: webCopyFiles,
    "react-native": [
      {
        src: "react-native/lib/native-color.ts",
        dest: "lib/native-color.ts",
        description: "Native opacity and OKLab color mixing shared with web visual recipes",
      },
      {
        src: "react-native/lib/native-date.ts",
        dest: "lib/native-date.ts",
        description: "Local ISO date parsing, serialization, and selection limits",
      },
      {
        src: "react-native/lib/text-input-style.ts",
        dest: "lib/text-input-style.ts",
        description: "Shared native text-entry sizing, colors, and focus/invalid styling",
      },
      {
        src: "react-native/lib/native-theme-context.ts",
        dest: "lib/native-theme-context.ts",
        description: "Scoped theme context and system appearance subscription",
      },
      {
        src: "react-native/lib/native-theme-provider.tsx",
        dest: "lib/native-theme-provider.tsx",
        description: "App-wide theme mode, fonts, and subtree overrides",
      },
      {
        src: "react-native/lib/native-tokens.ts",
        dest: "lib/native-tokens.ts",
        description: "Shared theme converted to native sRGB colors",
      },
      {
        src: "react-native/lib/native-theme.ts",
        dest: "lib/native-theme.ts",
        description: "System color scheme and explicit theme selection",
      },
    ],
    solid: [
      ...webCopyFiles,
      {
        src: "lib/solid.ts",
        description: "Solid lifecycle and ref helpers for controller-backed components",
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
          cn: "catalog:",
          tailwindcss: "^4.1.13",
        },
        devDependencies: {
          ...packageJson.devDependencies,
          "@tailwindcss/vite": "^4.1.13",
          typescript: "*",
        },
      }),
    frameworkModifiers: {
      "react-native": (packageJson) => ({
        ...packageJson,
        dependencies: { react: "^19.3.0", "react-native": "^0.88.1" },
        devDependencies: { "@types/react": "^19.3.0", typescript: "*" },
      }),
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
    },
  },
  tsconfig: {
    frameworks: {
      "react-native": { compilerOptions: { jsx: "react-jsx", types: ["react"] } },
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
    },
  },
})
