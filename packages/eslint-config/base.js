import js from "@eslint/js"
import eslintConfigPrettier from "eslint-config-prettier"
import turboPlugin from "eslint-plugin-turbo"
import globals from "globals"
import tseslint from "typescript-eslint"

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  eslintConfigPrettier,
  {
    ignores: [
      "**/.astro/**",
      "**/.svelte-kit/**",
      "coverage/**",
      "dist/**",
      "generated/**",
      "node_modules/**",
    ],
  },
]
