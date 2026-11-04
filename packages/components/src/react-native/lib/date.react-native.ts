export function parseNativeDate(value: string | undefined): Date | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return
  const [year, month, day] = value.split("-").map(Number)
  const date = new Date(0)
  date.setFullYear(year!, month! - 1, day!)
  date.setHours(12, 0, 0, 0)
  if (date.getFullYear() !== year || date.getMonth() !== month! - 1 || date.getDate() !== day)
    return
  return date
}

export function formatNativeDate(date: Date): string {
  return `${String(date.getFullYear()).padStart(4, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

export function nativeDateDisabled(value: string, min?: string, max?: string): boolean {
  return Boolean((parseNativeDate(min) && value < min!) || (parseNativeDate(max) && value > max!))
}
