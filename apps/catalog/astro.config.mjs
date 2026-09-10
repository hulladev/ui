import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import { statSync } from "node:fs"
import { fileURLToPath } from "node:url"

const generatedRoot = fileURLToPath(new URL("../../generated", import.meta.url))
const generatedAstroRoot = fileURLToPath(new URL("../../generated/astro", import.meta.url))

function reloadGeneratedOutput() {
  let refreshTimer

  const generatedIdentity = () => {
    try {
      const stats = statSync(generatedRoot)
      return `${stats.dev}:${stats.ino}:${stats.mtimeMs}`
    } catch {
      return undefined
    }
  }

  return {
    name: "hulla:reload-generated-output",
    configureServer(server) {
      if (!server.httpServer) return

      const refresh = () => {
        clearTimeout(refreshTimer)
        refreshTimer = setTimeout(() => {
          // Discard modules loaded from the previous generated tree.
          server.moduleGraph.invalidateAll()
          server.ws.send({ type: "full-reload", path: "*" })
        }, 100)
      }

      let previousIdentity = generatedIdentity()
      const generatedOutputPoller = setInterval(() => {
        const nextIdentity = generatedIdentity()
        if (!nextIdentity) return

        if (previousIdentity && previousIdentity !== nextIdentity) {
          refresh()
        }

        previousIdentity = nextIdentity
      }, 250)

      const cleanup = () => {
        clearTimeout(refreshTimer)
        clearInterval(generatedOutputPoller)
      }

      server.httpServer.once("close", cleanup)
    },
  }
}

export default defineConfig({
  vite: {
    // Concurrent dev, catalog-test, and consumer-test servers must not invalidate
    // each other's optimized dependency URLs.
    cacheDir: process.env.HULLA_CATALOG_VITE_CACHE_DIR,
    plugins: [reloadGeneratedOutput(), tailwindcss()],
    server: {
      watch: {
        // The desktop development environment can inherit macOS's 256-file
        // descriptor soft limit. Polling keeps Astro reliable under that limit.
        usePolling: true,
        interval: 250,
        // The lightweight identity poller above detects uigen's atomic swap,
        // so Vite does not need a watcher for every generated file.
        ignored: (filePath) =>
          filePath === generatedRoot || filePath.startsWith(`${generatedRoot}/`),
      },
    },
    resolve: {
      dedupe: ["@hulla/style", "@lucide/astro", "tailwind-merge"],
      alias: {
        "@/ui": generatedAstroRoot,
        "@": generatedAstroRoot,
      },
    },
  },
})
