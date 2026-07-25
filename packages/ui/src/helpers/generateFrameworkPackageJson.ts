import type { PackageJson } from "type-fest"
import type { NormalizedConfig } from "../config"

const DEPENDENCY_FIELDS = [
  "dependencies",
  "devDependencies",
  "optionalDependencies",
  "peerDependencies",
] as const

function resolveCatalogReferences(
  packageJson: PackageJson,
  catalog: Readonly<Record<string, string>>
): PackageJson {
  const result = structuredClone(packageJson)

  for (const field of DEPENDENCY_FIELDS) {
    const dependencies = result[field]
    if (!dependencies) continue

    for (const [name, version] of Object.entries(dependencies)) {
      if (typeof version !== "string" || !version.startsWith("catalog:")) continue
      const catalogName = version.slice("catalog:".length) || name
      const resolved = catalog[catalogName]
      if (!resolved) {
        throw new Error(`No workspace catalog version exists for ${name} (${version})`)
      }
      dependencies[name] = resolved
    }
  }

  return result
}

export function generateFrameworkPackageJson(
  config: NormalizedConfig,
  framework: string,
  catalog: Readonly<Record<string, string>>
): PackageJson {
  let packageJson = {
    name: `${config.name}-${framework}`,
    private: true,
    ...structuredClone(config.packageJson?.base ?? {}),
  } as PackageJson

  if (config.packageJson?.modifier) {
    packageJson = config.packageJson.modifier(packageJson)
  }
  const frameworkModifier = config.packageJson?.frameworkModifiers?.[framework]
  if (frameworkModifier) {
    packageJson = frameworkModifier(packageJson)
  }

  return resolveCatalogReferences(packageJson, catalog)
}
