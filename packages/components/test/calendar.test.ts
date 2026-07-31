import { describe, expect, test } from "bun:test"
import {
  addCalendarDays,
  addCalendarMonths,
  createCalendarView,
  deserializeCalendarValue,
  isCalendarDate,
  isCalendarMonth,
  normalizeCalendarValue,
  serializeCalendarValue,
} from "../src/lib/calendar"

describe("Calendar date model", () => {
  test("validates normalized ISO dates and months", () => {
    expect(isCalendarDate("2026-07-30")).toBe(true)
    expect(isCalendarDate("2024-02-29")).toBe(true)
    expect(isCalendarDate("2023-02-29")).toBe(false)
    expect(isCalendarDate("2026-7-3")).toBe(false)
    expect(isCalendarMonth("2026-07")).toBe(true)
    expect(isCalendarMonth("2026-13")).toBe(false)
  })

  test("performs date-only arithmetic without local time zones", () => {
    expect(addCalendarDays("2024-02-28", 1)).toBe("2024-02-29")
    expect(addCalendarDays("2024-02-29", 1)).toBe("2024-03-01")
    expect(addCalendarMonths("2024-01-31", 1)).toBe("2024-02-29")
    expect(addCalendarMonths("2023-01-31", 1)).toBe("2023-02-28")
    expect(addCalendarMonths("2024-03-31", -1)).toBe("2024-02-29")
  })

  test("normalizes incomplete and reversed ranges", () => {
    expect(normalizeCalendarValue({ start: "2026-07-30" }, "range")).toEqual({
      start: "2026-07-30",
    })
    expect(normalizeCalendarValue({ start: "2026-08-04", end: "2026-07-30" }, "range")).toEqual({
      start: "2026-07-30",
      end: "2026-08-04",
    })
  })

  test("round-trips serializable values", () => {
    const value = { start: "2026-07-30", end: "2026-08-04" }
    expect(deserializeCalendarValue(serializeCalendarValue(value), "range")).toEqual(value)
  })
})

describe("Calendar grid", () => {
  test("renders six complete weeks with locale weekday order", () => {
    const view = createCalendarView({
      locale: "en-US",
      month: "2026-07",
      today: "2026-07-30",
      weekStartsOn: 1,
    })

    expect(view.days).toHaveLength(42)
    expect(view.days[0]?.date).toBe("2026-06-29")
    expect(view.days[41]?.date).toBe("2026-08-09")
    expect(view.weekdays[0]?.longLabel).toBe("Monday")
    expect(view.days.find((day) => day.today)?.date).toBe("2026-07-30")
  })

  test("marks selected ranges and declaratively disabled intervals", () => {
    const view = createCalendarView({
      disabledDates: [{ start: "2026-07-20", end: "2026-07-22" }],
      month: "2026-07",
      selectionMode: "range",
      value: { start: "2026-07-28", end: "2026-08-02" },
      weekStartsOn: 1,
    })

    expect(view.days.find((day) => day.date === "2026-07-20")?.disabled).toBe(true)
    expect(view.days.find((day) => day.date === "2026-07-28")?.rangeStart).toBe(true)
    expect(view.days.find((day) => day.date === "2026-07-31")?.inRange).toBe(true)
    expect(view.days.find((day) => day.date === "2026-08-02")?.rangeEnd).toBe(true)
  })
})
