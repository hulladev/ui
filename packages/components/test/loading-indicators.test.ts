import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

const repositoryRoot = resolve(import.meta.dir, "../../..")

async function readGenerated(
  component: "progress" | "spinner",
  framework: "astro" | "react"
): Promise<string> {
  const extension = framework === "astro" ? "astro" : "tsx"
  return readFile(
    resolve(repositoryRoot, `generated/${framework}/${component}/${component}.${extension}`),
    "utf8"
  )
}

describe("Spinner generated contract", () => {
  test("renders a decorative, motion-aware SVG in every framework", async () => {
    const sources = await Promise.all([
      readGenerated("spinner", "astro"),
      readGenerated("spinner", "react"),
    ])

    for (const source of sources) {
      expect(source).toContain("<svg")
      expect(source).toContain('data-slot="spinner"')
      expect(source).toContain('"aria-hidden": ariaHidden =')
      expect(source).toContain("motion-reduce:animate-none")
    }
  })
})

describe("Progress generated contract", () => {
  test("renders a native determinate or indeterminate progress element", async () => {
    const sources = await Promise.all([
      readGenerated("progress", "astro"),
      readGenerated("progress", "react"),
    ])

    for (const source of sources) {
      expect(source).toContain("<progress")
      expect(source).toContain('data-slot="progress"')
      expect(source).toContain("indeterminate:")
      expect(source).not.toContain('role="progressbar"')
      expect(source).not.toContain("max = 100")
    }
  })
})
