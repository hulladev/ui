import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

const repositoryRoot = resolve(import.meta.dir, "../../..")

async function readGeneratedTableCaption(framework: "astro" | "react"): Promise<string> {
  const extension = framework === "astro" ? "astro" : "tsx"
  return readFile(
    resolve(repositoryRoot, `generated/${framework}/table/table-caption.${extension}`),
    "utf8"
  )
}

describe("Table generated contract", () => {
  test("balances caption spacing below the table content", async () => {
    const sources = await Promise.all([
      readGeneratedTableCaption("astro"),
      readGeneratedTableCaption("react"),
    ])

    for (const source of sources) {
      expect(source).toContain("caption-bottom px-4 py-3")
      expect(source).not.toContain("caption-bottom px-4 pt-3")
    }
  })
})
