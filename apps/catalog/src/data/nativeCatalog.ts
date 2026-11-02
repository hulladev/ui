import manifest from "../../../../generated/ui.manifest.json" with { type: "json" }
import { nativeCatalogEntries } from "../../../native-catalog/src/entries"

const normalizeComponent = (component: string) => component.toLowerCase().replace(/[^a-z0-9]/g, "")
const componentAliases: Record<string, string> = { radioradiogroup: "radio" }

export function nativeCatalogEntryFor(component: string) {
  const key = normalizeComponent(component)
  const normalized = componentAliases[key] ?? key
  // Dedicated native pages already supply their own example and source. Do not
  // attach a second native framework preview to their "Native …" heading.
  if (normalized.startsWith("native")) return undefined
  return nativeCatalogEntries.find(
    (entry) =>
      normalizeComponent(entry.id) === normalized || normalizeComponent(entry.title) === normalized
  )
}

const components: Record<string, { frameworks: readonly string[] }> = manifest.library.components

export const nativeOnlyCatalogEntries = nativeCatalogEntries
  .filter((entry) => {
    const frameworks = components[entry.id]?.frameworks
    return frameworks?.length === 1 && frameworks[0] === "react-native"
  })
  .sort((left, right) => left.title.localeCompare(right.title))
