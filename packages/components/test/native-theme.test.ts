import { describe, expect, test } from "bun:test"
import Color from "colorjs.io"
import { resolve } from "node:path"
import { nativeThemes } from "../src/react-native/lib/native-tokens"

describe("shared native theme", () => {
  for (const [mode, theme] of Object.entries(nativeThemes)) {
    test(`${mode} preserves color when mixing with transparency`, () => {
      // CSS color-mix uses premultiplied alpha. Mixing with transparent must
      // reduce opacity without darkening the underlying foreground or accent.
      for (const [mixed, original, alpha] of [
        [theme.colors.border, theme.colors.foreground, 0.14],
        [theme.colors.selectedSurface, theme.colors.primary, mode === "dark" ? 0.18 : 0.1],
        [theme.colors.disabledForeground, theme.colors.mutedForeground, 0.75],
      ] as const) {
        const actual = new Color(mixed).to("srgb")
        const expected = new Color(original).to("srgb")
        expect(actual.alpha).toBeCloseTo(alpha, 2)
        actual.coords.forEach((channel, index) => {
          expect(Math.abs(channel - expected.coords[index]!)).toBeLessThanOrEqual(1 / 255)
        })
      }
    })
  }
})

test("provider inherits themes and fonts, supports scopes, and preserves local overrides", () => {
  // Isolate the native Appearance shim from unrelated tests and module caches.
  const result = Bun.spawnSync(
    [process.execPath, resolve(import.meta.dir, "fixtures/native-theme-provider.tsx")],
    { cwd: resolve(import.meta.dir, ".."), stdout: "pipe", stderr: "pipe" }
  )
  expect(result.exitCode, new TextDecoder().decode(result.stderr)).toBe(0)
})

test("native color recipes match web opacity and premultiplied OKLab mixing", () => {
  const result = Bun.spawnSync(
    [process.execPath, resolve(import.meta.dir, "fixtures/native-color.ts")],
    {
      cwd: resolve(import.meta.dir, ".."),
      stdout: "pipe",
      stderr: "pipe",
    }
  )
  expect(result.exitCode, new TextDecoder().decode(result.stderr)).toBe(0)
})
