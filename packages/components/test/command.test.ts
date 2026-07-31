import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

const repositoryRoot = resolve(import.meta.dir, "../../..")

async function readGeneratedCommandPart(
  framework: "astro" | "react",
  part:
    | "command"
    | "command-empty"
    | "command-group"
    | "command-group-label"
    | "command-input"
    | "command-item"
    | "command-list"
    | "command-separator"
    | "command-shortcut"
): Promise<string> {
  const extension = framework === "astro" ? "astro" : "tsx"
  return readFile(
    resolve(repositoryRoot, `generated/${framework}/command/${part}.${extension}`),
    "utf8"
  )
}

describe("Command generated contract", () => {
  test("exports the complete composition in both frameworks", async () => {
    const parts = [
      "command",
      "command-empty",
      "command-group",
      "command-group-label",
      "command-input",
      "command-item",
      "command-list",
      "command-separator",
      "command-shortcut",
    ] as const

    for (const framework of ["astro", "react"] as const) {
      const sources = await Promise.all(
        parts.map((part) => readGeneratedCommandPart(framework, part))
      )

      parts.forEach((part, index) => {
        expect(sources[index]).toContain(`data-slot="${part}"`)
      })
    }
  })

  test("uses the active-descendant combobox and listbox pattern", async () => {
    const [input, list, item, empty] = await Promise.all([
      readGeneratedCommandPart("react", "command-input"),
      readGeneratedCommandPart("react", "command-list"),
      readGeneratedCommandPart("react", "command-item"),
      readGeneratedCommandPart("react", "command-empty"),
    ])

    expect(input).toContain('role = "combobox"')
    expect(input).toContain('aria-autocomplete="list"')
    expect(list).toContain('role = "listbox"')
    expect(item).toContain('role="option"')
    expect(empty).toContain('role = "status"')
  })

  test("exposes owned filtering, looping, and selection behavior", async () => {
    const root = await readGeneratedCommandPart("react", "command")
    const behavior = await readFile(
      resolve(repositoryRoot, "generated/react/lib/command.ts"),
      "utf8"
    )

    expect(root).toContain("filter?: boolean")
    expect(root).toContain("loop?: boolean")
    expect(root).toContain("onSelect?: (value: string) => void")
    expect(behavior).toContain("connectCommand")
    expect(behavior).toContain("COMMAND_SELECT_EVENT")
    expect(behavior).toContain("data-keywords")
  })
})
