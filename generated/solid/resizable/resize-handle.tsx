import { vn, cn } from "@/lib/style"
import { mergeProps, splitProps, type JSX } from "solid-js"

const $edge = vn({
  north: "top-0 left-3 right-3 h-3 -translate-y-1/2 cursor-ns-resize",
  "north-east": "top-0 right-0 size-5 -translate-y-1/2 translate-x-1/2 cursor-nesw-resize",
  east: "top-3 right-0 bottom-3 w-3 translate-x-1/2 cursor-ew-resize",
  "south-east": "right-0 bottom-0 size-5 translate-x-1/2 translate-y-1/2 cursor-nwse-resize",
  south: "right-3 bottom-0 left-3 h-3 translate-y-1/2 cursor-ns-resize",
  "south-west": "bottom-0 left-0 size-5 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize",
  west: "top-3 bottom-3 left-0 w-3 -translate-x-1/2 cursor-ew-resize",
  "north-west": "top-0 left-0 size-5 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize",
})

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
        "absolute z-10 touch-none select-none border-0 bg-transparent p-0 text-transparent before:absolute before:top-1/2 before:left-1/2 before:size-1.5 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-muted-foreground/65 before:opacity-0 before:transition-opacity before:duration-150 hover:before:opacity-100 focus-visible:before:opacity-100 data-[state=resizing]:before:opacity-100 motion-reduce:before:transition-none",
        $edge(local.edge),
        local.class
      )}
    >
      {local.children}
    </button>
  )
}
