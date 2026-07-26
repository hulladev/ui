import { describe, expect, test } from "bun:test"
import { createLayerStack } from "../src/lib/layer-stack"

describe("layer stack", () => {
  test("orders layers and tracks the top handle", () => {
    const stack = createLayerStack()
    const first = stack.push({ kind: "modal", name: "first" } as const)
    const second = stack.push({ kind: "modal", name: "second" } as const)

    expect(first.order).toBe(0)
    expect(first.metadata.name).toBe("first")
    expect(first.active).toBe(true)
    expect(first.isTop).toBe(false)
    expect(second.order).toBe(1)
    expect(second.isTop).toBe(true)
    expect(stack.top()).toBe(second)
    expect(stack.getSnapshot()).toEqual([first, second])
  })

  test("supports removing a non-top layer and idempotent release", () => {
    const stack = createLayerStack()
    const first = stack.push()
    const second = stack.push()
    let notifications = 0

    stack.subscribe(() => {
      notifications += 1
    })

    first.release()
    first.release()

    expect(first.active).toBe(false)
    expect(second.isTop).toBe(true)
    expect(stack.getSnapshot()).toEqual([second])
    expect(notifications).toBe(1)
  })

  test("resets ordering once the stack becomes empty", () => {
    const stack = createLayerStack()
    const first = stack.push()
    const second = stack.push()

    second.release()
    first.release()

    expect(stack.getSnapshot()).toEqual([])
    expect(stack.push().order).toBe(0)
  })

  test("unsubscribes listeners", () => {
    const stack = createLayerStack()
    let notifications = 0
    const unsubscribe = stack.subscribe(() => {
      notifications += 1
    })

    stack.push()
    unsubscribe()
    stack.push()

    expect(notifications).toBe(1)
  })
})
