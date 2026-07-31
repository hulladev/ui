import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

const repositoryRoot = resolve(import.meta.dir, "../../..")

async function readGeneratedSwitch(framework: "astro" | "react"): Promise<string> {
  const extension = framework === "astro" ? "astro" : "tsx"
  return readFile(
    resolve(repositoryRoot, `generated/${framework}/switch/switch.${extension}`),
    "utf8"
  )
}

describe("Switch generated contract", () => {
  test("uses checkbox form behavior with switch semantics in every framework", async () => {
    const sources = await Promise.all([readGeneratedSwitch("astro"), readGeneratedSwitch("react")])

    for (const source of sources) {
      expect(source).toContain('type="checkbox"')
      expect(source).toContain('role="switch"')
      expect(source).toContain('data-slot="switch"')
    }
  })

  test("keeps its fixed semantic attributes out of the React prop surface", async () => {
    const source = await readGeneratedSwitch("react")

    expect(source).toContain('Omit<ComponentPropsWithRef<"input">, "role" | "type">')
  })
})
