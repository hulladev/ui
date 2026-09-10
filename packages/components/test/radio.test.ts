import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

const repositoryRoot = resolve(import.meta.dir, "../../..")

async function readGeneratedRadio(framework: "astro" | "react"): Promise<string> {
  const extension = framework === "astro" ? "astro" : "tsx"
  return readFile(
    resolve(repositoryRoot, `generated/${framework}/radio/radio.${extension}`),
    "utf8"
  )
}

async function readGeneratedRadioGroup(framework: "astro" | "react"): Promise<string> {
  const extension = framework === "astro" ? "astro" : "tsx"
  return readFile(
    resolve(repositoryRoot, `generated/${framework}/radio/radio-group.${extension}`),
    "utf8"
  )
}

describe("Radio generated contract", () => {
  test("renders a native radio in every framework", async () => {
    const sources = await Promise.all([readGeneratedRadio("astro"), readGeneratedRadio("react")])

    for (const source of sources) {
      expect(source).toContain('type="radio"')
      expect(source).toContain('data-slot="radio"')
      expect(source).not.toContain('role="radio"')
    }
  })

  test("styles checked, focus, disabled, and invalid native states", async () => {
    const sources = await Promise.all([readGeneratedRadio("astro"), readGeneratedRadio("react")])

    for (const source of sources) {
      expect(source).toContain("checked:bg-primary")
      expect(source).toContain("checked:before:scale-100")
      expect(source).toContain("focus-visible:outline-focus-ring")
      expect(source).toContain("bg-disabled-foreground")
      expect(source).not.toContain("disabled:opacity-50")
      expect(source).toContain("aria-invalid:border-danger")
      expect(source).toContain("aria-invalid:checked:bg-danger")
    }
  })

  test("keeps its fixed type out of the React prop surface", async () => {
    const source = await readGeneratedRadio("react")

    expect(source).toContain('Omit<ComponentPropsWithRef<"input">, "type">')
  })
})

describe("RadioGroup generated contract", () => {
  test("renders a native fieldset in every framework", async () => {
    const sources = await Promise.all([
      readGeneratedRadioGroup("astro"),
      readGeneratedRadioGroup("react"),
    ])

    for (const source of sources) {
      expect(source).toContain("<fieldset")
      expect(source).toContain('data-slot="radio-group"')
      expect(source).not.toContain('role="radiogroup"')
    }
  })

  test("resets fieldset layout without recreating group behavior", async () => {
    const sources = await Promise.all([
      readGeneratedRadioGroup("astro"),
      readGeneratedRadioGroup("react"),
    ])

    for (const source of sources) {
      expect(source).toContain("m-0 grid min-w-0 gap-3 border-0 p-0 text-left")
    }
  })

  test("uses native fieldset props and renders React children explicitly", async () => {
    const source = await readGeneratedRadioGroup("react")

    expect(source).toContain('ComponentPropsWithRef<"fieldset">')
    expect(source).toContain("children: ReactNode")
    expect(source).toContain("{children}")
    expect(source).not.toContain("createContext")
  })
})
