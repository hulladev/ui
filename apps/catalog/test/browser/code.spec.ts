import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("/#code", { waitUntil: "domcontentloaded" })
})

test("highlights Astro frontmatter and component scripts", async ({ page }) => {
  await expect(page.locator("#code [data-source-inspector]")).toHaveAttribute(
    "data-source-inspector-ready",
    "true",
    { timeout: 15_000 }
  )
  const output = page.locator("#code [data-source-output]")
  const frontmatterImport = output.locator("[data-code-line]", {
    hasText: 'import { Check, Copy, FileCode, Info } from "@lucide/astro"',
  })
  const componentScript = output.locator("[data-code-line]", {
    hasText: "const syncCodePlayground = (preview: HTMLElement) => {",
  })

  await expect(output.locator("pre")).toHaveAttribute("data-language", "astro")
  await expect(frontmatterImport.locator(".th-keyword", { hasText: "import" }).first()).toHaveText(
    "import"
  )
  await expect(componentScript.locator(".th-keyword", { hasText: "const" }).first()).toHaveText(
    "const"
  )
  await expect(componentScript.locator(".th-type", { hasText: "HTMLElement" }).first()).toHaveText(
    "HTMLElement"
  )
})

test("groups file tabs at the code block edge and updates the active path", async ({ page }) => {
  const preview = page.locator('[data-preview-component="code-preview"]')
  const tabs = preview.locator("[data-code-tabs]")
  const block = tabs.locator('[data-slot="code-block"]')
  const header = block.locator('[data-slot="code-block-header"]')
  const list = block.getByRole("tablist", { name: "Implementation file" })
  const astro = list.getByRole("tab", { name: "release-button.astro" })
  const react = list.getByRole("tab", { name: "release-button.tsx" })
  const body = block.locator('[data-slot="code-block-body"]')
  const actions = block.locator('[data-slot="code-block-actions"]')
  const content = block.locator(
    '[data-slot="tabs-content"]:not([hidden]) [data-slot="code-block-content"]'
  )
  const path = block.locator("[data-code-path]")

  const [blockBox, headerBox, listBox, astroBox, reactBox, bodyBox, actionsBox, contentBox] =
    await Promise.all([
      block.boundingBox(),
      header.boundingBox(),
      list.boundingBox(),
      astro.boundingBox(),
      react.boundingBox(),
      body.boundingBox(),
      actions.boundingBox(),
      content.boundingBox(),
    ])

  expect(blockBox).not.toBeNull()
  expect(headerBox).not.toBeNull()
  expect(listBox).not.toBeNull()
  expect(astroBox).not.toBeNull()
  expect(reactBox).not.toBeNull()
  expect(bodyBox).not.toBeNull()
  expect(actionsBox).not.toBeNull()
  expect(contentBox).not.toBeNull()
  expect(Math.abs((listBox?.x ?? 0) - (blockBox?.x ?? 0))).toBeLessThanOrEqual(2)
  expect(Math.abs((listBox?.height ?? 0) - (headerBox?.height ?? 0))).toBeLessThanOrEqual(1)
  expect(Math.abs((astroBox?.height ?? 0) - (headerBox?.height ?? 0))).toBeLessThanOrEqual(1)
  expect(
    Math.abs((astroBox?.x ?? 0) + (astroBox?.width ?? 0) - (reactBox?.x ?? 0))
  ).toBeLessThanOrEqual(1)
  expect(
    Math.abs(
      (listBox?.x ?? 0) + (listBox?.width ?? 0) - ((blockBox?.x ?? 0) + (blockBox?.width ?? 0))
    )
  ).toBeLessThanOrEqual(2)
  expect((actionsBox?.x ?? 0) + (actionsBox?.width ?? 0)).toBeLessThanOrEqual(
    (bodyBox?.x ?? 0) + (bodyBox?.width ?? 0)
  )
  const actionsCenter = (actionsBox?.y ?? 0) + (actionsBox?.height ?? 0) / 2
  const firstLineTop = (contentBox?.y ?? 0) + 16
  expect(actionsCenter).toBeGreaterThanOrEqual(firstLineTop)
  expect(actionsCenter).toBeLessThanOrEqual(firstLineTop + 24)
  await expect(path).toHaveText("src/components/release-button.astro")

  await react.click()
  await expect(react).toHaveAttribute("aria-selected", "true")
  await expect(path).toHaveText("src/components/release-button.tsx")
})

test("keeps code metadata inside a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/#code", { waitUntil: "domcontentloaded" })

  const preview = page.locator('[data-preview-component="code-preview"]')
  const block = preview.locator('[data-slot="code-block"]').first()
  const actions = block.locator('[data-slot="code-block-actions"]')
  const path = block.locator('[data-slot="code-block-path"]')
  const [previewBox, blockBox, actionsBox, pathBox] = await Promise.all([
    preview.boundingBox(),
    block.boundingBox(),
    actions.boundingBox(),
    path.boundingBox(),
  ])

  expect(previewBox).not.toBeNull()
  expect(blockBox).not.toBeNull()
  expect(actionsBox).not.toBeNull()
  expect(pathBox).not.toBeNull()
  expect((previewBox?.x ?? 0) + (previewBox?.width ?? 0)).toBeLessThanOrEqual(390)
  expect((pathBox?.x ?? 0) + (pathBox?.width ?? 0)).toBeLessThanOrEqual(390)
  expect((actionsBox?.x ?? 0) + (actionsBox?.width ?? 0)).toBeLessThanOrEqual(
    (blockBox?.x ?? 0) + (blockBox?.width ?? 0)
  )
  await expect(actions.getByRole("button", { name: "Copy active code" })).toBeVisible()
})

test("code playground switches actual public prop combinations", async ({ page }) => {
  await page.locator("#code").getByRole("tab", { name: "Props", exact: true }).click()
  const active = page.locator("#code [data-code-playground]:not([hidden])")
  await expect(active).toHaveCount(1)
  await expect(active).toHaveAttribute("data-line-numbers", "true")
  await expect(active).toHaveCSS("white-space", "pre")
  await page.locator("#code [data-code-wrap]").check()
  await expect(active).toHaveCount(1)
  await expect(active).toHaveAttribute("data-wrap", "true")
  await expect(active).toHaveCSS("white-space", "pre-wrap")
  await page.locator("#code [data-code-line-numbers]").uncheck()
  await expect(active).not.toHaveAttribute("data-line-numbers")
  await page.locator("#code [data-code-wrap]").uncheck()
  await expect(active).toHaveCSS("white-space", "pre")
})
