import { mock } from "bun:test"
import { createRequire } from "node:module"
import Color from "colorjs.io"

const platform = {
  Appearance: { getColorScheme: () => "dark", addChangeListener: () => ({ remove() {} }) },
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
}
// Bun's isolated installs can resolve different peer instances for the fixture
// and the packed color package. Both use the same native boundary in this test.
mock.module("react-native", () => platform)
mock.module(
  createRequire(import.meta.resolve("@hulla/style-native/color")).resolve("react-native"),
  () => platform
)
