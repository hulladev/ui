import type { UILibrary } from "@hulla/ui"

export const config: UILibrary = {
  name: "@hulla/ui",
  url: "https://hulla.dev/docs/ui",
  author: "Samuel Hulla",
  frameworks: {
    astro: "./astro",
    react: "./react",
    solid: "./solid",
    svelte: "./svelte",
    vue: "./vue",
  },
  version: "0.0.0",
}
