import type { UILibrary } from "@hulla/ui"

export const config = {
  schemaVersion: 1,
  name: "@hulla/ui",
  version: "0.0.0",
  frameworks: {
    astro: "./astro",
    react: "./react",
    solid: "./solid",
    svelte: "./svelte",
    vue: "./vue",
  },
  components: {
    alert: {
      frameworks: ["astro", "react"],
    },
    badge: {
      frameworks: ["astro", "react"],
    },
    button: {
      frameworks: ["astro", "react"],
    },
    card: {
      frameworks: ["astro", "react"],
    },
    dialog: {
      frameworks: ["astro", "react"],
    },
    "dropdown-menu": {
      frameworks: ["astro", "react"],
    },
    field: {
      frameworks: ["astro", "react"],
    },
    input: {
      frameworks: ["astro", "react"],
    },
    kbd: {
      frameworks: ["astro", "react"],
    },
    popover: {
      frameworks: ["astro", "react"],
    },
    select: {
      frameworks: ["astro", "react"],
    },
  },
  author: "Samuel Hulla",
  copyFiles: {
    shared: [
      {
        src: "lib/style.ts",
        dest: "lib/style.ts",
        required: true,
        description: "Shared class and variant composition helpers",
      },
      {
        src: "lib/layer-stack.ts",
        dest: "lib/layer-stack.ts",
        required: true,
        description: "Internal deterministic dialog stack",
      },
      {
        src: "lib/dialog.ts",
        dest: "lib/dialog.ts",
        required: true,
        description: "Framework-neutral modal dialog behavior",
      },
      {
        src: "lib/dropdown-menu.ts",
        dest: "lib/dropdown-menu.ts",
        required: true,
        description: "Framework-neutral dropdown menu behavior",
      },
      {
        src: "styles.css",
        dest: "styles.css",
        required: true,
        description: "Shared Hulla design tokens and Tailwind theme",
      },
    ],
  },
  url: "https://hulla.dev/docs/ui",
} satisfies UILibrary
