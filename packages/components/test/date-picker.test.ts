import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { formatLocalDateTime, isLocalDateTime } from "../src/lib/date-picker"

const componentRoot = resolve(import.meta.dir, "../src")

async function readComponent(
  framework: "astro" | "react",
  family: "calendar" | "date-picker",
  component: "calendar" | "date-picker" | "date-time-picker"
): Promise<string> {
  const extension = framework === "astro" ? "astro" : "react.tsx"
  return readFile(resolve(componentRoot, framework, family, `${component}.${extension}`), "utf8")
}

describe("Calendar authored contract", () => {
  test("uses one accessible grid and stable interactive parts in both frameworks", async () => {
    for (const framework of ["astro", "react"] as const) {
      const source = await readComponent(framework, "calendar", "calendar")
      expect(source).toContain('role="grid"')
      expect(source).toContain('data-slot="calendar-heading"')
      expect(source).toContain('data-slot="calendar-weekday"')
      expect(source).toContain('data-slot="calendar-day"')
      expect(source).toContain('aria-live="polite"')
      expect(source).toContain("aria-selected")
      expect(source).toContain("@/+css/calendar.css")
    }
  })

  test("keeps single-day hover and selection shapes aligned without joining ranges", async () => {
    const styles = await readFile(resolve(componentRoot, "+css/calendar.css.ts"), "utf8")

    expect(styles).toContain("place-items-center rounded-md")
    expect(styles).toContain("hover:bg-hover-surface")
    expect(styles).toContain("data-[in-range=true]:rounded-none")
    expect(styles).toContain("data-[range-start=true]:rounded-l-md")
    expect(styles).toContain("data-[range-end=true]:rounded-r-md")
  })

  test("implements roving focus, paging, range preview, and locale direction", async () => {
    const behavior = await readFile(resolve(componentRoot, "lib/calendar.ts"), "utf8")
    for (const key of [
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "Home",
      "End",
      "PageUp",
      "PageDown",
    ]) {
      expect(behavior).toContain(key)
    }
    expect(behavior).toContain("event.shiftKey")
    expect(behavior).toContain("data-slot='calendar-day'")
    expect(behavior).toContain("button.tabIndex")
    expect(behavior).toContain("button.dataset.rangePreview")
    expect(behavior).toContain('getComputedStyle(root).direction === "rtl"')
  })
})

describe("Date picker composition", () => {
  test("uses input styling for triggers and shared components for picker contents", async () => {
    for (const framework of ["astro", "react"] as const) {
      const [datePicker, dateTimePicker] = await Promise.all([
        readComponent(framework, "date-picker", "date-picker"),
        readComponent(framework, "date-picker", "date-time-picker"),
      ])

      expect(datePicker).toContain("@/+css/form-control.css")
      expect(datePicker).toContain("<button")
      expect(dateTimePicker).toContain("@/+css/form-control.css")
      expect(datePicker).toContain("../calendar/calendar")
      expect(datePicker).toContain("../popover/popover")
      expect(dateTimePicker).toContain("../button/button")
      expect(dateTimePicker).toContain("../calendar/calendar")
      expect(dateTimePicker).toContain("../popover/popover")
      expect(dateTimePicker).toContain("../time-picker/time-picker")
    }
  })

  test("keeps form values machine-readable and display values localized", async () => {
    const behavior = await readFile(resolve(componentRoot, "lib/date-picker.ts"), "utf8")
    expect(behavior).toContain("formatCalendarValue")
    expect(behavior).toContain("singleInput.value")
    expect(behavior).toContain("startInput.value")
    expect(behavior).toContain("endInput.value")
    expect(behavior).toContain("formControl.value")
    expect(behavior).toContain('addEventListener("reset", handleFormReset)')
    expect(behavior).toContain('removeEventListener("reset", handleFormReset)')
  })

  test("omits disabled values from submission and supports external forms", async () => {
    for (const framework of ["astro", "react"] as const) {
      const [datePicker, dateTimePicker] = await Promise.all([
        readComponent(framework, "date-picker", "date-picker"),
        readComponent(framework, "date-picker", "date-time-picker"),
      ])

      expect(datePicker).toContain("form={form}")
      expect(datePicker).toContain("disabled={disabled}")
      expect(dateTimePicker).toContain("form={form}")
      expect(dateTimePicker).toContain("disabled={disabled}")
      if (framework === "react") {
        expect(datePicker).toContain("defaultValue={")
        expect(dateTimePicker).toContain('defaultValue={initialValue ?? ""}')
      }
    }
  })
})

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
