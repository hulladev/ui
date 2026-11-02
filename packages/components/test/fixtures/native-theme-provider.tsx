import { mock } from "bun:test"
import { strict as assert } from "node:assert"
import { renderToStaticMarkup } from "react-dom/server"

mock.module("react-native", () => ({
  Appearance: { getColorScheme: () => "dark", addChangeListener: () => ({ remove() {} }) },
}))
const { NativeThemeProvider, nativeThemes, useNativeTheme } =
  await import("../../src/react-native/lib/native-theme")
let result: ReturnType<typeof useNativeTheme>
function Probe({ override }: { override?: ReturnType<typeof useNativeTheme> }) {
  result = useNativeTheme(override)
  return null
}

renderToStaticMarkup(
  <NativeThemeProvider mode="dark">
    <Probe />
  </NativeThemeProvider>
)
assert.equal(result!, nativeThemes.dark)
renderToStaticMarkup(
  <NativeThemeProvider mode="dark" fonts={{ regular: "App font" }}>
    <NativeThemeProvider fonts={{ mono: "Code font" }}>
      <Probe />
    </NativeThemeProvider>
  </NativeThemeProvider>
)
assert.equal(result!.colors.background, nativeThemes.dark.colors.background)
assert.deepEqual(result!.fonts, { regular: "App font", mono: "Code font" })
renderToStaticMarkup(
  <NativeThemeProvider mode="dark" fonts={{ regular: "App font" }}>
    <NativeThemeProvider mode="light">
      <Probe />
    </NativeThemeProvider>
  </NativeThemeProvider>
)
assert.equal(result!.colors.background, nativeThemes.light.colors.background)
assert.equal(result!.fonts?.regular, "App font")
renderToStaticMarkup(
  <NativeThemeProvider mode="dark">
    <Probe override={nativeThemes.light} />
  </NativeThemeProvider>
)
assert.equal(result!, nativeThemes.light)
const custom = {
  ...nativeThemes.light,
  colors: { ...nativeThemes.light.colors, primary: "#123456" },
}
renderToStaticMarkup(
  <NativeThemeProvider theme={custom}>
    <Probe />
  </NativeThemeProvider>
)
assert.equal(result!, custom)
