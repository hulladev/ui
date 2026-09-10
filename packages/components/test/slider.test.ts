import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

const repositoryRoot = resolve(import.meta.dir, "../../..")

async function readGeneratedSlider(framework: "astro" | "react"): Promise<string> {
  const extension = framework === "astro" ? "astro" : "tsx"
  return readFile(
    resolve(repositoryRoot, `generated/${framework}/slider/slider.${extension}`),
    "utf8"
  )
}

async function readGeneratedRangeSlider(
  framework: "astro" | "react",
  part: "range-slider" | "range-slider-min" | "range-slider-max"
): Promise<string> {
  const extension = framework === "astro" ? "astro" : "tsx"
  return readFile(
    resolve(repositoryRoot, `generated/${framework}/slider/${part}.${extension}`),
    "utf8"
  )
}

describe("Slider generated contract", () => {
  test("renders a native range input in every framework", async () => {
    const sources = await Promise.all([readGeneratedSlider("astro"), readGeneratedSlider("react")])

    for (const source of sources) {
      expect(source).toContain('type="range"')
      expect(source).toContain('data-slot="slider"')
      expect(source).not.toContain('role="slider"')
    }
  })

  test("styles the track, thumb, focus, disabled, invalid, and dark states", async () => {
    const sources = await Promise.all([readGeneratedSlider("astro"), readGeneratedSlider("react")])

    for (const source of sources) {
      expect(source).toContain("[&::-webkit-slider-runnable-track]:bg-foreground/[0.14]")
      expect(source).toContain("[&::-moz-range-track]:bg-foreground/[0.14]")
      expect(source).toContain("[&::-webkit-slider-thumb]:bg-primary")
      expect(source).toContain("[&::-moz-range-thumb]:bg-primary")
      expect(source).toContain("focus-visible:[&::-webkit-slider-thumb]:ring-focus-ring")
      expect(source).toContain("bg-disabled-foreground")
      expect(source).not.toContain("disabled:opacity-50")
      expect(source).toContain("aria-invalid:[&::-webkit-slider-thumb]:bg-danger")
      expect(source).toContain("dark:[&::-webkit-slider-runnable-track]:bg-foreground/[0.22]")
    }
  })

  test("keeps its fixed type out of the React prop surface", async () => {
    const source = await readGeneratedSlider("react")

    expect(source).toContain('Omit<ComponentPropsWithRef<"input">, "type">')
    expect(source).not.toContain("useState")
    expect(source).not.toContain("onChange")
  })

  test("composes a two-point range from two native slider inputs", async () => {
    const [astroRoot, reactRoot, astroMinimum, reactMinimum, astroMaximum, reactMaximum] =
      await Promise.all([
        readGeneratedRangeSlider("astro", "range-slider"),
        readGeneratedRangeSlider("react", "range-slider"),
        readGeneratedRangeSlider("astro", "range-slider-min"),
        readGeneratedRangeSlider("react", "range-slider-min"),
        readGeneratedRangeSlider("astro", "range-slider-max"),
        readGeneratedRangeSlider("react", "range-slider-max"),
      ])

    for (const root of [astroRoot, reactRoot]) {
      expect(root).toContain('role="group"')
      expect(root).toContain('data-slot="range-slider"')
      expect(root).toContain("--range-slider-start")
      expect(root).toContain("--range-slider-size")
      expect(root).toContain("connectRangeSlider")
    }

    for (const minimum of [astroMinimum, reactMinimum]) {
      expect(minimum).toContain('type="range"')
      expect(minimum).toContain('data-slot="range-slider-min"')
      expect(minimum).not.toContain('role="slider"')
    }

    for (const maximum of [astroMaximum, reactMaximum]) {
      expect(maximum).toContain('type="range"')
      expect(maximum).toContain('data-slot="range-slider-max"')
      expect(maximum).not.toContain('role="slider"')
    }
  })

  test("ships framework-neutral collision and selected-track behavior", async () => {
    const source = await readFile(
      resolve(repositoryRoot, "generated/astro/lib/range-slider.ts"),
      "utf8"
    )

    expect(source).toContain("if (start > end)")
    expect(source).toContain('minimumThumb.setAttribute("aria-valuemax", String(end))')
    expect(source).toContain('maximumThumb.setAttribute("aria-valuemin", String(start))')
    expect(source).toContain('root.style.setProperty("--range-slider-start"')
    expect(source).toContain('root.style.setProperty("--range-slider-size"')
  })
})
