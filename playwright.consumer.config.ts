import { defineConfig } from "@playwright/test"
import { resolve } from "node:path"

const sandboxRoot = resolve(process.cwd(), ".consumer-sandbox/projects")

export default defineConfig({
  testDir: "./test/consumer-sandbox/browser",
  outputDir: ".consumer-sandbox/playwright-results",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  use: {
    browserName: "chromium",
    colorScheme: "light",
    viewport: { width: 1280, height: 900 },
  },
  webServer: [
    {
      command:
        "HULLA_CATALOG_VITE_CACHE_DIR=node_modules/.vite/consumer-tests bunx astro dev --host 127.0.0.1 --port 4414",
      cwd: resolve(process.cwd(), "apps/catalog"),
      port: 4414,
      reuseExistingServer: false,
    },
    {
      command: "bun run preview -- --host 127.0.0.1 --port 4411",
      cwd: resolve(sandboxRoot, "astro"),
      port: 4411,
      reuseExistingServer: false,
    },
    {
      command: "bun run preview -- --host 127.0.0.1 --port 4412",
      cwd: resolve(sandboxRoot, "react"),
      port: 4412,
      reuseExistingServer: false,
    },
    {
      command: "bun run preview -- --host 127.0.0.1 --port 4413",
      cwd: resolve(sandboxRoot, "solid"),
      port: 4413,
      reuseExistingServer: false,
    },
  ],
})
