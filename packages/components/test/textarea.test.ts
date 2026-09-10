import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

const repositoryRoot = resolve(import.meta.dir, "../../..")

async function readGeneratedTextarea(framework: "astro" | "react"): Promise<string> {
  const extension = framework === "astro" ? "astro" : "tsx"
  return readFile(
    resolve(repositoryRoot, `generated/${framework}/textarea/textarea.${extension}`),
    "utf8"
  )
}

describe("Textarea generated contract", () => {
  test("renders a native textarea in every framework", async () => {
    const sources = await Promise.all([
      readGeneratedTextarea("astro"),
      readGeneratedTextarea("react"),
    ])

    for (const source of sources) {
      expect(source).toContain("<textarea")
      expect(source).toContain("data-control")
      expect(source).toContain('data-slot="textarea"')
      expect(source).not.toContain('role="textbox"')
    }
  })

  test("shares Input variants while using multiline size treatments", async () => {
    const sources = await Promise.all([
      readGeneratedTextarea("astro"),
      readGeneratedTextarea("react"),
    ])

    for (const source of sources) {
      expect(source).toContain("outline:")
      expect(source).toContain("filled:")
      expect(source).toContain("underline:")
      expect(source).toContain("min-h-20")
      expect(source).toContain("min-h-24")
      expect(source).toContain("min-h-28")
      expect(source).toContain("resize-y")
    }
  })

  test("styles focus, disabled, and invalid native states", async () => {
    const sources = await Promise.all([
      readGeneratedTextarea("astro"),
      readGeneratedTextarea("react"),
    ])

    for (const source of sources) {
      expect(source).toContain("focus-visible:outline-none")
      expect(source).toContain("focus-visible:border-focus-ring")
      expect(source).toContain("disabled:cursor-not-allowed")
      expect(source).toContain("aria-invalid:border-danger")
    }
  })

  test("extends native React props and renders children explicitly", async () => {
    const source = await readGeneratedTextarea("react")

    expect(source).toContain('ComponentPropsWithRef<"textarea">')
    expect(source).toContain("children,")
    expect(source).toContain("{children}")
    expect(source).not.toContain("createContext")
  })

  test("renders the native value as Astro text content instead of a literal slot", async () => {
    const source = await readGeneratedTextarea("astro")

    expect(source).toContain("{value}")
    expect(source).not.toContain("<slot")
  })
})
