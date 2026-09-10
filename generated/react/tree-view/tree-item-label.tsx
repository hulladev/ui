import { vn, cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

const $interactiveRow = vn({
  default:
    "rounded-md text-muted-foreground transition-[background-color,color] duration-100 [&:not(:disabled):not([aria-disabled=true])]:hover:bg-hover-surface [&:not(:disabled):not([aria-disabled=true])]:hover:text-foreground motion-reduce:transition-none",
})

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
