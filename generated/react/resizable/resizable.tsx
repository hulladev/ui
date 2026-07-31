import { cn } from "@/lib/style"
import {
  connectResizable,
  type DraggableBoundary,
  type ResizeEventDetail,
} from "@/lib/spatial-interaction"
import { useEffect, useImperativeHandle, useRef, type ComponentPropsWithRef } from "react"

export type ResizableProps = ComponentPropsWithRef<"div"> & {
  boundary?: DraggableBoundary
  boundaryPadding?: number
  boundarySelector?: string
  keyboardStep?: number
  onResize?: (detail: ResizeEventDetail) => void
  onResizeEnd?: (detail: ResizeEventDetail) => void
  onResizeStart?: (detail: ResizeEventDetail) => void
}

export function Resizable({
  boundary = "parent",
  boundaryPadding = 0,
  boundarySelector,
  children,
  className,
  keyboardStep = 10,
  onResize,
  onResizeEnd,
  onResizeStart,
  ...props
}: ResizableProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(props.ref, () => elementRef.current as HTMLDivElement, [])
  const callbacksRef = useRef({ onResize, onResizeEnd, onResizeStart })
  callbacksRef.current = { onResize, onResizeEnd, onResizeStart }

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const controller = connectResizable(element, {
      boundary,
      boundaryPadding,
      boundarySelector,
      keyboardStep,
      onResize: (detail) => callbacksRef.current.onResize?.(detail),
      onResizeEnd: (detail) => callbacksRef.current.onResizeEnd?.(detail),
      onResizeStart: (detail) => callbacksRef.current.onResizeStart?.(detail),
    })

    return () => controller.destroy()
  }, [boundary, boundaryPadding, boundarySelector, keyboardStep])

  return (
    <div
      {...props}
      ref={elementRef}
      data-boundary={boundary}
      data-boundary-padding={boundaryPadding}
      data-boundary-selector={boundarySelector}
      data-keyboard-step={keyboardStep}
      data-slot="resizable"
      data-state="idle"
      className={cn(
        "relative block box-border min-w-0 [translate:var(--hulla-resize-x,0px)_var(--hulla-resize-y,0px)] data-[state=resizing]:select-none",
        className
      )}
    >
      {children}
    </div>
  )
}
