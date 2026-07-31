import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

const repositoryRoot = resolve(import.meta.dir, "../../..")

async function readGeneratedCollapsiblePart(
  framework: "astro" | "react",
  part: "collapsible-content" | "collapsible-trigger" | "collapsible"
): Promise<string> {
  const extension = framework === "astro" ? "astro" : "tsx"
  return readFile(
    resolve(repositoryRoot, `generated/${framework}/collapsible/${part}.${extension}`),
    "utf8"
  )
}

describe("Collapsible generated contract", () => {
  test("uses one native disclosure without framework state", async () => {
    const [astroRoot, reactRoot, astroTrigger, reactTrigger] = await Promise.all([
      readGeneratedCollapsiblePart("astro", "collapsible"),
      readGeneratedCollapsiblePart("react", "collapsible"),
      readGeneratedCollapsiblePart("astro", "collapsible-trigger"),
      readGeneratedCollapsiblePart("react", "collapsible-trigger"),
    ])

    for (const source of [astroRoot, reactRoot]) {
      expect(source).toContain("<details")
      expect(source).toContain('data-slot="collapsible"')
      expect(source).not.toContain("createContext")
      expect(source).not.toContain("useState")
    }
    for (const source of [astroTrigger, reactTrigger]) {
      expect(source).toContain("<summary")
      expect(source).toContain('data-slot="collapsible-trigger"')
    }
  })

  test("keeps native details props and reduced-motion animation", async () => {
    const sources = await Promise.all(
      (["astro", "react"] as const).flatMap((framework) => [
        readGeneratedCollapsiblePart(framework, "collapsible"),
        readGeneratedCollapsiblePart(framework, "collapsible-content"),
      ])
    )
    const reactRoot = sources[2]

    expect(reactRoot).toContain('ComponentPropsWithRef<"details">')
    for (const source of sources) expect(source).toContain("motion-reduce:")
  })
})
