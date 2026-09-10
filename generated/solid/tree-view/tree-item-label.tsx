import { vn, cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

const $interactiveRow = vn({
  default:
    "rounded-md text-muted-foreground transition-[background-color,color] duration-100 [&:not(:disabled):not([aria-disabled=true])]:hover:bg-hover-surface [&:not(:disabled):not([aria-disabled=true])]:hover:text-foreground motion-reduce:transition-none",
})

export type TreeItemLabelProps = JSX.IntrinsicElements["span"]

export function TreeItemLabel(props: TreeItemLabelProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <span
      {...rest}
      data-slot="tree-item-label"
      class={cn(
        "flex min-h-8 min-w-0 cursor-default select-none items-center gap-2 px-2 text-sm [&_svg]:size-4 [&_svg]:shrink-0",
        $interactiveRow("default"),
        local.class
      )}
    >
      <span
        aria-hidden="true"
        data-slot="tree-item-indicator"
        class="inline-flex size-3.5 shrink-0 items-center justify-center text-current opacity-0 before:size-1.5 before:rotate-45 before:border-t before:border-r transition-[transform,opacity] duration-150 motion-reduce:transition-none"
      ></span>
      {local.children}
    </span>
  )
}
