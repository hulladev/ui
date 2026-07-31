import { expect, test, type Locator, type Page } from "@playwright/test"

const expectContained = async (subject: Locator, boundary: Locator, padding = 0) => {
  const subjectBox = await subject.boundingBox()
  const boundaryBox = await boundary.boundingBox()
  expect(subjectBox).not.toBeNull()
  expect(boundaryBox).not.toBeNull()
  if (!subjectBox || !boundaryBox) return

  expect(subjectBox.x).toBeGreaterThanOrEqual(boundaryBox.x + padding - 1)
  expect(subjectBox.y).toBeGreaterThanOrEqual(boundaryBox.y + padding - 1)
  expect(subjectBox.x + subjectBox.width).toBeLessThanOrEqual(
    boundaryBox.x + boundaryBox.width - padding + 1
  )
  expect(subjectBox.y + subjectBox.height).toBeLessThanOrEqual(
    boundaryBox.y + boundaryBox.height - padding + 1
  )
}

const dragToStageEdge = async (
  page: Page,
  handle: Locator,
  stage: Locator,
  edge: "bottom-right" | "top-left"
) => {
  await stage.scrollIntoViewIfNeeded()
  const handleBox = await handle.boundingBox()
  const stageBox = await stage.boundingBox()
  expect(handleBox).not.toBeNull()
  expect(stageBox).not.toBeNull()
  if (!handleBox || !stageBox) return

  await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2)
  await page.mouse.down()
  await page.mouse.move(
    edge === "top-left" ? stageBox.x + 1 : stageBox.x + stageBox.width - 1,
    edge === "top-left" ? stageBox.y + 1 : stageBox.y + stageBox.height - 1
  )
  await page.mouse.up()
}

test("draggable defaults to parent bounds and supports the keyboard", async ({ page }) => {
  await page.goto("/#draggable", { waitUntil: "domcontentloaded" })

  const stage = page.locator("[data-draggable-stage]")
  const draggable = stage.locator('[data-slot="draggable"]')
  const card = draggable.locator('[data-slot="card"]')
  const handle = stage.getByRole("button", { name: "Move signal inspector" })

  await expect(draggable).toHaveAttribute("data-boundary", "parent")
  await handle.press("ArrowRight")
  await handle.press("ArrowDown")
  await expect(draggable).toHaveAttribute("data-position-x", "10")
  await expect(draggable).toHaveAttribute("data-position-y", "10")
  await expectContained(card, stage, 12)
})

test("draggable remains reachable at every parent edge", async ({ page }) => {
  await page.goto("/#draggable", { waitUntil: "domcontentloaded" })

  const stage = page.locator("[data-draggable-stage]")
  const draggable = stage.locator('[data-slot="draggable"]')
  const card = draggable.locator('[data-slot="card"]')
  const handle = stage.getByRole("button", { name: "Move signal inspector" })

  await dragToStageEdge(page, handle, stage, "top-left")
  await expect(draggable).toHaveAttribute("data-state", "idle")
  await expectContained(card, stage, 12)

  await dragToStageEdge(page, handle, stage, "bottom-right")
  await expect(draggable).toHaveAttribute("data-state", "idle")
  await expectContained(card, stage, 12)
})

test("resizable respects parent bounds and CSS size limits", async ({ page }) => {
  await page.goto("/#resizable", { waitUntil: "domcontentloaded" })

  const stage = page.locator("[data-resizable-stage]")
  const resizable = stage.locator('[data-slot="resizable"]')
  const card = resizable.locator('[data-slot="card"]')
  const southEast = stage.getByRole("button", {
    name: "Resize workspace from bottom right",
  })
  const northWest = stage.getByRole("button", {
    name: "Resize workspace from top left",
  })

  await expect(resizable).toHaveAttribute("data-boundary", "parent")
  const initialBox = await resizable.boundingBox()
  expect(initialBox).not.toBeNull()

  await southEast.press("ArrowRight")
  await southEast.press("ArrowDown")
  const keyboardBox = await resizable.boundingBox()
  expect(keyboardBox?.width).toBeCloseTo((initialBox?.width ?? 0) + 10, 0)
  expect(keyboardBox?.height).toBeCloseTo((initialBox?.height ?? 0) + 10, 0)

  await dragToStageEdge(page, southEast, stage, "bottom-right")
  await expect(resizable).toHaveAttribute("data-state", "idle")
  await expectContained(card, stage, 12)

  await stage.getByRole("button", { name: "Reset" }).click()
  await dragToStageEdge(page, northWest, stage, "top-left")
  await expect(resizable).toHaveAttribute("data-state", "idle")
  await expectContained(card, stage, 12)
})

test("both components fit at a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/#draggable", { waitUntil: "domcontentloaded" })

  const draggableStage = page.locator("[data-draggable-stage]")
  await expectContained(
    draggableStage.locator('[data-slot="draggable"] [data-slot="card"]'),
    draggableStage,
    12
  )

  await page.goto("/#resizable", { waitUntil: "domcontentloaded" })
  const resizableStage = page.locator("[data-resizable-stage]")
  await expectContained(
    resizableStage.locator('[data-slot="resizable"] [data-slot="card"]'),
    resizableStage,
    12
  )
})
