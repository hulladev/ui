import { strict as assert } from "node:assert"
import Color from "colorjs.io"

import "./native-platform"

const { nativeThemes } = await import("../../src/react-native/lib/tokens.react-native")
const { buttonColors } = await import("../../src/react-native/button/colors")
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
