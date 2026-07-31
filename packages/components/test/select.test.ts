import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

const repositoryRoot = resolve(import.meta.dir, "../../..")

async function readGeneratedSelectPart(
  framework: "astro" | "react",
  part:
    | "native-select"
    | "select"
    | "select-content"
    | "select-group"
    | "select-group-label"
    | "select-option"
    | "select-trigger"
    | "select-value"
): Promise<string> {
  const extension = framework === "astro" ? "astro" : "tsx"
  return readFile(
    resolve(repositoryRoot, `generated/${framework}/select/${part}.${extension}`),
    "utf8"
  )
}

describe("Select generated contract", () => {
  test("keeps NativeSelect as a transparent native control", async () => {
    const sources = await Promise.all([
      readGeneratedSelectPart("astro", "native-select"),
      readGeneratedSelectPart("react", "native-select"),
    ])

    for (const source of sources) {
      expect(source).toContain("<select")
      expect(source).toContain("data-control")
      expect(source).toContain('data-slot="control"')
    }
    expect(sources[1]).toContain('ComponentPropsWithRef<"select">')
  })

  test("exports the shallow custom composition in both frameworks", async () => {
    const parts = [
      "select",
      "select-content",
      "select-group",
      "select-group-label",
      "select-option",
      "select-trigger",
      "select-value",
    ] as const

    for (const framework of ["astro", "react"] as const) {
      const sources = await Promise.all(
        parts.map((part) => readGeneratedSelectPart(framework, part))
      )

      parts.forEach((part, index) => {
        expect(sources[index]).toContain(`data-slot="${part}"`)
      })
    }
  })

  test("uses listbox semantics and a native form bridge", async () => {
    const [root, content, option, group] = await Promise.all([
      readGeneratedSelectPart("react", "select"),
      readGeneratedSelectPart("react", "select-content"),
      readGeneratedSelectPart("react", "select-option"),
      readGeneratedSelectPart("react", "select-group"),
    ])

    expect(root).toContain('data-slot="select-native-control"')
    expect(content).toContain('role = "listbox"')
    expect(option).toContain('role="option"')
    expect(group).toContain('role = "group"')
  })

  test("marks the custom trigger as an InputGroup-compatible control", async () => {
    const sources = await Promise.all([
      readGeneratedSelectPart("astro", "select-trigger"),
      readGeneratedSelectPart("react", "select-trigger"),
    ])

    for (const source of sources) {
      expect(source).toContain("data-control")
      expect(source).toContain('data-slot="select-trigger"')
    }
  })

  test("types single and multiple values independently", async () => {
    const source = await readGeneratedSelectPart("react", "select")

    expect(source).toContain("value?: string")
    expect(source).toContain("value?: string[]")
    expect(source).toContain("onValueChange?: (value: string) => void")
    expect(source).toContain("onValueChange?: (value: string[]) => void")
  })

  test("provides a default check with framework-native indicator customization", async () => {
    const [astro, react] = await Promise.all([
      readGeneratedSelectPart("astro", "select-option"),
      readGeneratedSelectPart("react", "select-option"),
    ])

    for (const source of [astro, react]) {
      expect(source).toContain('data-slot="select-option-indicator"')
      expect(source).toContain('d="m3.25 8.25 3 3 6.5-6.5"')
    }
    expect(astro).toContain('<slot name="indicator" />')
    expect(react).toContain("indicator?: ReactNode")
  })
})
