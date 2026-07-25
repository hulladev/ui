import type { TsConfigJson } from "type-fest"
import type { NormalizedConfig } from "../config"

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function deepMerge<T>(target: T, source: unknown): T {
  if (!isRecord(target) || !isRecord(source)) return structuredClone(source) as T
  const result: Record<string, unknown> = structuredClone(target)

  for (const [key, value] of Object.entries(source)) {
    result[key] =
      isRecord(value) && isRecord(result[key])
        ? deepMerge(result[key], value)
        : structuredClone(value)
  }
  return result as T
}

const DEFAULT_TSCONFIG: TsConfigJson = {
  compilerOptions: {
    allowJs: true,
    checkJs: false,
    lib: ["ES2022", "DOM", "DOM.Iterable"],
    module: "ESNext",
    moduleResolution: "Bundler",
    noEmit: true,
    noUncheckedIndexedAccess: true,
    paths: {
      "@/*": ["./*"],
    },
    skipLibCheck: true,
    strict: true,
    target: "ES2022",
  },
  exclude: ["node_modules"],
  include: ["**/*"],
}

export function generateFrameworkTsconfig(
  config: NormalizedConfig,
  framework: string
): TsConfigJson {
  const base = deepMerge(DEFAULT_TSCONFIG, config.tsconfig?.base ?? {})
  return deepMerge(base, config.tsconfig?.frameworks?.[framework] ?? {})
}
