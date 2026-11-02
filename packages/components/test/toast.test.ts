import { beforeEach, describe, expect, test } from "bun:test"
import { dismissToast, getToasts, subscribeToasts, toast, updateToast } from "../src/lib/toast"

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
