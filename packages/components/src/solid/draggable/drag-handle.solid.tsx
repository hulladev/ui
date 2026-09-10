import { mergeProps, splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type DragHandleProps = JSX.IntrinsicElements["button"]

export function DragHandle(props: DragHandleProps) {
  const [local, rest] = splitProps(mergeProps({ type: "button" } as const, props), [
    "children",
    "class",
    "type",
  ])

  return (
    <button
      {...rest}
      type={local.type}
      data-hulla-drag-handle
      data-slot="drag-handle"
      data-state="idle"
      class={cn(
        "relative inline-flex min-h-8 touch-none select-none items-center gap-2 rounded-md border-0 bg-transparent px-2 text-left text-inherit cursor-grab transition-[background-color,color] duration-150 enabled:not-aria-disabled:hover:bg-foreground/5 enabled:not-aria-disabled:active:cursor-grabbing enabled:not-aria-disabled:data-[state=dragging]:cursor-grabbing disabled:cursor-not-allowed aria-disabled:cursor-not-allowed data-[state=dragging]:bg-foreground/8 motion-reduce:transition-none",
        local.class
      )}
    >
      {local.children}
    </button>
  )
}
