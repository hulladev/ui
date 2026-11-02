import { processColor } from "react-native"
import type { NativeTheme } from "./native-tokens"

type Channels = [number, number, number, number]

function channels(color: string): Channels | undefined {
  const processed = processColor(color)
  if (typeof processed !== "number") return
  const argb = processed >>> 0
  return [
    ((argb >>> 16) & 255) / 255,
    ((argb >>> 8) & 255) / 255,
    (argb & 255) / 255,
    (argb >>> 24) / 255,
  ]
}

function serialize([red, green, blue, alpha]: Channels): string {
  const byte = (value: number) =>
    Math.round(Math.min(1, Math.max(0, value)) * 255)
      .toString(16)
      .padStart(2, "0")
  return `#${byte(red)}${byte(green)}${byte(blue)}${byte(alpha)}`
}

/** Apply opacity without changing the color's RGB channels, including existing alpha. */
export function nativeColorAlpha(color: string, opacity: number): string {
  const rgba = channels(color)
  return rgba
    ? serialize([rgba[0], rgba[1], rgba[2], rgba[3] * Math.min(1, Math.max(0, opacity))])
    : color
}

function linear(value: number): number {
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
}

function toLab([red, green, blue]: Channels): [number, number, number] {
  const r = linear(red),
    g = linear(green),
    b = linear(blue)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}

function fromLab([lightness, a, b]: number[]): [number, number, number] {
  const l = (lightness! + 0.3963377774 * a! + 0.2158037573 * b!) ** 3
  const m = (lightness! - 0.1055613458 * a! - 0.0638541728 * b!) ** 3
  const s = (lightness! - 0.0894841775 * a! - 1.291485548 * b!) ** 3
  const gamma = (value: number) =>
    value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055
  return [
    gamma(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    gamma(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    gamma(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ]
}

/** Match web color-mix(in oklab, ...), with amount representing the overlay fraction. */
export function nativeColorMix(base: string, overlay: string, amount: number): string {
  const first = channels(base),
    second = channels(overlay)
  if (!first || !second) return base
  const weight = Math.min(1, Math.max(0, amount))
  const firstAlpha = first[3] * (1 - weight),
    secondAlpha = second[3] * weight
  const alpha = firstAlpha + secondAlpha
  if (alpha === 0) return "#00000000"
  const a = toLab(first),
    b = toLab(second)
  const mixed = a.map((value, index) => (value * firstAlpha + b[index]! * secondAlpha) / alpha)
  return serialize([...fromLab(mixed), alpha])
}

export function isNativeDark(theme: NativeTheme): boolean {
  const rgba = channels(theme.colors.background)
  return rgba ? toLab(rgba)[0] < 0.5 : false
}
