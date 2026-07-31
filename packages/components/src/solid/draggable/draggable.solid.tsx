import { createMutableRef, exposeRef, createLifecycleEffect } from "@/lib/solid"
import { mergeProps, splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"
import {
  connectDraggable,
  type DragEventDetail,
  type DraggableAxis,
  type DraggableBoundary,
} from "@/lib/spatial-interaction"

export type DraggableProps = JSX.IntrinsicElements["div"] & {
  axis?: DraggableAxis
  boundary?: DraggableBoundary
  boundaryPadding?: number
  boundarySelector?: string
  keyboardStep?: number
  onMove?: (detail: DragEventDetail) => void
  onMoveEnd?: (detail: DragEventDetail) => void
  onMoveStart?: (detail: DragEventDetail) => void
}

export function Draggable(props: DraggableProps) {
  const [local, rest] = splitProps(
    mergeProps(
      { axis: "both", boundary: "parent", boundaryPadding: 0, keyboardStep: 10 } as const,
      props
    ),
    [
      "axis",
      "boundary",
      "boundaryPadding",
      "boundarySelector",
      "children",
      "class",
      "keyboardStep",
      "onMove",
      "onMoveEnd",
      "onMoveStart",
    ]
  )

  const elementRef = createMutableRef<HTMLDivElement>(null)
  exposeRef(rest.ref, () => elementRef.current as HTMLDivElement, [])
  createLifecycleEffect(
    () => {
      const element = elementRef.current
      if (!element) return

      const controller = connectDraggable(element, {
        axis: local.axis,
        boundary: local.boundary,
        boundaryPadding: local.boundaryPadding,
        boundarySelector: local.boundarySelector,
        keyboardStep: local.keyboardStep,
        onMove: (detail) => local.onMove?.(detail),
        onMoveEnd: (detail) => local.onMoveEnd?.(detail),
        onMoveStart: (detail) => local.onMoveStart?.(detail),
      })

      return () => controller.destroy()
    },
    () => [
      local.axis,
      local.boundary,
      local.boundaryPadding,
      local.boundarySelector,
      local.keyboardStep,
    ]
  )

  return (
    <div
      {...rest}
      ref={elementRef}
      data-axis={local.axis}
      data-boundary={local.boundary}
      data-boundary-padding={local.boundaryPadding}
      data-boundary-selector={local.boundarySelector}
      data-keyboard-step={local.keyboardStep}
      data-slot="draggable"
      data-state="idle"
      class={cn(
        "block [translate:var(--hulla-drag-x,0px)_var(--hulla-drag-y,0px)] data-[state=dragging]:z-[1] data-[state=dragging]:select-none",
        local.class
      )}
    >
      {local.children}
    </div>
  )
}
