#!/usr/bin/env node

import { execFileSync, spawnSync } from "node:child_process"
import { gzipSync } from "node:zlib"
import { fileURLToPath, pathToFileURL } from "node:url"
import { dirname, join, resolve } from "node:path"
import { readFileSync, readdirSync } from "node:fs"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "../..")
const deps = process.env.HULLA_COMPOSER_BENCH_DEPS ?? "/private/tmp/hulla-composer-benchmark-deps"
const modules = join(deps, "node_modules")

const buttonBase =
  "relative inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap border font-medium leading-none tracking-[-0.01em] antialiased [&>svg]:shrink-0 transition-[background-color,border-color,color,translate] duration-120 ease-out motion-safe:enabled:not-aria-disabled:active:translate-y-px motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:border-disabled-border disabled:bg-disabled-surface disabled:text-disabled-foreground disabled:shadow-none"
const buttonSizes = {
  sm: "h-7 gap-1.5 rounded-[6px] px-2.5 text-xs [&>svg]:size-3.5",
  md: "h-8 gap-1.5 rounded-[7px] px-3 text-sm [&>svg]:size-4",
  lg: "h-9 gap-2 rounded-[8px] px-3 text-base [&>svg]:size-4.5",
}
const buttonVariants = {
  primary:
    "border-primary bg-primary text-primary-foreground shadow-(--shadow-control) enabled:not-aria-disabled:active:shadow-none disabled:shadow-none aria-disabled:shadow-none enabled:hover:border-[color-mix(in_oklab,var(--color-primary)_84%,var(--color-foreground))] enabled:hover:bg-[color-mix(in_oklab,var(--color-primary)_84%,var(--color-foreground))] enabled:active:bg-[color-mix(in_oklab,var(--color-primary)_76%,var(--color-foreground))] dark:enabled:hover:border-[color-mix(in_oklab,var(--color-primary)_84%,var(--color-background))] dark:enabled:hover:bg-[color-mix(in_oklab,var(--color-primary)_84%,var(--color-background))] dark:enabled:active:bg-[color-mix(in_oklab,var(--color-primary)_76%,var(--color-background))]",
  secondary:
    "border-border bg-foreground/5 text-foreground shadow-none enabled:hover:border-foreground/20 enabled:hover:bg-foreground/10 enabled:active:bg-foreground/15 dark:enabled:bg-foreground/[0.12] dark:enabled:hover:bg-foreground/20 dark:enabled:active:bg-foreground/25",
  inverted:
    "border-foreground bg-foreground text-background shadow-(--shadow-control) enabled:not-aria-disabled:active:shadow-none disabled:shadow-none aria-disabled:shadow-none enabled:hover:border-foreground/80 enabled:hover:bg-foreground/80 enabled:active:bg-foreground/70",
  danger:
    "border-danger bg-danger text-on-emphasis shadow-(--shadow-control) enabled:not-aria-disabled:active:shadow-none disabled:shadow-none aria-disabled:shadow-none enabled:hover:border-[color-mix(in_oklab,var(--color-danger)_84%,var(--color-foreground))] enabled:hover:bg-[color-mix(in_oklab,var(--color-danger)_84%,var(--color-foreground))] enabled:active:bg-[color-mix(in_oklab,var(--color-danger)_76%,var(--color-foreground))] dark:shadow-none dark:enabled:border-danger/25 dark:enabled:bg-danger/15 dark:enabled:text-danger dark:enabled:hover:border-danger/40 dark:enabled:hover:bg-danger/[0.22] dark:enabled:active:bg-danger/25",
  ghost:
    "border-transparent bg-transparent text-muted-foreground shadow-none enabled:hover:bg-foreground/[0.08] enabled:hover:text-foreground enabled:active:bg-foreground/[0.12]",
  outline:
    "border-foreground/20 bg-transparent text-foreground shadow-none enabled:hover:border-foreground/40 enabled:hover:bg-foreground/[0.08] enabled:active:bg-foreground/[0.12]",
}
const overrides = [
  "px-6 text-danger",
  "h-12 rounded-full bg-success text-on-emphasis",
  "dark:bg-background/72 hover:bg-selected-hover-surface",
  "font-mono tracking-[0.08em] uppercase",
  "[&>svg]:size-5 disabled:bg-transparent",
  "border-[color-mix(in_oklab,var(--color-danger)_84%,var(--color-foreground))] shadow-none",
]

function filesUnder(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? filesUnder(path) : [path]
  })
}

function realCorpus() {
  const sourceRoot = join(root, "packages/components/src")
  const strings = new Set()
  for (const path of filesUnder(sourceRoot)) {
    if (!/\.(?:tsx|ts|astro)$/.test(path)) continue
    const source = readFileSync(path, "utf8")
    for (const match of source.matchAll(/(?:"([^"\n]{2,})"|'([^'\n]{2,})')/g)) {
      const value = match[1] ?? match[2]
      if (/\s/.test(value) && /(?:^|\s)(?:[a-z-]+:|\[|[a-z]+-)/.test(value)) strings.add(value)
    }
  }
  return [...strings]
}

async function implementations() {
  const [{ style }, tailwind, cnPackage] = await Promise.all([
    import(pathToFileURL(join(modules, "@hulla/style/dist/es/index.mjs"))),
    import(pathToFileURL(join(modules, "tailwind-merge/dist/bundle-mjs.mjs"))),
    import(pathToFileURL(join(modules, "cn/dist/index.js"))),
  ])
  return {
    tailwind: style({ composer: tailwind.twMerge }),
    "cn-twMerge": style({ composer: cnPackage.twMerge }),
    "cn-cn": style({ composer: cnPackage.cn }),
  }
}

function consume(result, state) {
  return (
    (state +
      result.length +
      (result.charCodeAt(0) || 0) +
      (result.charCodeAt(result.length - 1) || 0)) >>>
    0
  )
}

async function worker(implementationName, scenarioName) {
  const implementation = (await implementations())[implementationName]
  if (!implementation) throw new Error(`Unknown implementation: ${implementationName}`)
  const { cn, vn } = implementation
  const size = vn(buttonSizes)
  const variant = vn(buttonVariants)
  const corpus = realCorpus()
  const variantNames = Object.keys(buttonVariants)
  const sizeNames = Object.keys(buttonSizes)
  const scenarios = {
    "final-stable": {
      iterations: 150_000,
      run(i) {
        return cn(buttonBase, buttonVariants.primary, buttonSizes.md, overrides[0])
      },
    },
    "full-stable": {
      iterations: 120_000,
      run(i) {
        return cn(buttonBase, variant("primary"), size("md"), overrides[0])
      },
    },
    "full-rotating": {
      iterations: 80_000,
      run(i) {
        return cn(
          buttonBase,
          variant(variantNames[i % variantNames.length]),
          size(sizeNames[i % sizeNames.length]),
          overrides[i % overrides.length]
        )
      },
    },
    "real-corpus": {
      iterations: 60_000,
      run(i) {
        return cn(corpus[i % corpus.length], overrides[i % overrides.length])
      },
    },
    "mixed-inputs": {
      iterations: 60_000,
      run(i) {
        return cn(
          buttonBase,
          i % 2 ? [buttonSizes.sm, null, false] : undefined,
          { "text-danger": i % 3 === 0, "bg-selected-surface": i % 3 !== 0 },
          overrides[i % overrides.length]
        )
      },
    },
    "cold-diverse": {
      iterations: 8_000,
      run(i, epoch) {
        return cn(
          buttonBase,
          buttonVariants[variantNames[i % variantNames.length]],
          `[--bench-${epoch}-${i}:${i}] px-${i % 97}`
        )
      },
    },
  }
  const scenario = scenarios[scenarioName]
  if (!scenario) throw new Error(`Unknown scenario: ${scenarioName}`)
  let checksum = 0
  for (let round = 0; round < 2; round++) {
    for (let i = 0; i < scenario.iterations; i++)
      checksum = consume(scenario.run(i, round), checksum)
  }
  const samples = []
  for (let round = 0; round < 5; round++) {
    const start = performance.now()
    for (let i = 0; i < scenario.iterations; i++)
      checksum = consume(scenario.run(i, round + 2), checksum)
    samples.push(((performance.now() - start) * 1e6) / scenario.iterations)
  }
  samples.sort((a, b) => a - b)
  process.stdout.write(
    JSON.stringify({
      implementationName,
      scenarioName,
      ns: samples[2],
      samples,
      checksum,
      corpus: corpus.length,
    })
  )
}

async function compatibility() {
  const impls = await implementations()
  const corpus = realCorpus()
  const explicit = [
    "font-sans font-[Inter]",
    "font-[Inter] font-sans",
    "font-medium font-[Inter]",
    "font-[Inter,sans-serif] font-bold",
    "font-sans font-(family-name:--f)",
    "font-(family-name:--f) font-bold",
    "font-[family-name:var(--x)] font-bold",
    "text-muted-foreground text-primary-text",
    "bg-surface bg-foreground/[0.12]",
    "border-border border-danger/40",
    "hover:bg-hover-surface hover:bg-selected-hover-surface",
    "dark:enabled:bg-danger/15 dark:enabled:bg-danger/25",
    "[&>svg]:size-4 [&>svg]:size-5",
    "tracking-[-0.01em] tracking-[0.08em]",
    "shadow-(--shadow-control) shadow-none",
    "bg-[color-mix(in_oklab,var(--color-primary)_84%,var(--color-foreground))] bg-primary",
    "data-[state=active]:bg-selected-surface data-[state=active]:bg-hover-surface",
    "group-data-[orientation=vertical]/tabs-list:w-full group-data-[orientation=vertical]/tabs-list:w-fit",
  ]
  const cases = [...explicit]
  for (let i = 0; i < corpus.length; i++) {
    cases.push(corpus[i])
    cases.push(`${corpus[i]} ${overrides[i % overrides.length]}`)
    cases.push(`${corpus[i]} ${corpus[(i + 1) % corpus.length]}`)
  }
  const mismatches = []
  for (const input of cases) {
    const expected = impls.tailwind.cn(input)
    for (const name of ["cn-twMerge", "cn-cn"]) {
      const actual = impls[name].cn(input)
      if (actual !== expected) mismatches.push({ name, input, expected, actual })
    }
  }
  const mixed = [
    [buttonBase, [buttonSizes.sm, null, false], { "text-danger": true, hidden: false }],
    [undefined, false, "p-2", ["p-4", ["text-sm"]]],
    [{ "bg-surface": true, "bg-danger": 1, ignored: 0 }, new Set(["px-2", "px-3"])],
  ]
  for (const args of mixed) {
    const expected = impls.tailwind.cn(...args)
    for (const name of ["cn-twMerge", "cn-cn"]) {
      const actual = impls[name].cn(...args)
      if (actual !== expected)
        mismatches.push({ name, input: JSON.stringify(args), expected, actual })
    }
  }
  return { cases: cases.length + mixed.length, corpus: corpus.length, mismatches }
}

async function bundleSizes() {
  const esbuild = await import(pathToFileURL(join(modules, "esbuild/lib/main.js")))
  const stylePath = join(modules, "@hulla/style/dist/es/index.mjs")
  const entries = {
    tailwind: `import {style} from ${JSON.stringify(stylePath)};import{twMerge}from${JSON.stringify(join(modules, "tailwind-merge/dist/bundle-mjs.mjs"))};export const{cn,vn}=style({composer:twMerge});`,
    "cn-twMerge": `import {style} from ${JSON.stringify(stylePath)};import{twMerge}from${JSON.stringify(join(modules, "cn/dist/index.js"))};export const{cn,vn}=style({composer:twMerge});`,
    "cn-cn": `import {style} from ${JSON.stringify(stylePath)};import{cn as composer}from${JSON.stringify(join(modules, "cn/dist/index.js"))};export const{cn,vn}=style({composer});`,
  }
  const result = {}
  for (const [name, stdin] of Object.entries(entries)) {
    const build = await esbuild.build({
      stdin: { contents: stdin, resolveDir: root },
      bundle: true,
      format: "esm",
      platform: "browser",
      minify: true,
      write: false,
      treeShaking: true,
    })
    const bytes = build.outputFiles[0].contents
    result[name] = { minified: bytes.length, gzip: gzipSync(bytes, { level: 9 }).length }
  }
  return result
}

async function metadata() {
  const readPackage = (name) =>
    JSON.parse(readFileSync(join(modules, name, "package.json"), "utf8"))
  const packages = ["@hulla/style", "tailwind-merge", "cn", "esbuild"].map((name) => {
    const pkg = readPackage(name)
    return { name, version: pkg.version, repository: pkg.repository }
  })
  const generatedButton = readFileSync(join(root, "generated/react/button/button.tsx"), "utf8")
  if (
    ![buttonBase, ...Object.values(buttonSizes), ...Object.values(buttonVariants)].every((value) =>
      generatedButton.includes(value)
    )
  ) {
    throw new Error("Benchmark button fixture drifted from generated/react/button/button.tsx")
  }
  return packages
}

async function main() {
  const runtimes = ["node", "bun"].filter(
    (runtime) => spawnSync(runtime, ["--version"], { encoding: "utf8" }).status === 0
  )
  const scenarios = [
    "final-stable",
    "full-stable",
    "full-rotating",
    "real-corpus",
    "mixed-inputs",
    "cold-diverse",
  ]
  const names = ["tailwind", "cn-twMerge", "cn-cn"]
  const results = []
  for (const runtime of runtimes) {
    for (const scenario of scenarios) {
      for (const name of names) {
        const stdout = execFileSync(
          runtime,
          [fileURLToPath(import.meta.url), "--worker", name, scenario],
          {
            encoding: "utf8",
            env: { ...process.env, HULLA_COMPOSER_BENCH_DEPS: deps },
          }
        )
        results.push({ runtime, ...JSON.parse(stdout) })
      }
    }
  }
  process.stdout.write(
    `${JSON.stringify({ metadata: await metadata(), compatibility: await compatibility(), bundles: await bundleSizes(), results }, null, 2)}\n`
  )
}

if (process.argv[2] === "--worker") await worker(process.argv[3], process.argv[4])
else await main()
