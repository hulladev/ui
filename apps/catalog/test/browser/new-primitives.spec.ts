import { expect, test } from "@playwright/test"

const asset = {
  name: "brief.pdf",
  mimeType: "application/pdf",
  buffer: Buffer.from("test document"),
}

test("file upload opens from its label and submits native files, then resets", async ({ page }) => {
  await page.goto("/forms#file-upload", { waitUntil: "domcontentloaded" })
  const form = page.locator("[data-file-demo]")
  const chooserPromise = page.waitForEvent("filechooser")
  await form.locator("[data-slot=file-dropzone]").click()
  await (await chooserPromise).setFiles([asset, { ...asset, name: "notes.pdf" }])
  await expect(form.locator("[data-upload-files]")).toHaveText("brief.pdf, notes.pdf")
  expect(
    await form.evaluate((element) =>
      new FormData(element as HTMLFormElement).getAll("assets").map((file) => (file as File).name)
    )
  ).toEqual(["brief.pdf", "notes.pdf"])
  await form.getByRole("button", { name: "Clear selection" }).click()
  await expect(form.locator("[data-upload-files]")).toHaveText("No files selected")
  await expect(page.locator("#upload-assets")).toHaveJSProperty("value", "")
  await expect(page.locator("#upload-disabled")).toBeDisabled()
  await expect(page.locator("#upload-invalid")).toHaveAttribute("aria-describedby", "upload-error")
})

test("file upload shows keyboard focus on the dropzone and honors native props", async ({
  page,
}) => {
  await page.goto("/forms#file-upload", { waitUntil: "domcontentloaded" })
  const input = page.locator("#upload-assets")
  await page.keyboard.press("Tab")
  await input.focus()
  await expect(input).toBeFocused()
  expect(
    await page
      .locator("[data-file-demo] [data-slot=file-dropzone]")
      .evaluate((element) => getComputedStyle(element).outlineStyle)
  ).not.toBe("none")
  const preview = page.locator("[data-preview-component=fileupload-preview]")
  await preview.getByRole("tab", { name: "Props", exact: true }).click()
  await preview.locator("[data-upload-accept]").selectOption("image/*")
  await preview.locator("[data-upload-multiple]").check()
  await preview.locator("[data-upload-disabled]").check()
  await expect(preview.locator("[data-upload-control]")).toBeDisabled()
  await expect(preview.locator("[data-upload-control]")).toHaveAttribute("accept", "image/*")
  await expect(preview.locator("[data-upload-control]")).toHaveJSProperty("multiple", true)
})

test("tag input commits, rejects duplicates, submits repeated values, and resets", async ({
  page,
}) => {
  await page.goto("/forms#tag-input", { waitUntil: "domcontentloaded" })
  const form = page.locator("[data-tags-demo]")
  const input = form.getByRole("textbox")
  await input.fill("  Research  ")
  await input.press("Enter")
  await expect(input).toHaveValue("")
  await expect(form.getByRole("button", { name: "Remove Research", exact: true })).toBeVisible()
  await input.fill("research")
  await input.press("Enter")
  await expect(input).toHaveValue("research")
  await expect(form.getByRole("status")).toHaveText("research is already selected")
  await expect(form.locator("[data-tag-value]")).toHaveCount(3)
  await input.clear()
  await form.getByRole("button", { name: "Save labels" }).click()
  await expect(form.getByRole("status")).toHaveText("Saved: Design, Engineering, Research")
  await form.getByRole("button", { name: "Reset", exact: true }).click()
  await expect(form.locator("[data-tag-value]")).toHaveCount(2)
  await expect(input).toHaveValue("")
})

test("empty Backspace focuses the final remove control without silently deleting a tag", async ({
  page,
}) => {
  await page.goto("/forms#tag-input", { waitUntil: "domcontentloaded" })
  const form = page.locator("[data-tags-demo]")
  const input = form.getByRole("textbox")
  await input.focus()
  await input.press("Backspace")
  const remove = form.getByRole("button", { name: "Remove Engineering", exact: true })
  await expect(remove).toBeFocused()
  await expect(form.locator("[data-tag-value]")).toHaveCount(2)
  await remove.press("Enter")
  await expect(form.locator("[data-tag-value]")).toHaveCount(1)
  await expect(input).toBeFocused()
  await input.fill("<script>text</script>")
  await input.press("Enter")
  await expect(form.locator("[data-tag-label]").last()).toHaveText("<script>text</script>")
  await expect(form.locator("[data-slot=tag-input-tag] script")).toHaveCount(0)
})

test("tag input preserves IME drafts, cancelled commits, and native validation", async ({
  page,
}) => {
  await page.goto("/forms#tag-input", { waitUntil: "domcontentloaded" })
  const form = page.locator("[data-tags-demo]")
  const input = form.getByRole("textbox")
  await input.fill("日本語")
  await input.dispatchEvent("keydown", { key: "Enter", isComposing: true, bubbles: true })
  await expect(input).toHaveValue("日本語")
  await expect(form.locator("[data-tag-value]")).toHaveCount(2)
  await input.press("Enter")
  await expect(form.locator("[data-tag-value]")).toHaveCount(3)
  await input.evaluate((element) => element.setAttribute("pattern", "[A-Z]+"))
  await input.fill("lowercase")
  await input.press("Enter")
  await expect(input).toHaveValue("lowercase")
  await expect(form.locator("[data-tag-value]")).toHaveCount(3)
  await expect(page.locator("#locked-tags")).toBeDisabled()
  await expect(page.getByRole("button", { name: "Remove Research", exact: true })).toBeDisabled()
  await expect(page.locator("#readonly-tags")).toHaveJSProperty("readOnly", true)
})

test("tag control playground applies read-only and disabled states", async ({ page }) => {
  await page.goto("/forms#tag-input", { waitUntil: "domcontentloaded" })
  const preview = page.locator("[data-preview-component=taginput-preview]")
  await preview.getByRole("tab", { name: "Props", exact: true }).click()
  const input = preview.locator("[data-tags-control]")
  await input.fill("Prototype")
  await input.press("Enter")
  await expect(preview.locator("[data-tags-commit]")).toHaveText("Committed: Prototype")
  await preview.locator("[data-tags-readonly]").check()
  await expect(input).toHaveJSProperty("readOnly", true)
  await preview.locator("[data-tags-disabled]").check()
  await expect(input).toBeDisabled()
})

test("stepper navigates explicitly with current-step semantics and preserves field values", async ({
  page,
}) => {
  await page.goto("/navigation-overlays#stepper", { waitUntil: "domcontentloaded" })
  const demo = page.locator("[data-stepper-demo]")
  await expect(demo.locator("[aria-current=step]")).toHaveCount(1)
  await expect(demo.getByRole("button", { name: "2 Team", exact: true })).toBeDisabled()
  await demo.locator("#step-project").fill("Customer portal")
  await demo.getByRole("button", { name: "Continue", exact: true }).press("Enter")
  await expect(demo.getByRole("button", { name: "2 Team", exact: true })).toBeFocused()
  await expect(demo.locator("#step-panel-1")).toBeVisible()
  await expect(demo.locator("#step-panel-0")).toBeHidden()
  await demo.getByRole("button", { name: "Continue", exact: true }).click()
  await expect(demo.locator("[data-review-project]")).toHaveText("Customer portal")
  await expect(demo.locator("[aria-current=step]")).toHaveCount(1)
  await demo.getByRole("button", { name: "Finish", exact: true }).click()
  await expect(demo.getByRole("status")).toContainText("Project setup complete")
  await demo.getByRole("button", { name: "1 Project", exact: true }).click()
  await expect(demo.locator("#step-project")).toHaveValue("Customer portal")
})

test("stepper playground switches orientation and current step", async ({ page }) => {
  await page.goto("/navigation-overlays#stepper", { waitUntil: "domcontentloaded" })
  const preview = page.locator("[data-preview-component=stepper-preview]")
  await preview.getByRole("tab", { name: "Props", exact: true }).click()
  await preview.locator("[data-stepper-orientation]").selectOption("vertical")
  await preview.locator("[data-stepper-current]").selectOption("2")
  const control = preview.locator("[data-stepper-control]")
  await expect(control).toHaveAttribute("data-orientation", "vertical")
  await expect(control.locator("[aria-current=step]")).toHaveText(/03\s*Review/)
  await expect(control.locator("[data-state=complete]")).toHaveCount(2)
})

for (const theme of ["light", "dark"]) {
  test(`new compositions fit narrow screens in ${theme} mode`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/forms#file-upload", { waitUntil: "domcontentloaded" })
    await page.locator("html").evaluate((element, value) => {
      element.dataset.theme = value
    }, theme)
    for (const slug of ["file-upload", "tag-input", "stepper"]) {
      await page.goto(`/${slug === "stepper" ? "layout-feedback" : "forms"}#${slug}`)
      await page.locator("html").evaluate((element, value) => {
        element.dataset.theme = value
      }, theme)
      const preview = page.locator(`#${slug} [data-component-preview]`)
      const box = await preview.boundingBox()
      expect(box).not.toBeNull()
      expect(box!.x + box!.width).toBeLessThanOrEqual(390)
      const canvas = preview.locator("[data-preview-canvas]")
      expect(
        await canvas.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)
      ).toBe(true)
    }
  })
}
