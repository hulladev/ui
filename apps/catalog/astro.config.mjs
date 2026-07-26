import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import { watch } from "node:fs"
import { fileURLToPath } from "node:url"
import { basename, dirname } from "node:path"

const generatedRoot = fileURLToPath(new URL("../../generated", import.meta.url))
const generatedParent = dirname(generatedRoot)
const generatedDirectory = basename(generatedRoot)

function reloadGeneratedOutput() {
  let refreshTimer

  return {
    name: "hulla:reload-generated-output",
    configureServer(server) {
      if (!server.httpServer) return

      server.watcher.add(generatedRoot)

      const refresh = () => {
        clearTimeout(refreshTimer)
        refreshTimer = setTimeout(() => {
          // The generator swaps the complete output tree atomically. Reattach the
          // watcher to the new directory and discard modules loaded from the old one.
          server.watcher.add(generatedRoot)
          server.moduleGraph.invalidateAll()
          server.ws.send({ type: "full-reload", path: "*" })
        }, 100)
      }

      const onGeneratedFileChange = (_event, path) => {
        if (path === generatedRoot || path.startsWith(`${generatedRoot}/`)) refresh()
      }
      const generatedParentWatcher = watch(generatedParent, (_event, filename) => {
        if (filename?.toString() === generatedDirectory) refresh()
      })

      server.watcher.on("all", onGeneratedFileChange)

      const cleanup = () => {
        clearTimeout(refreshTimer)
        generatedParentWatcher.close()
        server.watcher.off("all", onGeneratedFileChange)
      }

      server.httpServer.once("close", cleanup)
    },
  }
}

export default defineConfig({
  vite: {
    plugins: [reloadGeneratedOutput(), tailwindcss()],
    resolve: {
      dedupe: ["@hulla/style", "@lucide/astro", "tailwind-merge"],
      alias: {
        "@": fileURLToPath(new URL("../../generated/astro", import.meta.url)),
      },
    },
  },
})
