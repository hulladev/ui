import { mergeProps, splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type TreeItemProps = Omit<JSX.IntrinsicElements["li"], "value"> & {
  defaultExpanded?: boolean
  value?: string
}

export function TreeItem(props: TreeItemProps) {
  const [local, rest] = splitProps(
    mergeProps({ defaultExpanded: false, role: "treeitem" } as const, props),
    ["aria-expanded", "children", "class", "defaultExpanded", "role", "value"]
  )

  return (
    <li
      {...rest}
      aria-expanded={local["aria-expanded"] ?? local.defaultExpanded}
      role={local.role}
      tabindex={-1}
      data-slot="tree-item"
      data-value={local.value}
      class={cn(
        "group/tree-item relative list-none outline-none [&[aria-disabled=true]>[data-slot=tree-item-label]]:pointer-events-none [&[aria-disabled=true]>[data-slot=tree-item-label]]:opacity-40 [&[aria-expanded]>[data-slot=tree-item-label]>[data-slot=tree-item-indicator]]:opacity-100 [&[aria-expanded=true]>[data-slot=tree-item-label]>[data-slot=tree-item-indicator]]:rotate-90 [&[aria-selected=true]>[data-slot=tree-item-label]]:bg-primary/10 [&[aria-selected=true]>[data-slot=tree-item-label]]:text-primary [&:focus-visible>[data-slot=tree-item-label]]:outline-2 [&:focus-visible>[data-slot=tree-item-label]]:outline-offset-[-2px] [&:focus-visible>[data-slot=tree-item-label]]:outline-focus-ring",
        local.class
      )}
    >
      {local.children}
    </li>
  )
}
