import { describe, expect, test } from "bun:test"
import {
  createTimeOptions,
  formatTimeValue,
  isTimeValue,
  minutesToTime,
  timeToMinutes,
  timeWithinBounds,
} from "../src/lib/time-picker"

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
