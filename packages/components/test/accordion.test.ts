import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

const repositoryRoot = resolve(import.meta.dir, "../../..")

async function readGeneratedAccordionPart(
  framework: "astro" | "react",
  part: "accordion-content" | "accordion-item" | "accordion-trigger" | "accordion"
): Promise<string> {
  const extension = framework === "astro" ? "astro" : "tsx"
  return readFile(
    resolve(repositoryRoot, `generated/${framework}/accordion/${part}.${extension}`),
    "utf8"
  )
}

describe("Accordion generated contract", () => {
  test("uses native disclosure elements in every framework", async () => {
    const [astroItem, reactItem, astroTrigger, reactTrigger] = await Promise.all([
      readGeneratedAccordionPart("astro", "accordion-item"),
      readGeneratedAccordionPart("react", "accordion-item"),
      readGeneratedAccordionPart("astro", "accordion-trigger"),
      readGeneratedAccordionPart("react", "accordion-trigger"),
    ])

    for (const source of [astroItem, reactItem]) {
      expect(source).toContain("<details")
      expect(source).toContain('data-slot="accordion-item"')
    }
    for (const source of [astroTrigger, reactTrigger]) {
      expect(source).toContain("<summary")
      expect(source).toContain('data-slot="accordion-trigger"')
    }
  })

  test("keeps open and name available as native details attributes", async () => {
    const reactItem = await readGeneratedAccordionPart("react", "accordion-item")

    expect(reactItem).toContain('ComponentPropsWithoutRef<"details">')
    expect(reactItem).not.toContain("type AccordionItemProps = {")
  })

  test("progressively animates disclosure content and respects reduced motion", async () => {
    const sources = await Promise.all(
      (["astro", "react"] as const).flatMap((framework) => [
        readGeneratedAccordionPart(framework, "accordion-item"),
        readGeneratedAccordionPart(framework, "accordion-content"),
      ])
    )

    for (const source of sources) {
      expect(source).toContain("motion-reduce:")
    }
    for (const source of [sources[0], sources[2]]) {
      expect(source).toContain("interpolate-size:allow-keywords")
      expect(source).toContain("::details-content")
      expect(source).toContain("transition-behavior:allow-discrete")
    }
  })
})
