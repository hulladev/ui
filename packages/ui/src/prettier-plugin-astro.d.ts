declare module "prettier-plugin-astro" {
  import type { Plugin } from "prettier"

  export const defaultOptions: Plugin["defaultOptions"]
  export const languages: Plugin["languages"]
  export const options: Plugin["options"]
  export const parsers: Plugin["parsers"]
  export const printers: Plugin["printers"]
}
