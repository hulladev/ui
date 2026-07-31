import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

const repositoryRoot = resolve(import.meta.dir, "../../..")

async function readGeneratedInputPart(
  framework: "astro" | "react",
  part: "input" | "input-group"
): Promise<string> {
  const extension = framework === "astro" ? "astro" : "tsx"
  return readFile(
    resolve(repositoryRoot, `generated/${framework}/input/${part}.${extension}`),
    "utf8"
  )
}

describe("InputGroup generated contract", () => {
  test("styles controls through the shared data-control marker", async () => {
    const sources = await Promise.all([
      readGeneratedInputPart("astro", "input-group"),
      readGeneratedInputPart("react", "input-group"),
    ])

    for (const source of sources) {
      expect(source).toContain("[&>[data-control]]")
      expect(source).toContain("has-[[data-control][aria-invalid=true]]")
      expect(source).not.toContain("[&>[data-slot=control]]")
    }
  })

  test("marks Input as a compatible control without changing its slot", async () => {
    const sources = await Promise.all([
      readGeneratedInputPart("astro", "input"),
      readGeneratedInputPart("react", "input"),
    ])

    for (const source of sources) {
      expect(source).toContain("data-control")
      expect(source).toContain('data-slot="control"')
    }
  })
})
