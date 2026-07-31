import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

const componentRoot = resolve(import.meta.dir, "../src")

describe("Dialog authored contract", () => {
  test("targets overlay and content styling explicitly", async () => {
    const [astro, react] = await Promise.all([
      readFile(resolve(componentRoot, "astro/dialog/dialog.astro"), "utf8"),
      readFile(resolve(componentRoot, "react/dialog/dialog.react.tsx"), "utf8"),
    ])

    expect(astro).toContain("contentClass?: string")
    expect(astro).toContain("contentStyle?:")
    expect(astro).toContain("$overlayVariant(variant),\n    className")
    expect(astro).toContain("$variant(variant),\n      contentClass")
    expect(react).toContain("contentClassName?: string")
    expect(react).toContain("contentStyle?: CSSProperties")
    expect(react).toContain("$overlayVariant(variant),\n        className")
    expect(react).toContain("$variant(variant),\n          contentClassName")
  })
})
