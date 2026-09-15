import { describe, expect, test } from "bun:test"
import { cn, vn } from "../src/lib/style"

describe("shared class composer", () => {
  test("lets consumer overrides win after variants and mixed inputs", () => {
    const size = vn({ sm: "h-7 px-2 text-xs", lg: "h-9 px-4 text-base" })
    expect(cn(size("sm"), ["rounded-md"], false, { "px-6": true }, undefined)).toBe(
      "h-7 text-xs rounded-md px-6"
    )
  })

  test("removes the legacy shadow-inner class when shadow-none follows it", () => {
    expect(cn("shadow-inner", "shadow-none")).toBe("shadow-none")
  })

  test("keeps modern inset shadows separate from regular shadows", () => {
    expect(cn("inset-shadow-sm", "shadow-none")).toBe("inset-shadow-sm shadow-none")
    expect(cn("inset-shadow-sm", "inset-shadow-none")).toBe("inset-shadow-none")
  })
})
