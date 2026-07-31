import { describe, expect, test } from "bun:test"
import {
  resolveDragPosition,
  resolveResizeGeometry,
  type DragBounds,
  type ResizeGeometry,
  type ResizeLimits,
} from "../src/lib/spatial-interaction"

const bounds: DragBounds = {
  maxX: 100,
  maxY: 80,
  minX: -20,
  minY: -10,
}

const geometry: ResizeGeometry = {
  height: 120,
  offsetX: 0,
  offsetY: 0,
  width: 200,
}

const limits: ResizeLimits = {
  maxHeight: 240,
  maxWidth: 320,
  minHeight: 80,
  minWidth: 140,
}

describe("spatial interaction geometry", () => {
  test("moves on both axes and clamps to the supplied bounds", () => {
    expect(resolveDragPosition({ x: 10, y: 20 }, { x: 200, y: -100 }, "both", bounds)).toEqual({
      x: 100,
      y: -10,
    })
  })

  test("locks the inactive drag axis", () => {
    expect(resolveDragPosition({ x: 10, y: 20 }, { x: 40, y: 50 }, "x", bounds)).toEqual({
      x: 50,
      y: 20,
    })
    expect(resolveDragPosition({ x: 10, y: 20 }, { x: 40, y: 50 }, "y", bounds)).toEqual({
      x: 10,
      y: 70,
    })
  })

  test("resizes south-east and respects CSS-derived limits", () => {
    expect(resolveResizeGeometry(geometry, { x: 180, y: -80 }, "south-east", limits)).toEqual({
      height: 80,
      offsetX: 0,
      offsetY: 0,
      width: 320,
    })
  })

  test("keeps the opposite edge fixed when resizing north-west", () => {
    expect(resolveResizeGeometry(geometry, { x: 30, y: 20 }, "north-west", limits)).toEqual({
      height: 100,
      offsetX: 30,
      offsetY: 20,
      width: 170,
    })
  })

  test("uses the applied clamped delta for west and north offsets", () => {
    expect(resolveResizeGeometry(geometry, { x: 200, y: 200 }, "north-west", limits)).toEqual({
      height: 80,
      offsetX: 60,
      offsetY: 40,
      width: 140,
    })
  })
})
