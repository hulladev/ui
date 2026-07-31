import { cn } from "@/lib/style"
import {
  connectDraggable,
  type DragEventDetail,
  type DraggableAxis,
  type DraggableBoundary,
} from "@/lib/spatial-interaction"
import { useEffect, useImperativeHandle, useRef, type ComponentPropsWithRef } from "react"

export type DraggableProps = ComponentPropsWithRef<"div"> & {
  axis?: DraggableAxis
  boundary?: DraggableBoundary
  boundaryPadding?: number
  boundarySelector?: string
  keyboardStep?: number
  onMove?: (detail: DragEventDetail) => void
  onMoveEnd?: (detail: DragEventDetail) => void
  onMoveStart?: (detail: DragEventDetail) => void
}

export function Draggable({
  axis = "both",
  boundary = "parent",
  boundaryPadding = 0,
  boundarySelector,
  children,
  className,
  keyboardStep = 10,
  onMove,
  onMoveEnd,
  onMoveStart,
  ...props
}: DraggableProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(props.ref, () => elementRef.current as HTMLDivElement, [])
  const callbacksRef = useRef({ onMove, onMoveEnd, onMoveStart })
  callbacksRef.current = { onMove, onMoveEnd, onMoveStart }

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const controller = connectDraggable(element, {
      axis,
      boundary,
      boundaryPadding,
      boundarySelector,
      keyboardStep,
      onMove: (detail) => callbacksRef.current.onMove?.(detail),
      onMoveEnd: (detail) => callbacksRef.current.onMoveEnd?.(detail),
      onMoveStart: (detail) => callbacksRef.current.onMoveStart?.(detail),
    })

    return () => controller.destroy()
  }, [axis, boundary, boundaryPadding, boundarySelector, keyboardStep])

  return (
    <div
      {...props}
      ref={elementRef}
      data-axis={axis}
      data-boundary={boundary}
      data-boundary-padding={boundaryPadding}
      data-boundary-selector={boundarySelector}
      data-keyboard-step={keyboardStep}
      data-slot="draggable"
      data-state="idle"
      className={cn(
        "block [translate:var(--hulla-drag-x,0px)_var(--hulla-drag-y,0px)] data-[state=dragging]:z-[1] data-[state=dragging]:select-none",
        className
      )}
    >
      {children}
    </div>
  )
}
