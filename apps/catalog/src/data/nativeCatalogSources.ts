import { nativeCatalogEntryFor } from "./nativeCatalog"
import type { CatalogSourceFile } from "./generatedCatalogSources"

// Raw source is read by Astro on the server. Runtime examples are loaded through
// the separate native preview runtime only when their framework is selected.
const exampleSources = import.meta.glob("../../../native-catalog/src/examples/*Example.tsx", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>

const previewSources = import.meta.glob("../components/previews/native/*.tsx", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>

const runtimeSources = import.meta.glob("../lib/native-preview-runtime.tsx", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>

export function nativeRenderedSourcesFor(family: string): CatalogSourceFile[] {
  const entry = nativeCatalogEntryFor(family)
  if (!entry) return []
  const files: {
    modules: Record<string, string>
    path: string
    filename: string
    label?: string
  }[] = [
    {
      modules: exampleSources,
      path: `../../../native-catalog/src/examples/${entry.title}Example.tsx`,
      filename: `apps/native-catalog/src/examples/${entry.title}Example.tsx`,
    },
    {
      modules: previewSources,
      path: `../components/previews/native/Native${entry.title}Preview.tsx`,
      filename: `apps/catalog/src/components/previews/native/Native${entry.title}Preview.tsx`,
    },
    {
      modules: previewSources,
      path: "../components/previews/native/NativePreviewFrame.tsx",
      filename: "apps/catalog/src/components/previews/native/NativePreviewFrame.tsx",
    },
  ]
  files.push({
    modules: runtimeSources,
    path: "../lib/native-preview-runtime.tsx",
    filename: "apps/catalog/src/lib/native-preview-runtime.tsx",
  })
  return files.flatMap(({ modules, path, filename, label }) => {
    const code = modules[path]
    return code === undefined
      ? []
      : [
          {
            code,
            filename,
            framework: "React Native" as const,
            language: filename.endsWith(".tsx") ? ("tsx" as const) : ("ts" as const),
            ...(label ? { label } : {}),
          },
        ]
  })
}
