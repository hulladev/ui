import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

const repositoryRoot = resolve(import.meta.dir, "../../..")

async function readGeneratedComboboxPart(
  framework: "astro" | "react",
  part:
    | "combobox"
    | "combobox-content"
    | "combobox-empty"
    | "combobox-group"
    | "combobox-group-label"
    | "combobox-input"
    | "combobox-option"
): Promise<string> {
  const extension = framework === "astro" ? "astro" : "tsx"
  return readFile(
    resolve(repositoryRoot, `generated/${framework}/combobox/${part}.${extension}`),
    "utf8"
  )
}

describe("Combobox generated contract", () => {
  test("exports the editable composition in both frameworks", async () => {
    const parts = [
      "combobox",
      "combobox-content",
      "combobox-empty",
      "combobox-group",
      "combobox-group-label",
      "combobox-input",
      "combobox-option",
    ] as const

    for (const framework of ["astro", "react"] as const) {
      const sources = await Promise.all(
        parts.map((part) => readGeneratedComboboxPart(framework, part))
      )

      parts.forEach((part, index) => {
        expect(sources[index]).toContain(`data-slot="${part}"`)
      })
    }
  })

  test("uses an editable combobox, listbox popup, and native form bridge", async () => {
    const [root, input, content, option] = await Promise.all([
      readGeneratedComboboxPart("react", "combobox"),
      readGeneratedComboboxPart("react", "combobox-input"),
      readGeneratedComboboxPart("react", "combobox-content"),
      readGeneratedComboboxPart("react", "combobox-option"),
    ])

    expect(root).toContain('data-slot="combobox-native-control"')
    expect(input).toContain('role = "combobox"')
    expect(input).toContain('aria-autocomplete="list"')
    expect(content).toContain('role = "listbox"')
    expect(option).toContain('role="option"')
  })

  test("marks the editable input as an InputGroup-compatible control", async () => {
    const sources = await Promise.all([
      readGeneratedComboboxPart("astro", "combobox-input"),
      readGeneratedComboboxPart("react", "combobox-input"),
    ])

    for (const source of sources) {
      expect(source).toContain("data-control")
      expect(source).toContain('data-slot="combobox-input"')
    }
  })

  test("types single and multiple values independently", async () => {
    const source = await readGeneratedComboboxPart("react", "combobox")

    expect(source).toContain("value?: string")
    expect(source).toContain("value?: string[]")
    expect(source).toContain("onValueChange?: (value: string) => void")
    expect(source).toContain("onValueChange?: (value: string[]) => void")
  })

  test("provides a default check with framework-native indicator customization", async () => {
    const [astro, react] = await Promise.all([
      readGeneratedComboboxPart("astro", "combobox-option"),
      readGeneratedComboboxPart("react", "combobox-option"),
    ])

    for (const source of [astro, react]) {
      expect(source).toContain('data-slot="combobox-option-indicator"')
      expect(source).toContain('d="m3.25 8.25 3 3 6.5-6.5"')
    }
    expect(astro).toContain('<slot name="indicator" />')
    expect(react).toContain("indicator?: ReactNode")
  })
})
