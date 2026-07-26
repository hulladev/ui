import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

const repositoryRoot = resolve(import.meta.dir, "../../..")

async function readGeneratedBreadcrumbsPart(
  framework: "astro" | "react",
  part: "breadcrumb-item" | "breadcrumbs"
): Promise<string> {
  const extension = framework === "astro" ? "astro" : "tsx"
  return readFile(
    resolve(repositoryRoot, `generated/${framework}/breadcrumbs/${part}.${extension}`),
    "utf8"
  )
}

describe("Breadcrumbs generated contract", () => {
  test("owns the native navigation landmark and ordered list", async () => {
    const [astro, react] = await Promise.all([
      readGeneratedBreadcrumbsPart("astro", "breadcrumbs"),
      readGeneratedBreadcrumbsPart("react", "breadcrumbs"),
    ])

    for (const source of [astro, react]) {
      expect(source).toContain("<nav")
      expect(source).toContain("<ol")
      expect(source).toContain('data-slot="breadcrumbs"')
      expect(source).toContain('"Breadcrumb"')
    }
  })

  test("keeps each path level a native list item", async () => {
    const [astro, react] = await Promise.all([
      readGeneratedBreadcrumbsPart("astro", "breadcrumb-item"),
      readGeneratedBreadcrumbsPart("react", "breadcrumb-item"),
    ])

    for (const source of [astro, react]) {
      expect(source).toContain("<li")
      expect(source).toContain('data-slot="breadcrumb-item"')
      expect(source).toContain("aria-[current=page]")
      expect(source).toContain("[&>a]")
      expect(source).toContain("[&:not(:first-child)]:before")
    }
    expect(react).toContain('ComponentPropsWithoutRef<"li">')
  })

  test("exports only the landmark and item components", async () => {
    const index = await readFile(
      resolve(repositoryRoot, "generated/react/breadcrumbs/index.tsx"),
      "utf8"
    )

    expect(index).toContain('export * from "./breadcrumbs"')
    expect(index).toContain('export * from "./breadcrumb-item"')
    expect(index).not.toContain("BreadcrumbLink")
    expect(index).not.toContain("BreadcrumbPage")
    expect(index).not.toContain("BreadcrumbList")
  })
})
