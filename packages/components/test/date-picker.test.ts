import { describe, expect, test } from "bun:test"
import { formatLocalDateTime, isLocalDateTime } from "../src/lib/date-picker"

describe("Local date-time value", () => {
  test("accepts minute-precision wall-clock values without accepting instants", () => {
    expect(isLocalDateTime("2026-07-30T09:30")).toBe(true)
    expect(isLocalDateTime("2026-07-30T24:00")).toBe(false)
    expect(isLocalDateTime("2026-02-30T09:30")).toBe(false)
    expect(isLocalDateTime("2026-07-30T09:30Z")).toBe(false)
  })

  test("formats the machine value for display without changing it", () => {
    expect(formatLocalDateTime("2026-07-30T09:30", "en-US")).toBe("Jul 30, 2026, 09:30")
    expect(formatLocalDateTime("2026-07-30T09:30", "en-US", "h12")).toBe("Jul 30, 2026, 9:30 AM")
  })
})
