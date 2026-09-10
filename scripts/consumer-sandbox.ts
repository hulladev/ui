import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { dirname, join, relative, resolve, sep } from "node:path"

const repositoryRoot = resolve(import.meta.dir, "..")
const cliRepository = resolve(repositoryRoot, "../cli")
const registryRoot = resolve(repositoryRoot, "generated")
const sandboxRoot = resolve(repositoryRoot, ".consumer-sandbox")
const templatesRoot = resolve(repositoryRoot, "test/consumer-sandbox/templates")
const frameworks = ["astro", "react", "solid"] as const
const manifest = JSON.parse(await readFile(join(registryRoot, "ui.manifest.json"), "utf8")) as {
  library: { components: Record<string, { frameworks: string[] }> }
}

type Framework = (typeof frameworks)[number]

type SandboxReport = {
  cliPackage: string
  frameworks: Record<
    Framework,
    {
      build: "passed"
      commandLifecycle: "passed"
      idempotent: true
      project: string
      selfContained: true
    }
  >
  registry: string
  uiGenerator: {
    cjsImport: "passed"
    deterministic: true
    esmImport: "passed"
    frameworks: Framework[]
    package: string
  }
}

async function run(command: string[], cwd: string): Promise<void> {
  const child = Bun.spawn(command, {
    cwd,
    env: process.env,
    stderr: "inherit",
    stdin: "inherit",
    stdout: "inherit",
  })
  const exitCode = await child.exited
  if (exitCode !== 0) {
    throw new Error(`${command.join(" ")} failed in ${cwd} with exit code ${exitCode}`)
  }
}

async function writeJson(path: string, value: unknown): Promise<void> {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8")
}

async function preparePackedCli(): Promise<{
  binary: string
  packagePath: string
  uigenBinary: string
  uiPackagePath: string
}> {
  const toolingRoot = join(sandboxRoot, "tooling")
  const cliPackageJson = JSON.parse(
    await readFile(join(cliRepository, "package.json"), "utf8")
  ) as { version: string }
  const packageFileName = `hulla-${cliPackageJson.version}.tgz`
  const packagePath = join(toolingRoot, packageFileName)
  const uiPackageRoot = join(repositoryRoot, "packages/ui")
  const uiPackageJson = JSON.parse(await readFile(join(uiPackageRoot, "package.json"), "utf8")) as {
    name: string
    version: string
  }
  const uiPackageFileName = `${uiPackageJson.name
    .replace(/^@/, "")
    .replaceAll("/", "-")}-${uiPackageJson.version}.tgz`
  const uiPackagePath = join(toolingRoot, uiPackageFileName)
  await mkdir(toolingRoot, { recursive: true })
  await run(["bun", "pm", "pack", "--destination", toolingRoot], cliRepository)
  await run(["bun", "run", "build"], uiPackageRoot)
  await run(["bun", "pm", "pack", "--destination", toolingRoot], uiPackageRoot)
  await writeJson(join(toolingRoot, "package.json"), {
    name: "hulla-consumer-sandbox-tooling",
    private: true,
    dependencies: {
      "@hulla/ui": `file:./${uiPackageFileName}`,
      hulla: `file:./${packageFileName}`,
    },
  })
  await run(["bun", "install"], toolingRoot)
  return {
    binary: join(toolingRoot, "node_modules/.bin/hulla"),
    packagePath,
    uigenBinary: join(toolingRoot, "node_modules/.bin/uigen"),
    uiPackagePath,
  }
}

async function verifyPackedUiGenerator(input: {
  packagePath: string
  uigenBinary: string
}): Promise<SandboxReport["uiGenerator"]> {
  const toolingRoot = join(sandboxRoot, "tooling")
  await run([input.uigenBinary, "--help"], toolingRoot)
  await run([input.uigenBinary, "--version"], toolingRoot)
  await run(
    [
      "bun",
      "-e",
      'import { createLibrary } from "@hulla/ui"; if (typeof createLibrary !== "function") process.exit(1)',
    ],
    toolingRoot
  )
  await run(
    [
      "bun",
      "-e",
      'const { createLibrary } = require("@hulla/ui"); if (typeof createLibrary !== "function") process.exit(1)',
    ],
    toolingRoot
  )

  const fixtureRoot = join(toolingRoot, "generator-fixture")
  await mkdir(fixtureRoot, { recursive: true })
  await writeFile(
    join(fixtureRoot, "ui.ts"),
    [
      'import { createLibrary } from "@hulla/ui"',
      'import { fileURLToPath } from "node:url"',
      "",
      "export const ui = createLibrary({",
      '  name: "@fixture/ui",',
      '  version: "0.0.0-beta.0",',
      '  basePath: fileURLToPath(new URL(".", import.meta.url)),',
      '  frameworks: ["astro", "react", "solid"],',
      "  inputDirs: {",
      '    astro: "./src/astro",',
      '    react: "./src/react",',
      '    solid: "./src/solid",',
      "  },",
      "  outputDirs: {",
      '    rootDir: "./generated",',
      '    frameworks: { astro: "astro", react: "react", solid: "solid" },',
      "  },",
      "})",
      "",
    ].join("\n"),
    "utf8"
  )
  for (const framework of frameworks) {
    const componentRoot = join(fixtureRoot, "src", framework, "button")
    await writeJson(join(componentRoot, "package.json"), {
      name: `@fixture/${framework}-button`,
    })
  }
  await writeFile(
    join(fixtureRoot, "src/astro/button/button.astro"),
    "<button><slot /></button>\n",
    "utf8"
  )
  await writeFile(
    join(fixtureRoot, "src/react/button/button.react.tsx"),
    'export function Button() { return <button type="button" /> }\n',
    "utf8"
  )
  await writeFile(
    join(fixtureRoot, "src/solid/button/button.solid.tsx"),
    'export function Button() { return <button type="button" /> }\n',
    "utf8"
  )

  await run([input.uigenBinary, "./ui.ts"], fixtureRoot)
  const first = await hashDirectory(join(fixtureRoot, "generated"))
  await run([input.uigenBinary, "--check", "./ui.ts"], fixtureRoot)
  await run([input.uigenBinary, "./ui.ts"], fixtureRoot)
  const second = await hashDirectory(join(fixtureRoot, "generated"))
  if (JSON.stringify(first) !== JSON.stringify(second)) {
    throw new Error("Packed uigen regeneration was not deterministic")
  }

  return {
    cjsImport: "passed",
    deterministic: true,
    esmImport: "passed",
    frameworks: [...frameworks],
    package: toPortablePath(relative(repositoryRoot, input.packagePath)),
  }
}

async function prepareProject(
  framework: Framework,
  hullaBinary: string
): Promise<SandboxReport["frameworks"][Framework]> {
  const components = Object.entries(manifest.library.components)
    .filter(([, component]) => component.frameworks.includes(framework))
    .map(([name]) => name)
  const projectRoot = join(sandboxRoot, "projects", framework)
  await cp(join(templatesRoot, framework), projectRoot, { recursive: true })
  await run(["bun", "install"], projectRoot)
  await run([hullaBinary, "init", "--yes"], projectRoot)

  const source = toPortablePath(relative(projectRoot, registryRoot))
  await writeJson(join(projectRoot, ".hulla/ui.json"), {
    version: 1,
    sources: [source.startsWith(".") ? source : `./${source}`],
    installs: [],
    postAddUpdateStep: "",
  })

  await run([hullaBinary, "ui", "init", "--yes"], projectRoot)
  await run(
    [hullaBinary, "ui", "add", "--yes", "--framework", framework, ...components],
    projectRoot
  )
  await run(["bun", "run", "build"], projectRoot)
  const initial = await hashConsumerProject(projectRoot)

  await run([hullaBinary, "ui", "init", "--yes"], projectRoot)
  await run(
    [hullaBinary, "ui", "add", "--yes", "--framework", framework, ...components],
    projectRoot
  )
  await run(["bun", "run", "build"], projectRoot)
  const rerun = await hashConsumerProject(projectRoot)
  assertHashParity(framework, "init/add rerun", initial, rerun)

  await run([hullaBinary, "ui", "remove", "--yes", "badge"], projectRoot)
  if (await Bun.file(join(projectRoot, "src/components/badge/badge.astro")).exists()) {
    throw new Error(`${framework}: ui remove did not remove the Astro badge`)
  }
  if (await Bun.file(join(projectRoot, "src/components/badge/index.tsx")).exists()) {
    throw new Error(`${framework}: ui remove did not remove the badge index`)
  }
  await run([hullaBinary, "ui", "add", "--yes", "--framework", framework, "badge"], projectRoot)
  await run(["bun", "run", "build"], projectRoot)
  const restored = await hashConsumerProject(projectRoot)
  assertHashParity(framework, "remove/re-add", initial, restored)

  const packageJson = await readFile(join(projectRoot, "package.json"), "utf8")
  if (packageJson.includes(registryRoot) || packageJson.includes(cliRepository)) {
    throw new Error(`${framework}: local sibling path leaked into package.json`)
  }
  await verifyRegistryParity(framework, projectRoot, components)
  await verifyDetachedBuild(framework, projectRoot)

  return {
    build: "passed",
    commandLifecycle: "passed",
    idempotent: true,
    project: toPortablePath(relative(repositoryRoot, projectRoot)),
    selfContained: true,
  }
}

// The catalog imports this same registry. Installation may relocate imports, but
// must preserve every component, behavior helper, and the global theme verbatim.
async function verifyRegistryParity(
  framework: Framework,
  projectRoot: string,
  components: string[]
): Promise<void> {
  const frameworkRoot = join(registryRoot, framework)
  const glob = new Bun.Glob("**/*")
  let checked = 0
  for await (const file of glob.scan({ cwd: frameworkRoot, onlyFiles: true })) {
    if (file.endsWith("package.json")) continue
    const component = file.split("/")[0]!
    const isComponent = components.includes(component)
    if (!isComponent && !file.startsWith("lib/") && file !== "styles.css") continue
    const installed = join(projectRoot, "src", isComponent ? "components" : "", file)
    const expected = await readFile(join(frameworkRoot, file), "utf8")
    const actual = await readFile(installed, "utf8")
    // This fixture's only relocation is @/<family> -> @/components/<family>.
    const normalized = actual.replace(/(["'])@\/components\//g, "$1@/")
    if (normalized !== expected) {
      throw new Error(`${framework}: installed ${file} differs from the catalog registry`)
    }
    checked++
  }
  if (checked < components.length) throw new Error(`${framework}: incomplete registry parity check`)
  console.log(
    `[consumer:${framework}] ${checked} installed component/theme/runtime files match the catalog registry`
  )
}

async function verifyDetachedBuild(framework: Framework, projectRoot: string): Promise<void> {
  const detachedRoot = join(sandboxRoot, "detached", framework)
  await cp(projectRoot, detachedRoot, {
    filter: (source) => {
      const path = toPortablePath(relative(projectRoot, source))
      return ![".astro", ".hulla", "dist", "node_modules"].some(
        (excluded) => path === excluded || path.startsWith(`${excluded}/`)
      )
    },
    recursive: true,
  })
  await run(["bun", "install", "--frozen-lockfile"], detachedRoot)
  await run(["bun", "run", "build"], detachedRoot)
}

async function hashConsumerProject(projectRoot: string): Promise<Map<string, string>> {
  const result = new Map<string, string>()
  const glob = new Bun.Glob("**/*")
  for await (const path of glob.scan({ cwd: projectRoot, onlyFiles: true })) {
    if (
      path.startsWith("node_modules/") ||
      path.startsWith("dist/") ||
      path.startsWith(".astro/") ||
      path.startsWith(".hulla/.cache/")
    ) {
      continue
    }
    const hasher = new Bun.CryptoHasher("sha256")
    hasher.update(await Bun.file(join(projectRoot, path)).arrayBuffer())
    result.set(toPortablePath(path), hasher.digest("hex"))
  }
  return result
}

async function hashDirectory(root: string): Promise<[string, string][]> {
  const hashes: [string, string][] = []
  const glob = new Bun.Glob("**/*")
  for await (const path of glob.scan({ cwd: root, onlyFiles: true })) {
    const hasher = new Bun.CryptoHasher("sha256")
    hasher.update(await Bun.file(join(root, path)).arrayBuffer())
    hashes.push([toPortablePath(path), hasher.digest("hex")])
  }
  return hashes.sort(([left], [right]) => left.localeCompare(right))
}

function assertHashParity(
  framework: Framework,
  lifecycle: string,
  expected: Map<string, string>,
  received: Map<string, string>
): void {
  const expectedJson = JSON.stringify(Array.from(expected.entries()).sort())
  const receivedJson = JSON.stringify(Array.from(received.entries()).sort())
  if (expectedJson !== receivedJson) {
    const paths = new Set([...expected.keys(), ...received.keys()])
    const differences = Array.from(paths)
      .filter((path) => expected.get(path) !== received.get(path))
      .sort()
    throw new Error(
      `${framework}: ${lifecycle} was not idempotent:\n${differences.map((path) => `  - ${path}`).join("\n")}`
    )
  }
}

function toPortablePath(path: string): string {
  return path.split(sep).join("/")
}

await rm(sandboxRoot, { force: true, recursive: true })
await mkdir(sandboxRoot, { recursive: true })

const packedCli = await preparePackedCli()
const report = {
  cliPackage: toPortablePath(relative(repositoryRoot, packedCli.packagePath)),
  frameworks: {} as SandboxReport["frameworks"],
  registry: toPortablePath(relative(repositoryRoot, registryRoot)),
  uiGenerator: await verifyPackedUiGenerator({
    packagePath: packedCli.uiPackagePath,
    uigenBinary: packedCli.uigenBinary,
  }),
} satisfies SandboxReport

for (const framework of frameworks) {
  console.log(`\n[consumer:${framework}] preparing clean-room project`)
  report.frameworks[framework] = await prepareProject(framework, packedCli.binary)
}

await writeJson(join(sandboxRoot, "report.json"), report)
console.log(`\nConsumer sandbox ready: ${relative(repositoryRoot, sandboxRoot)}`)
