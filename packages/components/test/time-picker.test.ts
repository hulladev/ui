import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import {
  createTimeOptions,
  formatTimeValue,
  isTimeValue,
  minutesToTime,
  timeToMinutes,
  timeWithinBounds,
} from "../src/lib/time-picker"

const componentRoot = resolve(import.meta.dir, "../src")

async function readTimePicker(framework: "astro" | "react"): Promise<string> {
  const extension = framework === "astro" ? "astro" : "react.tsx"
  return readFile(
    resolve(componentRoot, framework, "time-picker", `time-picker.${extension}`),
    "utf8"
  )
}

describe("Time value model", () => {
  test("accepts normalized local wall-clock values only", () => {
    expect(isTimeValue("00:00")).toBe(true)
    expect(isTimeValue("23:59")).toBe(true)
    expect(isTimeValue("9:30")).toBe(false)
    expect(isTimeValue("24:00")).toBe(false)
    expect(isTimeValue("09:60")).toBe(false)
    expect(isTimeValue("09:30Z")).toBe(false)
  })

  test("converts between time strings and minutes without a date or time zone", () => {
    expect(timeToMinutes("09:30")).toBe(570)
    expect(minutesToTime(570)).toBe("09:30")
    expect(minutesToTime(24 * 60)).toBe("23:59")
  })

  test("generates constrained options and preserves an off-step selected value", () => {
    const options = createTimeOptions({
      hourCycle: "h23",
      locale: "en-GB",
      max: "10:00",
      min: "09:00",
      step: 30,
      value: "09:15",
    })

    expect(options.map(({ value }) => value)).toEqual(["09:00", "09:15", "09:30", "10:00"])
    expect(options[0]?.label).toBe("09:00")
    expect(timeWithinBounds("09:30", "09:00", "10:00")).toBe(true)
    expect(timeWithinBounds("10:30", "09:00", "10:00")).toBe(false)
  })

  test("localizes display without changing the machine value", () => {
    expect(formatTimeValue("17:30", "en-US", "h12")).toBe("5:30 PM")
    expect(formatTimeValue("17:30", "en-GB", "h23")).toBe("17:30")
    expect(formatTimeValue("17:30", "en-US")).toBe("17:30")
  })
})

describe("TimePicker authored contract", () => {
  test("composes shared controls into a compact time field with a form bridge", async () => {
    for (const framework of ["astro", "react"] as const) {
      const source = await readTimePicker(framework)
      expect(source).toContain("../button/button")
      expect(source).toContain("../input/input-group")
      expect(source).toContain("../popover/popover")
      expect(source).toContain('role="group"')
      expect(source).toContain('data-slot="time-picker-hour"')
      expect(source).toContain('data-slot="time-picker-minute"')
      expect(source).toContain('type="text"')
      expect(source).toContain('pattern="[0-9]*"')
      expect(source).toContain('data-time-picker-action="commit"')
      expect(source).toContain('data-period="am"')
      expect(source).toContain('data-period="pm"')
      expect(source).toContain('type="hidden"')
      expect(source).toContain('data-slot="time-picker-input"')
      expect(source).toContain("form={form}")
      expect(source).toContain("disabled={disabled}")
      if (framework === "react") expect(source).toContain('defaultValue={initialValue ?? ""}')
    }
  })

  test("implements part-based keyboard navigation and selection", async () => {
    const behavior = await readFile(resolve(componentRoot, "lib/time-picker.ts"), "utf8")
    for (const key of [
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "Home",
      "End",
      "PageUp",
      "PageDown",
      "Enter",
      "Escape",
    ]) {
      expect(behavior).toContain(key)
    }
    expect(behavior).toContain('["hour", "minute", "period"]')
    expect(behavior).toContain("manualCandidate")
    expect(behavior).toContain("handleInput")
    expect(behavior).toContain("aria-invalid")
    expect(behavior).toContain("TIME_PICKER_VALUE_CHANGE_EVENT")
    expect(behavior).toContain('addEventListener("reset", handleFormReset)')
    expect(behavior).toContain('removeEventListener("reset", handleFormReset)')
  })
})
