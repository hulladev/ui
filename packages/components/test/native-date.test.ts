import { describe, expect, test } from "bun:test"
import {
  formatNativeDate,
  nativeDateDisabled,
  parseNativeDate,
} from "../src/react-native/lib/date.react-native"

describe("local native dates", () => {
  test("rejects rollover and ambiguous date strings", () => {
    for (const value of ["2026-02-29", "2026-13-01", "2026-04-31", "2026-1-01", "10/29/2026", ""]) {
      expect(parseNativeDate(value)).toBeUndefined()
    }
    expect(formatNativeDate(parseNativeDate("2024-02-29")!)).toBe("2024-02-29")
  })
  test("round trips local dates across daylight-saving boundaries and early years", () => {
    for (const value of ["2026-03-29", "2026-10-25", "0099-01-02", "2026-12-31"]) {
      expect(formatNativeDate(parseNativeDate(value)!)).toBe(value)
    }
  })
  test("applies inclusive valid limits and ignores invalid limits", () => {
    expect(nativeDateDisabled("2026-10-29", "2026-10-29", "2026-10-29")).toBe(false)
    expect(nativeDateDisabled("2026-10-28", "2026-10-29")).toBe(true)
    expect(nativeDateDisabled("2026-10-30", undefined, "2026-10-29")).toBe(true)
    expect(nativeDateDisabled("2026-10-29", "invalid", "2026-02-30")).toBe(false)
  })
})
