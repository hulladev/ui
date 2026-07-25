import { defineConfig } from "tsdown"
import packageJson from "./package.json"

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "bin/uigen": "src/bin/uigen.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  define: {
    __PACKAGE_VERSION__: JSON.stringify(packageJson.version),
  },
  sourcemap: true,
  exports: true,
  clean: true,
  treeshake: true,
  external: ["@hulla/style"],
})
