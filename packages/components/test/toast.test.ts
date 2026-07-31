import { beforeEach, describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { dismissToast, getToasts, subscribeToasts, toast, updateToast } from "../src/lib/toast"

const componentRoot = resolve(import.meta.dir, "../src")

beforeEach(() => dismissToast())

describe("toast utility", () => {
  test("pushes object inputs with the newest notification first", () => {
    const firstId = toast.push({ title: "Draft saved" })
    const secondId = toast.push({
      duration: 2500,
      title: "Deployment complete",
      variant: "success",
    })

    expect(getToasts().map(({ id }) => id)).toEqual([secondId, firstId])
    expect(getToasts()[0]).toMatchObject({
      duration: 2500,
      title: "Deployment complete",
      variant: "success",
    })
  })

  test("deduplicates explicit ids and can update or dismiss records", () => {
    toast.push({ duration: 0, id: "sync", title: "Connecting" })
    toast.push({ id: "sync", title: "Connected", variant: "success" })
    updateToast("sync", { description: "Workspace is up to date." })

    expect(getToasts()).toHaveLength(1)
    expect(getToasts()[0]).toMatchObject({
      description: "Workspace is up to date.",
      title: "Connected",
      variant: "success",
    })

    toast.dismiss("sync")
    expect(getToasts()).toEqual([])
  })

  test("replaces the complete queue at the command site", () => {
    toast.push({ title: "First" })
    toast.push({ title: "Second" })
    const replacementId = toast.replace({ title: "Latest only", variant: "warning" })

    expect(getToasts()).toEqual([
      expect.objectContaining({
        id: replacementId,
        title: "Latest only",
        variant: "warning",
      }),
    ])
  })

  test("notifies subscribers immediately and after changes", () => {
    const sizes: number[] = []
    const unsubscribe = subscribeToasts((records) => sizes.push(records.length))

    toast.push({ title: "Token expires soon", variant: "warning" })
    dismissToast()
    unsubscribe()
    toast.push({ title: "Ignored after unsubscribe", variant: "danger" })

    expect(sizes).toEqual([0, 1, 0])
  })
})

describe("toast authored contract", () => {
  test("keeps queue mutation out of both framework hosts", async () => {
    const [astro, react] = await Promise.all([
      readFile(resolve(componentRoot, "astro/toast/toaster.astro"), "utf8"),
      readFile(resolve(componentRoot, "react/toast/toaster.react.tsx"), "utf8"),
    ])

    for (const source of [astro, react]) {
      expect(source).toContain("visibleLimit")
      expect(source).toContain("duration")
      expect(source).toContain("position")
      expect(source).toContain("dismissToast")
      expect(source).not.toContain("ToastMode")
      expect(source).not.toContain("data-mode")
    }
  })

  test("pauses timers for pointer and keyboard interaction", async () => {
    const [astro, react] = await Promise.all([
      readFile(resolve(componentRoot, "astro/toast/toaster.astro"), "utf8"),
      readFile(resolve(componentRoot, "react/toast/toaster.react.tsx"), "utf8"),
    ])

    expect(astro).toContain('addEventListener("pointerenter"')
    expect(astro).toContain('addEventListener("focusin"')
    expect(react).toContain("onPointerEnter={pauseTimer}")
    expect(react).toContain("onFocus={pauseTimer}")
  })

  test("preserves mounted toast instances when reconciling the queue", async () => {
    const astro = await readFile(resolve(componentRoot, "astro/toast/toaster.astro"), "utf8")

    expect(astro).toContain("previousElement.nextElementSibling")
    expect(astro).toContain("this.insertBefore(element, firstToast)")
    expect(astro).not.toContain("this.append(element)")
  })

  test("composes the shared Progress component without a decorative indicator", async () => {
    const [astroProgress, reactToast, astroToaster, reactToaster, sharedStyles] = await Promise.all(
      [
        readFile(resolve(componentRoot, "astro/toast/toast-progress.astro"), "utf8"),
        readFile(resolve(componentRoot, "react/toast/toast.react.tsx"), "utf8"),
        readFile(resolve(componentRoot, "astro/toast/toaster.astro"), "utf8"),
        readFile(resolve(componentRoot, "react/toast/toaster.react.tsx"), "utf8"),
        readFile(resolve(componentRoot, "lib/toast.ts"), "utf8"),
      ]
    )

    expect(astroProgress).toContain('import Progress from "../progress/progress.astro"')
    expect(reactToast).toContain("import { Progress, type ProgressProps }")
    expect(astroToaster).toContain("<ToastProgress")
    expect(reactToaster).toContain("<ToastProgress")
    expect(sharedStyles).toContain("hulla-toast-countdown")
    expect(sharedStyles).toContain("absolute inset-x-4 bottom-2.5")
    expect(sharedStyles).toContain("p-4 pb-[1.625rem]")
    expect(sharedStyles).toContain("[&::-webkit-progress-value]:rounded-full")
    expect(sharedStyles).not.toContain("toast-indicator")
  })
})
