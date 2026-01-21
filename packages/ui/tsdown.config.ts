import { defineConfig } from "tsdown"

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "bin/uigen": "src/bin/uigen.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  exports: true,
  clean: true,
  treeshake: true,
  external: ["@hulla/style"],
})
