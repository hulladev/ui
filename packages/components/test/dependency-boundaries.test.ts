import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

type Manifest = {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

const repositoryRoot = resolve(import.meta.dir, "../../..")

async function readManifest(path: string): Promise<Manifest> {
  return JSON.parse(await readFile(resolve(repositoryRoot, path), "utf8")) as Manifest
}

describe("framework dependency boundaries", () => {
  test("keeps icon adapters out of the workspace root", async () => {
    const root = await readManifest("package.json")

    expect(root.dependencies?.["@lucide/astro"]).toBeUndefined()
    expect(root.dependencies?.["lucide-react"]).toBeUndefined()
    expect(root.devDependencies?.["@lucide/astro"]).toBeUndefined()
    expect(root.devDependencies?.["lucide-react"]).toBeUndefined()
    expect(root.dependencies?.["@tabler/icons-astro"]).toBeUndefined()
    expect(root.dependencies?.["@tabler/icons-react"]).toBeUndefined()
  })

  test("keeps optional consumer icons out of generated framework packages", async () => {
    const astro = await readManifest("generated/astro/package.json")
    const react = await readManifest("generated/react/package.json")

    expect(astro.dependencies?.["@lucide/astro"]).toBeUndefined()
    expect(astro.dependencies?.["lucide-react"]).toBeUndefined()
    expect(react.dependencies?.["@lucide/astro"]).toBeUndefined()
    expect(react.dependencies?.["lucide-react"]).toBeUndefined()
    expect(astro.dependencies?.["@tabler/icons-astro"]).toBeUndefined()
    expect(react.dependencies?.["@tabler/icons-react"]).toBeUndefined()
  })

  test("keeps Alert package metadata icon-library agnostic", async () => {
    const astroAlert = await readManifest("generated/astro/alert/package.json")
    const reactAlert = await readManifest("generated/react/alert/package.json")

    expect(astroAlert.dependencies).toBeUndefined()
    expect(reactAlert.dependencies).toBeUndefined()
  })

  test("keeps Alert glyph choice in consumer code", async () => {
    const [astroAlert, reactAlert, astroAlertIcon, reactAlertIcon] = await Promise.all(
      [
        "generated/astro/alert/alert.astro",
        "generated/react/alert/alert.tsx",
        "generated/astro/alert/alert-icon.astro",
        "generated/react/alert/alert-icon.tsx",
      ].map((path) => readFile(resolve(repositoryRoot, path), "utf8"))
    )

    for (const source of [astroAlert, reactAlert, astroAlertIcon, reactAlertIcon]) {
      expect(source).not.toContain("lucide")
      expect(source).not.toContain("tabler")
    }
    expect(astroAlertIcon).toContain('data-slot="alert-icon"')
    expect(reactAlertIcon).toContain('data-slot="alert-icon"')
  })

  test("resolves generated dependencies from the catalog project", async () => {
    const catalog = await readManifest("apps/catalog/package.json")
    const astroConfig = await readFile(
      resolve(repositoryRoot, "apps/catalog/astro.config.mjs"),
      "utf8"
    )

    expect(catalog.dependencies?.["@lucide/astro"]).toBe("^1.26.0")
    expect(catalog.dependencies?.["lucide-react"]).toBeUndefined()
    expect(catalog.dependencies?.["@tabler/icons-astro"]).toBeUndefined()
    expect(astroConfig).toContain('dedupe: ["@hulla/style", "@lucide/astro", "tailwind-merge"]')
    expect(astroConfig).not.toContain("node_modules/")
  })
})
