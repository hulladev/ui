import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

const repositoryRoot = resolve(import.meta.dir, "../../..")

async function readGeneratedCheckbox(framework: "astro" | "react"): Promise<string> {
  const extension = framework === "astro" ? "astro" : "tsx"
  return readFile(
    resolve(repositoryRoot, `generated/${framework}/checkbox/checkbox.${extension}`),
    "utf8"
  )
}

describe("Checkbox generated contract", () => {
  test("renders a native checkbox in every framework", async () => {
    const sources = await Promise.all([
      readGeneratedCheckbox("astro"),
      readGeneratedCheckbox("react"),
    ])

    for (const source of sources) {
      expect(source).toContain('type="checkbox"')
      expect(source).toContain('data-slot="checkbox"')
      expect(source).not.toContain('role="checkbox"')
    }
  })

  test("styles checked, indeterminate, focus, disabled, and invalid native states", async () => {
    const sources = await Promise.all([
      readGeneratedCheckbox("astro"),
      readGeneratedCheckbox("react"),
    ])

    for (const source of sources) {
      expect(source).toContain("checked:bg-primary")
      expect(source).toContain("before:-translate-y-px")
      expect(source).toContain("dark:bg-foreground/[0.1]")
      expect(source).toContain("dark:checked:bg-primary")
      expect(source).toContain("indeterminate:bg-primary")
      expect(source).toContain("focus-visible:outline-focus-ring")
      expect(source).toContain("disabled:opacity-50")
      expect(source).toContain("aria-invalid:border-danger")
    }
  })

  test("keeps its fixed type out of the React prop surface", async () => {
    const source = await readGeneratedCheckbox("react")

    expect(source).toContain('Omit<ComponentPropsWithoutRef<"input">, "type">')
  })
})
