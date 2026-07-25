/**
 * @type {import('prettier').Config}
 */
export default {
  semi: false,
  singleQuote: false,
  printWidth: 100,
  tabWidth: 2,
  trailingComma: "es5",
  plugins: ["prettier-plugin-astro", "prettier-plugin-svelte"],
  overrides: [
    {
      files: "*.astro",
      options: { parser: "astro" },
    },
    {
      files: "*.svelte",
      options: { parser: "svelte" },
    },
  ],
}
