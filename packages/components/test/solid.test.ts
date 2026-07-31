import { describe, expect, test } from "bun:test"
import { readFile, readdir } from "node:fs/promises"
import { extname, relative, resolve } from "node:path"

const repositoryRoot = resolve(import.meta.dir, "../../..")
const solidRoot = resolve(repositoryRoot, "generated/solid")
const reactRoot = resolve(repositoryRoot, "generated/react")

async function filesUnder(root: string): Promise<string[]> {
  const files: string[] = []
  const visit = async (directory: string): Promise<void> => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = resolve(directory, entry.name)
      if (entry.isDirectory()) await visit(path)
      else if (entry.isFile()) files.push(relative(root, path))
    }
  }
  await visit(root)
  return files.sort()
}

describe("Solid generated parity", () => {
  test("publishes every component family available to Astro and React", async () => {
    const manifest = JSON.parse(
      await readFile(resolve(repositoryRoot, "generated/ui.manifest.json"), "utf8")
    ) as {
      library: { components: Record<string, { frameworks: string[] }> }
    }

    for (const component of Object.values(manifest.library.components)) {
      expect(component.frameworks).toEqual(["astro", "react", "solid"])
    }
  })

  test("emits a Solid counterpart for every React source component", async () => {
    const reactFiles = (await filesUnder(reactRoot)).filter(
      (file) => [".ts", ".tsx"].includes(extname(file)) && file !== "tsconfig.json"
    )
    const solidFiles = new Set(
      (await filesUnder(solidRoot)).filter(
        (file) => [".ts", ".tsx"].includes(extname(file)) && file !== "tsconfig.json"
      )
    )

    for (const file of reactFiles) expect(solidFiles.has(file)).toBe(true)
  })

  test("keeps React runtime artifacts out of Solid output", async () => {
    const files = (await filesUnder(solidRoot)).filter((file) => file.endsWith(".tsx"))
    const sources = await Promise.all(
      files.map((file) => readFile(resolve(solidRoot, file), "utf8"))
    )

    for (const source of sources) {
      expect(source).not.toMatch(/from ["']react(?:-dom)?(?:\/[^"']*)?["']/)
      expect(source).not.toContain("className=")
      expect(source).not.toMatch(/\skey=/)
      expect(source).not.toContain("ComponentPropsWithRef")
    }
  })

  test("ships Solid dependencies, compiler settings, and controller lifecycle helpers", async () => {
    const packageJson = JSON.parse(await readFile(resolve(solidRoot, "package.json"), "utf8")) as {
      dependencies?: Record<string, string>
    }
    const tsconfig = JSON.parse(await readFile(resolve(solidRoot, "tsconfig.json"), "utf8")) as {
      compilerOptions?: Record<string, unknown>
    }
    const lifecycle = await readFile(resolve(solidRoot, "lib/solid.ts"), "utf8")

    expect(packageJson.dependencies?.["solid-js"]).toBe("^1.9.0")
    expect(tsconfig.compilerOptions?.jsx).toBe("preserve")
    expect(tsconfig.compilerOptions?.jsxImportSource).toBe("solid-js")
    expect(lifecycle).toContain('from "solid-js"')
    expect(lifecycle).toContain("createLifecycleEffect")
    expect(lifecycle).toContain("onCleanup")
  })

  test("connects the same interactive DOM controllers as the existing frameworks", async () => {
    const contracts = [
      ["calendar/calendar.tsx", "connectCalendar"],
      ["combobox/combobox.tsx", "connectCombobox"],
      ["date-picker/date-picker.tsx", "connectDatePicker"],
      ["dialog/dialog.tsx", "connectDialog"],
      ["select/select.tsx", "connectSelect"],
      ["tabs/tabs.tsx", "connectTabs"],
      ["time-picker/time-picker.tsx", "connectTimePicker"],
      ["toggle/toggle.tsx", "connectToggle"],
      ["tree-view/tree-view.tsx", "connectTreeView"],
    ] as const

    for (const [file, controller] of contracts) {
      const source = await readFile(resolve(solidRoot, file), "utf8")
      expect(source).toContain(controller)
      expect(source).toMatch(/createLifecycleEffect|onMountEffect/)
    }
  })
})
