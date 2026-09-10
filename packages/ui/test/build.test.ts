import { afterEach, describe, expect, test } from "bun:test"
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { createLibrary } from "../src/createLibrary"
import { GeneratedOutputOutOfDateError, type Config } from "../src/types.public"

const temporaryRoots: string[] = []

async function write(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, content, "utf8")
}

type Fixture = {
  config: Config<readonly ["astro", "react"]>
  generated: string
  library: string
  root: string
}

async function fixture(): Promise<Fixture> {
  const root = await mkdtemp(join(tmpdir(), "hulla-ui-test-"))
  temporaryRoots.push(root)
  const library = join(root, "library")
  const generated = join(root, "generated")

  await write(
    join(root, "package.json"),
    JSON.stringify({
      private: true,
      workspaces: { catalog: { "@fixture/style": "1.2.3" } },
    })
  )
  await write(
    join(library, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        module: "ESNext",
        moduleResolution: "Bundler",
        paths: { "@/*": ["./src/*"] },
      },
    })
  )
  await write(
    join(library, "src/lib/style.ts"),
    `export const vn = <T>(value: T) => Object.assign(() => "", { infer: value })\n` +
      `export const cn = (...values: unknown[]) => values.filter(Boolean).join(" ")\n`
  )
  await write(join(library, "src/styles.css"), `:root { --fixture: red; }\n`)
  await write(
    join(library, "src/+css/button.css.ts"),
    `import { vn } from "@/lib/style"\n` +
      `export const variants = vn({ primary: "primary-one" })\n` +
      `export const base = "base-one"\n`
  )

  const reactRoot = join(library, "src/react/button")
  await write(join(reactRoot, "package.json"), JSON.stringify({ name: "fixture/react/button" }))
  await write(
    join(reactRoot, "button.react.tsx"),
    `import { base, variants } from "@/+css/button.css"\n` +
      `import { cn } from "@/lib/style"\n` +
      `import { resolve as inline } from "@hulla/ui"\n` +
      `const $variants = inline(variants)\n` +
      `const $base = inline(base)\n` +
      `export const Button = () => <button className={cn($base, $variants())} />\n`
  )
  await write(join(reactRoot, "index.button.react.tsx"), `export * from "./button.react"\n`)
  await write(join(reactRoot, "helper.react.ts"), `export const helper = true\n`)

  const astroRoot = join(library, "src/astro/button")
  await write(join(astroRoot, "package.json"), JSON.stringify({ name: "fixture/astro/button" }))
  await write(join(astroRoot, "helper.astro"), `<span>helper</span>\n`)
  await write(
    join(astroRoot, "button.astro"),
    `---\n` +
      `import { base, variants } from "@/+css/button.css"\n` +
      `import { cn } from "@/lib/style"\n` +
      `import type { HTMLAttributes } from "astro/types"\n` +
      `import { resolve } from "@hulla/ui"\n` +
      `import Helper from "./helper.astro"\n` +
      `const $variants = resolve(variants)\n` +
      `type Props = HTMLAttributes<"button">\n` +
      `---\n` +
      `<button class={cn(resolve(base), $variants())} {...({} as Props)}><Helper /><slot /></button>\n`
  )

  const config = {
    name: "@fixture/ui",
    version: "1.0.0",
    basePath: library,
    tsconfigPath: "./tsconfig.json",
    frameworks: ["astro", "react"],
    inputDirs: {
      astro: "./src/astro",
      react: "./src/react",
    },
    outputDirs: {
      rootDir: "../generated",
      frameworks: { astro: "astro", react: "react" },
    },
    copyFilesRoot: "./src",
    copyFiles: {
      shared: ["lib/style.ts", { src: "styles.css", globalStyle: true }],
    },
    packageJson: {
      base: {
        dependencies: { "@fixture/style": "catalog:" },
        private: true,
      },
    },
    tsconfig: {
      frameworks: {
        react: { compilerOptions: { jsx: "react-jsx" } },
      },
    },
  } as const satisfies Config<readonly ["astro", "react"]>

  return { config, generated, library, root }
}

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { force: true, recursive: true }))
  )
})

describe("deterministic generation", () => {
  test("inlines declarations, rewrites framework suffixes, and emits availability metadata", async () => {
    const current = await fixture()
    const library = createLibrary(current.config)

    const first = await library.build({ quiet: true })
    expect(first.changed).toBe(true)
    expect(first.components).toBe(1)

    const react = await readFile(join(current.generated, "react/button/button.tsx"), "utf8")
    expect(react).toContain(`primary: "primary-one"`)
    expect(react).toContain(`const $base = "base-one"`)
    expect(react).not.toContain("@hulla/ui")
    expect(react).not.toContain("inline(")
    expect(react.match(/\bvn\b/g)?.length).toBe(2)
    expect(await readFile(join(current.generated, "react/button/index.tsx"), "utf8")).toContain(
      `"./button"`
    )

    const astro = await readFile(join(current.generated, "astro/button/button.astro"), "utf8")
    expect(astro).not.toContain("resolve(")
    expect(astro).not.toContain("const $base")
    expect(astro).toContain(`class={cn("base-one", $variants())}`)
    expect(astro).toContain(`from "@/lib/style"\nimport type`)
    expect(astro).toContain(`from "./helper.astro"`)
    expect(astro.match(/import .*vn.*from/g)?.length).toBe(1)

    const manifest = JSON.parse(await readFile(join(current.generated, "ui.manifest.json"), "utf8"))
    expect(manifest.library.components.button.frameworks).toEqual(["astro", "react"])
    expect(manifest.library.copyFiles.shared).toContainEqual({
      dest: "styles.css",
      globalStyle: true,
      required: true,
      src: "styles.css",
    })
    expect(manifest.files["react/button/button.tsx"]).toMatch(/^[a-f0-9]{64}$/)
    expect(
      JSON.parse(await readFile(join(current.generated, "react/package.json"), "utf8")).dependencies
    ).toEqual({ "@fixture/style": "1.2.3" })

    expect((await library.build({ quiet: true })).changed).toBe(false)
    expect((await library.build({ mode: "check", quiet: true })).changed).toBe(false)
  })

  test("rebuilds transitive inline dependencies without a stale cache", async () => {
    const current = await fixture()
    const library = createLibrary(current.config)
    await library.build({ quiet: true })

    const tokens = join(current.library, "src/+css/button.css.ts")
    const updated = (await readFile(tokens, "utf8")).replace("primary-one", "primary-two")
    await writeFile(tokens, updated, "utf8")

    expect((await library.build({ quiet: true })).changed).toBe(true)
    expect(await readFile(join(current.generated, "react/button/button.tsx"), "utf8")).toContain(
      "primary-two"
    )
    expect(await readFile(join(current.generated, "astro/button/button.astro"), "utf8")).toContain(
      "primary-two"
    )
  })

  test("prunes deleted files and whole components by replacing the complete tree", async () => {
    const current = await fixture()
    const library = createLibrary(current.config)
    await library.build({ quiet: true })

    await rm(join(current.library, "src/react/button/helper.react.ts"))
    await library.build({ quiet: true })
    expect(await Bun.file(join(current.generated, "react/button/helper.ts")).exists()).toBe(false)

    await rm(join(current.library, "src/astro/button"), { recursive: true })
    await library.build({ quiet: true })
    expect(await Bun.file(join(current.generated, "astro/button/button.astro")).exists()).toBe(
      false
    )
    const manifest = JSON.parse(await readFile(join(current.generated, "ui.manifest.json"), "utf8"))
    expect(manifest.library.components.button.frameworks).toEqual(["react"])
  })

  test("detects drift without overwriting it in check mode", async () => {
    const current = await fixture()
    const library = createLibrary(current.config)
    await library.build({ quiet: true })

    const output = join(current.generated, "react/button/button.tsx")
    await writeFile(output, "manually changed\n", "utf8")
    await expect(library.build({ mode: "check", quiet: true })).rejects.toBeInstanceOf(
      GeneratedOutputOutOfDateError
    )
    expect(await readFile(output, "utf8")).toBe("manually changed\n")

    await library.build({ quiet: true })
    expect(await readFile(output, "utf8")).toContain("primary-one")
  })

  test("leaves the previous output untouched when a required input fails", async () => {
    const current = await fixture()
    const working = createLibrary(current.config)
    await working.build({ quiet: true })
    const manifestBefore = await readFile(join(current.generated, "ui.manifest.json"), "utf8")

    const broken = createLibrary({
      ...current.config,
      copyFiles: { shared: ["lib/style.ts", "missing-required.css"] },
    })
    await expect(broken.build({ quiet: true })).rejects.toThrow("Required copy file")
    expect(await readFile(join(current.generated, "ui.manifest.json"), "utf8")).toBe(manifestBefore)
  })

  test("rejects framework traversal outside the generated root", async () => {
    const current = await fixture()
    const unsafe = createLibrary({
      ...current.config,
      outputDirs: {
        ...current.config.outputDirs,
        frameworks: { astro: "../generated-escape", react: "react" },
      },
    })
    await expect(unsafe.build({ quiet: true })).rejects.toThrow("must stay inside")
  })

  test("rejects output layouts that overlap source inputs", async () => {
    const current = await fixture()
    const unsafe = createLibrary({
      ...current.config,
      outputDirs: {
        rootDir: "./src/react/generated",
        frameworks: { astro: "astro", react: "react" },
      },
    })
    await expect(unsafe.build({ quiet: true })).rejects.toThrow(
      "must not overlap component sources"
    )
  })

  test("requires every framework output to be below the library output root", async () => {
    const current = await fixture()
    const unsafe = createLibrary({
      ...current.config,
      outputDirs: {
        ...current.config.outputDirs,
        frameworks: { astro: ".", react: "react" },
      },
    })
    await expect(unsafe.build({ quiet: true })).rejects.toThrow("must be below outputDirs.rootDir")
  })

  test("protects generated framework metadata from copy-file collisions", async () => {
    const current = await fixture()
    const unsafe = createLibrary({
      ...current.config,
      copyFiles: {
        ...current.config.copyFiles,
        react: [{ src: "styles.css", dest: "package.json" }],
      },
    })
    await expect(unsafe.build({ quiet: true })).rejects.toThrow(
      "Multiple sources emit the same react file"
    )
  })

  test("rejects global stylesheet metadata on non-CSS files", async () => {
    const current = await fixture()
    await expect(
      createLibrary({
        ...current.config,
        copyFiles: {
          shared: [{ src: "lib/style.ts", globalStyle: true }],
        },
      }).build({ quiet: true })
    ).rejects.toThrow("globalStyle must target a .css file")
  })

  test("skips optional copy files without affecting other framework output", async () => {
    const current = await fixture()
    const optional = createLibrary({
      ...current.config,
      copyFiles: {
        shared: [
          ...(current.config.copyFiles?.shared ?? []),
          { src: "optional.css", required: false },
        ],
      },
    })
    await optional.build({ quiet: true })
    expect(await Bun.file(join(current.generated, "astro/optional.css")).exists()).toBe(false)
    expect(await Bun.file(join(current.generated, "react/styles.css")).exists()).toBe(true)
  })

  test("does not require an unused copy-files root", async () => {
    const current = await fixture()
    await write(
      join(current.library, "src/react/button/button.react.tsx"),
      `export const Button = () => <button type="button" />\n`
    )
    await write(
      join(current.library, "src/astro/button/button.astro"),
      `---\nconst label = "button"\n---\n<button type="button">{label}</button>\n`
    )
    const withoutCopies = createLibrary({
      ...current.config,
      copyFiles: undefined,
      copyFilesRoot: "./missing-copy-root",
    })

    await expect(withoutCopies.build({ quiet: true })).resolves.toMatchObject({ changed: true })
  })
})

describe("inline module contract", () => {
  test("rejects local declaration dependencies with an actionable error", async () => {
    const current = await fixture()
    await write(
      join(current.library, "src/+css/button.css.ts"),
      `const shared = "shared"\nexport const variants = { primary: shared }\nexport const base = "base"\n`
    )
    await expect(createLibrary(current.config).build({ quiet: true })).rejects.toThrow(
      "depends on local declarations"
    )
  })

  test("rejects mixed runtime and inline imports from a module that is not emitted", async () => {
    const current = await fixture()
    const component = join(current.library, "src/react/button/button.react.tsx")
    await write(
      component,
      `import { base, variants } from "@/+css/button.css"\n` +
        `import { resolve } from "@hulla/ui"\n` +
        `const $variants = resolve(variants)\n` +
        `export const value = [$variants, base]\n`
    )
    await expect(createLibrary(current.config).build({ quiet: true })).rejects.toThrow(
      "mixes inlined and runtime bindings"
    )
  })
})
