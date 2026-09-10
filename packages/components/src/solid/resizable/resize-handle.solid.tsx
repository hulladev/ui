import { mergeProps, splitProps, type JSX } from "solid-js"
import { resizeHandleEdges } from "@/+css/resize-handle.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"

const $edge = resolve(resizeHandleEdges)

export type ResizeHandleProps = JSX.IntrinsicElements["button"] & {
  edge: typeof $edge.infer
}

export function ResizeHandle(props: ResizeHandleProps) {
  const [local, rest] = splitProps(mergeProps({ type: "button" } as const, props), [
    "children",
    "class",
    "edge",
    "type",
  ])

  return (
    <button
      {...rest}
      type={local.type}
      data-edge={local.edge}
      data-hulla-resize-handle
      data-slot="resize-handle"
      data-state="idle"
      class={cn(
        "absolute z-10 touch-none select-none border-0 bg-transparent p-0 text-transparent before:absolute before:top-1/2 before:left-1/2 before:size-1.5 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-muted-foreground/65 before:opacity-0 before:transition-opacity before:duration-150 disabled:cursor-not-allowed aria-disabled:cursor-not-allowed enabled:hover:before:opacity-100 focus-visible:before:opacity-100 data-[state=resizing]:before:opacity-100 motion-reduce:before:transition-none",
        $edge(local.edge),
        local.class
      )}
    >
      {local.children}
    </button>
  )
}
