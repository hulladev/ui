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
    button: {
      frameworks: ["astro", "react"],
    },
    field: {
      frameworks: ["astro", "react"],
    },
    input: {
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
        src: "styles.css",
        dest: "styles.css",
        required: true,
        description: "Shared Hulla design tokens and Tailwind theme",
      },
    ],
  },
  url: "https://hulla.dev/docs/ui",
} satisfies UILibrary
