import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type DragHandleProps = ComponentPropsWithRef<"button">

export function DragHandle({ children, className, type = "button", ...props }: DragHandleProps) {
  return (
    <button
      {...props}
      type={type}
      data-hulla-drag-handle
      data-slot="drag-handle"
      data-state="idle"
      className={cn(
        "relative inline-flex min-h-8 touch-none select-none items-center gap-2 rounded-md border-0 bg-transparent px-2 text-left text-inherit cursor-grab transition-[background-color,color] duration-150 hover:bg-foreground/5 active:cursor-grabbing data-[state=dragging]:cursor-grabbing data-[state=dragging]:bg-foreground/8 motion-reduce:transition-none",
        className
      )}
    >
      {children}
    </button>
  )
}
