import { expect, test, type Locator, type Page } from "@playwright/test"
import { nativeCatalogDestination } from "../../src/data/catalogNavigation"
import { nativeCatalogEntries } from "../../../native-catalog/src/entries"

test.setTimeout(60_000)
const nativeOnlyFamilies = [
  "empty-state",
  "keyboard-aware",
  "list",
  "number-field",
  "swipe-actions",
]
const frameworkPicker = (section: Locator) => section.locator("[data-source-framework-select]")
const preview = (section: Locator) => section.locator("[data-component-preview]")
const source = (section: Locator) => section.locator("[data-source-inspector]")
const nativeFrame = (section: Locator) => section.getByTestId("native-catalog")

async function open(page: Page, path: string) {
  await page.goto(path, { waitUntil: "domcontentloaded" })
}

test("every shared native family has a preview in its canonical category", async ({ request }) => {
  const htmlByCategory = new Map<string, string>()
  const shared = nativeCatalogEntries.filter((entry) => !nativeOnlyFamilies.includes(entry.id))
  for (const entry of shared) {
    const destination = nativeCatalogDestination(entry.id)
    expect(destination, entry.title).toContain("?framework=react-native")
    const category = new URL(destination!, "http://catalog.test").pathname
    if (!htmlByCategory.has(category)) {
      const response = await request.get(category)
      expect(response.ok()).toBe(true)
      htmlByCategory.set(category, await response.text())
    }
    expect(htmlByCategory.get(category), entry.title).toContain(`data-native-family="${entry.id}"`)
  }
  expect(shared).toHaveLength(43)
})

test("the combined Radio and RadioGroup section switches to its native family", async ({
  page,
}) => {
  await open(page, nativeCatalogDestination("radio")!)
  const section = page.locator("#radio")
  await expect(frameworkPicker(section)).toHaveValue("React Native")
  await expect(nativeFrame(section)).toBeVisible({ timeout: 30_000 })
  await expect(nativeFrame(section).getByRole("radio").first()).toBeVisible()
  await expect(source(section).locator("[data-source-path]")).toContainText("RadioExample.tsx")
})

test("framework pickers wait for their handlers before accepting the first change", async ({
  page,
}) => {
  let releaseScripts!: () => void
  const scriptsReady = new Promise<void>((resolve) => (releaseScripts = resolve))
  await page.route("**/*", async (route) => {
    if (route.request().resourceType() === "script") await scriptsReady
    await route.continue()
  })
  try {
    await page.goto("/layout-feedback#card", { waitUntil: "commit" })
    const section = page.locator("#card")
    const picker = frameworkPicker(section)
    await expect(picker).toBeDisabled()
    releaseScripts()
    await expect(picker).toBeEnabled()
    await picker.selectOption("React Native")
    await expect(nativeFrame(section)).toBeVisible({ timeout: 30_000 })
    await expect(picker).toHaveValue("React Native")
  } finally {
    releaseScripts()
  }
})

for (const width of [390, 1280]) {
  test.describe(`shared platform catalog at ${width}px`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 })
      await page.emulateMedia({ reducedMotion: "reduce" })
      await page.addInitScript(() => localStorage.setItem("catalog-theme", "light"))
    })

    test("native examples load only when their framework is chosen", async ({ page }) => {
      const wrappers = new Set<string>()
      page.on("request", (request) => {
        if (request.resourceType() !== "script") return
        const filename = new URL(request.url()).pathname.split("/").at(-1)!
        if (/^Native(?:[A-Za-z]+Preview|PreviewFrame)\./.test(filename)) wrappers.add(filename)
      })
      await open(page, "/#button")
      const section = page.locator("#button")
      await expect(preview(section).getByText("Web canvas · Astro", { exact: true })).toBeVisible()
      await expect(page.getByTestId("native-catalog")).toHaveCount(0)
      expect([...wrappers]).toEqual([])
      await frameworkPicker(section).selectOption("React Native")
      await expect(nativeFrame(section)).toBeVisible()
      await expect(
        preview(section).getByText("Live canvas · React Native", { exact: true })
      ).toBeVisible()
      await expect(preview(section).locator("[data-web-preview]")).toBeHidden()
      await expect
        .poll(() => [...wrappers].some((name) => name.startsWith("NativeButtonPreview.")))
        .toBe(true)
      expect(
        [...wrappers].filter(
          (name) =>
            !name.startsWith("NativeButtonPreview.") && !name.startsWith("NativePreviewFrame.")
        )
      ).toEqual([])
      await expect(
        page.locator("#badge [data-native-preview-host]").getByTestId("native-catalog")
      ).toHaveCount(0)
      await expect(frameworkPicker(page.locator("#badge"))).toHaveValue("Astro")
    })

    test("native state survives source modes, files, and theme changes", async ({ page }) => {
      await open(page, "/?framework=react-native#button")
      const section = page.locator("#button")
      const inspector = source(section)
      const frame = nativeFrame(section)
      const mounted = await frame.elementHandle()
      await frame.getByRole("button", { name: "Primary", exact: true }).click()
      const counter = frame.getByText("Actions triggered: 1", { exact: true })
      await expect(counter).toBeVisible()
      await expect(frameworkPicker(section)).toHaveValue("React Native")
      await expect(inspector.locator('[data-source-mode="minimal"]')).toBeDisabled()
      await expect(inspector.locator("[data-source-path]")).toContainText("ButtonExample.tsx")
      await expect(inspector.locator("[data-source-output] code")).toContainText(
        "generated/react-native/button"
      )
      await inspector.locator('[data-source-mode="generated"]').click()
      await expect(frameworkPicker(section)).toHaveValue("React Native")
      await inspector
        .locator('[data-source-files="React Native:generated"]')
        .getByRole("tab", { name: "button.tsx", exact: true })
        .click()
      await expect(inspector.locator("[data-source-path]")).toContainText(
        "generated/react-native/button/button.tsx"
      )
      await expect(inspector.locator("[data-source-output] code")).toContainText(
        "export function Button"
      )
      await expect(counter).toBeVisible()
      await inspector.locator('[data-source-mode="visible"]').click()
      await inspector
        .locator('[data-source-files="React Native:visible"]')
        .getByRole("tab", { name: "NativeButtonPreview.tsx", exact: true })
        .click()
      await expect(inspector.locator("[data-source-path]")).toContainText("NativeButtonPreview.tsx")
      await expect(inspector.locator("[data-source-output] code")).toContainText(
        "NativePreviewFrame"
      )
      await expect(counter).toBeVisible()
      await page.locator("#contrast").check()
      await expect(frame).toHaveAttribute("id", "native-preview-dark")
      await expect(counter).toBeVisible()
      expect(await mounted!.evaluate((element) => element.isConnected)).toBe(true)
      await frame.getByRole("button", { name: "Primary", exact: true }).click()
      await expect(frame.getByText("Actions triggered: 2", { exact: true })).toBeVisible()
    })

    test("web source frameworks dispose native state while retaining the honest Astro canvas label", async ({
      page,
    }) => {
      await open(page, "/?framework=react-native#button")
      const section = page.locator("#button")
      const inspector = source(section)
      const frame = nativeFrame(section)
      await frame.getByRole("button", { name: "Primary", exact: true }).click()
      await expect(frame.getByText("Actions triggered: 1", { exact: true })).toBeVisible()
      const mounted = await frame.elementHandle()
      await inspector.locator('[data-source-mode="generated"]').click()
      await frameworkPicker(section).selectOption("React")
      await expect(frameworkPicker(section)).toHaveValue("React")
      await expect(frame).toHaveCount(0)
      await expect.poll(() => mounted!.evaluate((element) => element.isConnected)).toBe(false)
      await expect(preview(section).locator("[data-web-preview]")).toBeVisible()
      await expect(preview(section).getByText("Web canvas · Astro", { exact: true })).toBeVisible()
      await expect(inspector.locator('[data-source-mode="visible"]')).toBeDisabled()
      await expect(inspector.locator("[data-source-path]")).toContainText("generated/react/button/")
      await frameworkPicker(section).selectOption("React Native")
      await expect(frame).toBeVisible()
      await expect(frame.getByText("Actions triggered: 0", { exact: true })).toBeVisible()
    })

    test("switching away from native disposes open modal portals and their focus trap", async ({
      page,
    }) => {
      await open(page, "/navigation-overlays?framework=react-native#dialog")
      const section = page.locator("#dialog")
      await nativeFrame(section)
        .getByRole("button", { name: "Finish workout", exact: true })
        .click()
      const nativeModal = page.getByRole("dialog", { name: "Finish this workout", exact: true })
      await expect(nativeModal).toBeVisible()
      const mounted = await nativeModal.elementHandle()
      // A programmatic native select change also covers cleanup during an open
      // modal, when the modal's focus scope intentionally surrounds its content.
      await frameworkPicker(section).selectOption("Astro")
      await expect(nativeModal).toHaveCount(0)
      await expect.poll(() => mounted!.evaluate((element) => element.isConnected)).toBe(false)
      await expect(nativeFrame(section)).toHaveCount(0)
      await section.locator("[data-open-catalog-dialog]").click()
      await expect(page.locator("#catalog-dialog")).toBeVisible()
      await page.keyboard.press("Escape")
      await expect(page.locator("#catalog-dialog")).toBeHidden()
    })

    test("a native query activates only the component named by the hash", async ({ page }) => {
      await open(page, "/?framework=react-native#badge")
      const section = page.locator("#badge")
      await expect(frameworkPicker(section)).toHaveValue("React Native")
      await expect(nativeFrame(section)).toBeVisible()
      await expect(page.getByTestId("native-catalog")).toHaveCount(1)
      await expect(frameworkPicker(page.locator("#button"))).toHaveValue("Astro")
      await expect(preview(page.locator("#button")).locator("[data-web-preview]")).toBeVisible()
      await expect(
        page.locator("#button [data-native-preview-host]").getByTestId("native-catalog")
      ).toHaveCount(0)
    })

    test("native-only navigation contains exactly the five dedicated mobile components", async ({
      page,
    }) => {
      await open(page, "/")
      const navigation = page.locator("[data-catalog-navigation]")
      if ((await navigation.getAttribute("open")) === null)
        await page.getByText("Browse components", { exact: true }).click()
      const nativeNavigation = page.getByRole("region", {
        name: "Native only components",
        exact: true,
      })
      await expect(nativeNavigation.getByRole("link")).toHaveCount(nativeOnlyFamilies.length)
      const destinations = await nativeNavigation
        .getByRole("link")
        .evaluateAll((links) =>
          links.map((link) => new URL((link as HTMLAnchorElement).href).pathname).sort()
        )
      expect(destinations).toEqual(
        nativeOnlyFamilies.map((family) => `/react-native/${family}`).sort()
      )
      await expect(nativeNavigation.getByRole("link", { name: "Button", exact: true })).toHaveCount(
        0
      )
      await open(page, "/react-native")
      await expect(page.locator(".native-component-links > section")).toHaveCount(5)
      for (const family of nativeOnlyFamilies)
        await expect(
          page.locator(`.native-component-links a[href="/react-native/${family}"]`)
        ).toBeVisible()
      await page.locator('.native-component-links a[href="/react-native/empty-state"]').click()
      await expect(page).toHaveURL(/\/react-native\/empty-state$/)
      await expect(page.getByTestId("native-catalog")).toBeVisible()
      await expect(
        page.getByRole("combobox", { name: "Native EmptyState framework", exact: true })
      ).toHaveValue("React Native")
    })
  })
}

for (const [family, category] of [
  ["button", "/"],
  ["switch", "/forms"],
  ["dialog", "/navigation-overlays"],
  ["card", "/layout-feedback"],
] as const) {
  test(`legacy native ${family} bookmarks redirect to the shared ${category} section`, async ({
    page,
  }) => {
    await open(page, `/react-native/${family}`)
    await expect.poll(() => new URL(page.url()).pathname).toBe(category)
    const destination = new URL(page.url())
    expect(destination.searchParams.get("framework")).toBe("react-native")
    expect(destination.hash).toBe(`#${family}`)
    await expect(nativeFrame(page.locator(`#${family}`))).toBeVisible({ timeout: 30_000 })
    await expect(page.getByTestId("native-catalog")).toHaveCount(1)
  })
}
