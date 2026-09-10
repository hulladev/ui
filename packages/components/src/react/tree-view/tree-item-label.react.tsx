import { interactiveRow } from "@/+css/interactive-row.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"
import type { ComponentPropsWithRef } from "react"

const $interactiveRow = resolve(interactiveRow)

export type TreeItemLabelProps = ComponentPropsWithRef<"span">

export function TreeItemLabel({ children, className, ...props }: TreeItemLabelProps) {
  return (
    <span
      {...props}
      data-slot="tree-item-label"
      className={cn(
        "flex min-h-8 min-w-0 cursor-default select-none items-center gap-2 px-2 text-sm [&_svg]:size-4 [&_svg]:shrink-0",
        $interactiveRow("default"),
        className
      )}
    >
      <span
        aria-hidden="true"
        data-slot="tree-item-indicator"
        className="inline-flex size-3.5 shrink-0 items-center justify-center text-current opacity-0 before:size-1.5 before:rotate-45 before:border-t before:border-r transition-[transform,opacity] duration-150 motion-reduce:transition-none"
      ></span>
      {children}
    </span>
  )
}
