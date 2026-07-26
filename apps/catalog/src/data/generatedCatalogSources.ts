export type CatalogSourceLanguage = "astro" | "css" | "ts" | "tsx"

export type CatalogSourceFile = {
  code: string
  filename: string
  framework: "Astro" | "React"
  label?: string
  language: CatalogSourceLanguage
}

const astroModules = import.meta.glob("../../../../generated/astro/**/*.astro", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>

const reactModules = import.meta.glob("../../../../generated/react/**/*.tsx", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>

const basename = (filename: string) => filename.split("/").at(-1) ?? filename
const withoutExtension = (filename: string) => filename.replace(/\.(?:astro|tsx)$/, "")

const fileLabel = (filename: string) =>
  withoutExtension(basename(filename))
    .split("-")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ")

const normalizedFilename = (path: string) => path.replace(/^.*\/generated\//, "generated/")

const familySources = (
  modules: Record<string, string>,
  framework: "Astro" | "React",
  language: "astro" | "tsx",
  family: string
): CatalogSourceFile[] => {
  const familyPath = `/generated/${framework.toLowerCase()}/${family}/`

  return Object.entries(modules)
    .filter(([path]) => path.includes(familyPath) && !path.endsWith("/index.tsx"))
    .map(([path, code]) => {
      const filename = normalizedFilename(path)
      return {
        code,
        filename,
        framework,
        label: fileLabel(filename),
        language,
      }
    })
    .sort((left, right) => {
      const mainFilename = `${family}.${language}`
      const leftIsMain = basename(left.filename) === mainFilename
      const rightIsMain = basename(right.filename) === mainFilename
      if (leftIsMain !== rightIsMain) return leftIsMain ? -1 : 1
      return left.filename.localeCompare(right.filename)
    })
}

export const generatedSourcesFor = (...families: string[]): CatalogSourceFile[] =>
  (["React", "Astro"] as const).flatMap((framework) =>
    families.flatMap((family) =>
      familySources(
        framework === "React" ? reactModules : astroModules,
        framework,
        framework === "React" ? "tsx" : "astro",
        family
      )
    )
  )
