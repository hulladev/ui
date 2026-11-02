import Color from "colorjs.io"
import { readFile, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import { format } from "prettier"
import theme from "../src/theme.json"

const root = resolve(import.meta.dir, "../src")

function resolveColor(
  name: string,
  colors: Record<string, string>,
  seen = new Set<string>()
): Color {
  if (seen.has(name)) throw new Error(`Circular theme color: ${name}`)
  const value = colors[name]
  if (!value) throw new Error(`Missing theme color: ${name}`)
  const next = new Set([...seen, name])
  const reference = /^var\(--color-([\w-]+)\)$/.exec(value)
  if (reference) return resolveColor(reference[1]!, colors, next)
  const mix = /^color-mix\(in oklab, (.+) ([\d.]+)%, (.+)\)$/.exec(value)
  if (mix) {
    const color = (input: string) => {
      const key = /^var\(--color-([\w-]+)\)$/.exec(input)
      return key ? resolveColor(key[1]!, colors, next) : new Color(input)
    }
    return color(mix[1]!).mix(color(mix[3]!), 1 - Number(mix[2]) / 100, {
      space: "oklab",
      premultiplied: true,
    })
  }
  return new Color(value)
}

const entries = (values: Record<string, string | number>, prefix: string, suffix = "") =>
  Object.entries(values)
    .map(([key, value]) => `  --${prefix}-${key}: ${value}${suffix};`)
    .join("\n")

const css = `/* Generated from theme.json. Run bun run generate to update. */
@theme {
${entries(theme.light, "color")}
${entries(Object.fromEntries(Object.entries(theme.radius).map(([key, value]) => [key, value / 16])), "radius", "rem")}
}

:root:where(.dark, [data-theme="dark"]) {
${entries(theme.dark, "color")}
}
`

const palette = (colors: Record<string, string>) =>
  Object.fromEntries(
    Object.keys(theme.light).map((name) => [
      name.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase()),
      resolveColor(name, colors).to("srgb").toGamut().toString({ format: "hex" }),
    ])
  )

const native = `// Generated from theme.json. Run bun run generate to update.
// sRGB colors work on both React Native platforms without CSS or a styling runtime.
export const nativeThemes = ${JSON.stringify(
  {
    light: { colors: palette(theme.light), radius: theme.radius },
    dark: { colors: palette({ ...theme.light, ...theme.dark }), radius: theme.radius },
  },
  null,
  2
)}

export type NativeTheme = typeof nativeThemes.light & {
  fonts?: Partial<Record<"regular" | "medium" | "semibold" | "mono", string>>
}
`

for (const [path, content, parser] of [
  ["theme.css", css, "css"],
  ["react-native/lib/native-tokens.ts", native, "typescript"],
] as const) {
  const output = await format(content, {
    parser,
    semi: false,
    printWidth: 100,
    trailingComma: "es5",
  })
  const destination = resolve(root, path)
  if (process.argv.includes("--check")) {
    if ((await readFile(destination, "utf8").catch(() => "")) !== output) {
      throw new Error(`Theme output is stale: ${path}. Run bun run generate.`)
    }
  } else if ((await readFile(destination, "utf8").catch(() => "")) !== output) {
    await writeFile(destination, output)
  }
}
