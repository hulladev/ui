import { createMutableRef, exposeRef, createLifecycleEffect } from "@/lib/solid"
import { mergeProps, splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"
import {
  connectResizable,
  type DraggableBoundary,
  type ResizeEventDetail,
} from "@/lib/spatial-interaction"

export type ResizableProps = JSX.IntrinsicElements["div"] & {
  boundary?: DraggableBoundary
  boundaryPadding?: number
  boundarySelector?: string
  keyboardStep?: number
  onResize?: (detail: ResizeEventDetail) => void
  onResizeEnd?: (detail: ResizeEventDetail) => void
  onResizeStart?: (detail: ResizeEventDetail) => void
}

export function Resizable(props: ResizableProps) {
  const [local, rest] = splitProps(
    mergeProps({ boundary: "parent", boundaryPadding: 0, keyboardStep: 10 } as const, props),
    [
      "boundary",
      "boundaryPadding",
      "boundarySelector",
      "children",
      "class",
      "keyboardStep",
      "onResize",
      "onResizeEnd",
      "onResizeStart",
    ]
  )

  const elementRef = createMutableRef<HTMLDivElement>(null)
  exposeRef(rest.ref, () => elementRef.current as HTMLDivElement, [])
  createLifecycleEffect(
    () => {
      const element = elementRef.current
      if (!element) return

      const controller = connectResizable(element, {
        boundary: local.boundary,
        boundaryPadding: local.boundaryPadding,
        boundarySelector: local.boundarySelector,
        keyboardStep: local.keyboardStep,
        onResize: (detail) => local.onResize?.(detail),
        onResizeEnd: (detail) => local.onResizeEnd?.(detail),
        onResizeStart: (detail) => local.onResizeStart?.(detail),
      })

      return () => controller.destroy()
    },
    () => [local.boundary, local.boundaryPadding, local.boundarySelector, local.keyboardStep]
  )

  return (
    <div
      {...rest}
      ref={elementRef}
      data-boundary={local.boundary}
      data-boundary-padding={local.boundaryPadding}
      data-boundary-selector={local.boundarySelector}
      data-keyboard-step={local.keyboardStep}
      data-slot="resizable"
      data-state="idle"
      class={cn(
        "relative block box-border min-w-0 [translate:var(--hulla-resize-x,0px)_var(--hulla-resize-y,0px)] data-[state=resizing]:select-none",
        local.class
      )}
    >
      {local.children}
    </div>
  )
}
