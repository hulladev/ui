import { mock } from "bun:test"
import { strict as assert } from "node:assert"
import Color from "colorjs.io"

// Isolate the platform color parser; the production helper uses React Native's processColor.
mock.module("react-native", () => ({
  processColor(value: string) {
    const color = new Color(value).to("srgb")
    const byte = (number: number) => Math.round(Math.max(0, Math.min(1, number)) * 255)
    return (
      ((byte(color.alpha) << 24) |
        (byte(color.coords[0]!) << 16) |
        (byte(color.coords[1]!) << 8) |
        byte(color.coords[2]!)) >>>
      0
    )
  },
}))
const nativeColors = await import("../../src/react-native/lib/native-color")
const { nativeColorAlpha, nativeColorMix, isNativeDark } = nativeColors
mock.module("@/lib/native-color", () => nativeColors)
const { nativeThemes } = await import("../../src/react-native/lib/native-tokens")
const { buttonColors } = await import("../../src/react-native/button/colors")
assert.equal(nativeColorAlpha("red", 0.2), "#ff000033")
assert.equal(nativeColorAlpha("#12345680", 0.5), "#12345640")
assert.equal(nativeColorAlpha("rgba(12,34,56,0.5)", 0.5), "#0c223840")
assert.equal(isNativeDark(nativeThemes.dark), true)
assert.equal(isNativeDark(nativeThemes.light), false)
for (const [base, overlay] of [
  ["#fcfeff", "#c83a35"],
  ["#040404", "#f36069"],
  ["#2258e5", "#050c1e"],
  ["#2258e5", "transparent"],
  ["#12345680", "#ffcc0077"],
]) {
  for (const amount of [0, 0.03, 0.16, 0.5, 0.82, 1]) {
    const actual = new Color(nativeColorMix(base!, overlay!, amount)).to("srgb")
    const expected = new Color(base!)
      .mix(new Color(overlay!), amount, { space: "oklab", premultiplied: true })
      .to("srgb")
    actual.coords.forEach((value, index) =>
      assert.ok(
        Math.abs(value - Math.min(1, Math.max(0, expected.coords[index]!))) <= 2 / 255,
        `${base}/${overlay}/${amount}: channel ${index}`
      )
    )
    assert.ok(Math.abs(actual.alpha - expected.alpha) <= 2 / 255)
  }
}
for (const theme of Object.values(nativeThemes)) {
  for (const variant of [
    "primary",
    "secondary",
    "inverted",
    "outline",
    "ghost",
    "danger",
  ] as const) {
    const recipe = buttonColors(theme, variant, false)
    const surface = new Color(recipe.background)
    const background =
      surface.alpha === 0
        ? new Color(theme.colors.background)
        : surface.alpha === 1
          ? surface
          : new Color(theme.colors.background).mix(surface, surface.alpha, { space: "srgb" })
    assert.ok(
      Color.contrast(recipe.foreground, background, "WCAG21") >= 4.5,
      `${variant}: label contrast`
    )
  }
}
