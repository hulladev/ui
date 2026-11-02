import { defineConfig, devices } from "@playwright/test"

const projectName = process.env.PLAYWRIGHT_PROJECT
if (projectName && !["chromium", "firefox", "webkit"].includes(projectName)) {
  throw new Error(`Unknown Playwright project: ${projectName}`)
}

export default defineConfig({
  testDir: "./test/browser",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 3,
  reporter: process.env.CI ? [["github"], ["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://127.0.0.1:4325",
    trace: "on-first-retry",
  },
  webServer: {
    command:
      "HULLA_CATALOG_VITE_CACHE_DIR=node_modules/.vite/catalog-tests bunx astro dev --host 127.0.0.1 --port 4325",
    reuseExistingServer: false,
    timeout: 120_000,
    url: "http://127.0.0.1:4325",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ].filter((project) => !projectName || project.name === projectName),
})
