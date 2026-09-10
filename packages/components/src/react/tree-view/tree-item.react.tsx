import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type TreeItemProps = Omit<ComponentPropsWithRef<"li">, "value"> & {
  defaultExpanded?: boolean
  value?: string
}

export function TreeItem({
  "aria-expanded": ariaExpanded,
  children,
  className,
  defaultExpanded = false,
  role = "treeitem",
  value,
  ...props
}: TreeItemProps) {
  return (
    <li
      {...props}
      aria-expanded={ariaExpanded ?? defaultExpanded}
      role={role}
      tabIndex={-1}
      data-slot="tree-item"
      data-value={value}
      className={cn(
        "group/tree-item relative list-none outline-none [&[aria-disabled=true]>[data-slot=tree-item-label]]:pointer-events-none [&[aria-disabled=true]>[data-slot=tree-item-label]]:text-disabled-foreground [&[aria-disabled=true]>[data-slot=tree-item-label]]:bg-transparent [&[aria-expanded]>[data-slot=tree-item-label]>[data-slot=tree-item-indicator]]:opacity-100 [&[aria-expanded=true]>[data-slot=tree-item-label]>[data-slot=tree-item-indicator]]:rotate-90 [&[aria-selected=true]:not([aria-disabled=true])>[data-slot=tree-item-label]]:bg-selected-surface [&[aria-selected=true]:not([aria-disabled=true])>[data-slot=tree-item-label]:hover]:bg-selected-hover-surface [&[aria-selected=true]:not([aria-disabled=true])>[data-slot=tree-item-label]]:text-primary-text [&[aria-selected=true]:not([aria-disabled=true])>[data-slot=tree-item-label]]:font-medium [&:focus-visible>[data-slot=tree-item-label]]:outline-2 [&:focus-visible>[data-slot=tree-item-label]]:outline-offset-[-2px] [&:focus-visible>[data-slot=tree-item-label]]:outline-focus-ring",
        className
      )}
    >
      {children}
    </li>
  )
}
