import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

const repositoryRoot = resolve(import.meta.dir, "../../..")

async function readGeneratedPaginationPart(
  framework: "astro" | "react",
  part: "pagination" | "pagination-item"
): Promise<string> {
  const extension = framework === "astro" ? "astro" : "tsx"
  return readFile(
    resolve(repositoryRoot, `generated/${framework}/pagination/${part}.${extension}`),
    "utf8"
  )
}

describe("Pagination generated contract", () => {
  test("owns the native navigation landmark and unordered list", async () => {
    const [astro, react] = await Promise.all([
      readGeneratedPaginationPart("astro", "pagination"),
      readGeneratedPaginationPart("react", "pagination"),
    ])

    for (const source of [astro, react]) {
      expect(source).toContain("<nav")
      expect(source).toContain("<ul")
      expect(source).toContain('data-slot="pagination"')
      expect(source).toContain('data-slot="pagination-list"')
      expect(source).toContain('"Pagination"')
    }
  })

  test("keeps page state native and composable", async () => {
    const [astro, react] = await Promise.all([
      readGeneratedPaginationPart("astro", "pagination-item"),
      readGeneratedPaginationPart("react", "pagination-item"),
    ])

    for (const source of [astro, react]) {
      expect(source).toContain("<li")
      expect(source).toContain('data-slot="pagination-item"')
      expect(source).toContain("[&>[aria-current=page]]")
      expect(source).toContain("text-background!")
      expect(source).toContain("[&>[aria-disabled=true]]")
      expect(source).toContain("[&>a[href]]")
      expect(source).toContain("[&>button:not(:disabled)]")
      expect(source).toContain("[&>button:disabled]")
    }
    expect(react).toContain('ComponentPropsWithRef<"li">')
  })

  test("exports only the landmark and item components", async () => {
    const index = await readFile(
      resolve(repositoryRoot, "generated/react/pagination/index.tsx"),
      "utf8"
    )

    expect(index).toContain('export * from "./pagination"')
    expect(index).toContain('export * from "./pagination-item"')
    expect(index).not.toContain("PaginationLink")
    expect(index).not.toContain("PaginationPrevious")
    expect(index).not.toContain("PaginationNext")
  })
})
