import { expect, test, type Page } from "@playwright/test"

const splitFor = (page: Page) => {
  const workbench = page.locator("#button .workbench")
  return {
    divider: workbench.getByRole("button", {
      name: "Resize Button example and code panels",
    }),
    preview: workbench.locator("[data-catalog-preview-resizable]"),
    source: workbench.locator("[data-source-inspector]"),
    workbench,
  }
}

const expectEvenSplit = async (page: Page) => {
  const { preview, source, workbench } = splitFor(page)
  const workbenchBox = await workbench.boundingBox()
  const previewBox = await preview.boundingBox()
  const sourceBox = await source.boundingBox()

  expect(workbenchBox).not.toBeNull()
  expect(previewBox).not.toBeNull()
  expect(sourceBox).not.toBeNull()
  if (!workbenchBox || !previewBox || !sourceBox) return

  expect(previewBox.width / workbenchBox.width).toBeCloseTo(0.5, 2)
  expect(sourceBox.width / workbenchBox.width).toBeCloseTo(0.5, 2)
}

test("defaults every viewport to an even horizontal split", async ({ page }) => {
  await page.goto("/#button", { waitUntil: "domcontentloaded" })

  for (const viewport of [
    { height: 900, width: 1440 },
    { height: 900, width: 900 },
  ]) {
    await page.setViewportSize(viewport)
    await expectEvenSplit(page)
  }
})

test("stacks the example and source at a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 })
  await page.goto("/#button", { waitUntil: "domcontentloaded" })

  const { divider, preview, source, workbench } = splitFor(page)
  const workbenchBox = await workbench.boundingBox()
  const previewBox = await preview.boundingBox()
  const sourceBox = await source.boundingBox()
  expect(workbenchBox).not.toBeNull()
  expect(previewBox).not.toBeNull()
  expect(sourceBox).not.toBeNull()
  if (!workbenchBox || !previewBox || !sourceBox) return

  expect(previewBox.width).toBeCloseTo(workbenchBox.width, 0)
  expect(sourceBox.width).toBeCloseTo(workbenchBox.width, 0)
  expect(sourceBox.y).toBeGreaterThanOrEqual(previewBox.y + previewBox.height)
  await expect(divider).toBeHidden()
})

test("server-renders source and highlights additional tabs without an editor runtime", async ({
  page,
}) => {
  const pageErrors: Error[] = []
  page.on("pageerror", (error) => pageErrors.push(error))
  await page.goto("/#button", { waitUntil: "domcontentloaded" })

  const source = splitFor(page).source
  await expect(source.locator("[data-source-output] code")).toContainText(
    '<ComponentPreview component="Button"'
  )
  await expect(source.locator("[data-diagnostics]")).toHaveText("Server highlighted")
  await expect(source).toHaveAttribute("data-source-inspector-ready", "true")

  await source.getByRole("tab", { name: /Minimal/ }).click()
  await source.locator("[data-source-framework-select]").selectOption("React")
  await expect(source.locator("[data-source-output] code")).toContainText(
    "export function ButtonDemo"
  )
  await expect(source.locator("[data-diagnostics]")).toHaveText("Copy-ready")

  await source.locator("[data-source-framework-select]").selectOption("Astro")
  await expect(source.locator("[data-source-output] pre")).toHaveAttribute("data-language", "astro")
  await expect(
    source.locator("[data-source-output] .th-keyword", { hasText: "import" }).first()
  ).toBeVisible()
  expect(pageErrors).toEqual([])
})

test("bounds long examples and scrolls source inside the workbench", async ({ page }) => {
  await page.setViewportSize({ height: 1200, width: 1440 })
  await page.goto("/#select", { waitUntil: "domcontentloaded" })

  const workbench = page.locator("#select .workbench")
  const source = workbench.locator("[data-source-inspector]")
  const codeScroller = source.locator('[data-slot="code-block-content"]')
  const workbenchBox = await workbench.boundingBox()
  const sourceBox = await source.boundingBox()

  expect(workbenchBox).not.toBeNull()
  expect(sourceBox).not.toBeNull()
  expect(workbenchBox?.height).toBeLessThanOrEqual(52 * 16 + 1)
  expect(sourceBox?.height).toBeCloseTo(workbenchBox?.height ?? 0, 0)
  await expect(codeScroller).toHaveCSS("overflow-y", "auto")
  expect(
    await codeScroller.evaluate((element) => element.scrollHeight > element.clientHeight)
  ).toBe(true)

  await codeScroller.evaluate((element) => {
    element.scrollTop = 320
  })
  expect(await codeScroller.evaluate((element) => element.scrollTop)).toBeGreaterThan(0)
})

test("resizes the example and code panes from the shared divider", async ({ page }) => {
  await page.goto("/#button", { waitUntil: "domcontentloaded" })

  const { divider, preview, source } = splitFor(page)
  const initialPreview = await preview.boundingBox()
  const initialSource = await source.boundingBox()
  expect(initialPreview).not.toBeNull()
  expect(initialSource).not.toBeNull()

  await divider.press("ArrowRight")

  const resizedPreview = await preview.boundingBox()
  const resizedSource = await source.boundingBox()
  expect(resizedPreview?.width).toBeCloseTo((initialPreview?.width ?? 0) + 10, 0)
  expect(resizedSource?.width).toBeCloseTo((initialSource?.width ?? 0) - 10, 0)
  await expect(preview).toHaveAttribute("data-state", "idle")
})
