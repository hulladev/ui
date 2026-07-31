import { mergeProps, splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type PaginationProps = JSX.IntrinsicElements["nav"]

export function Pagination(props: PaginationProps) {
  const [local, rest] = splitProps(mergeProps({ "aria-label": "Pagination" } as const, props), [
    "aria-label",
    "children",
    "class",
  ])

  return (
    <nav
      {...rest}
      aria-label={local["aria-label"]}
      data-slot="pagination"
      class={cn("min-w-0", local.class)}
    >
      <ul data-slot="pagination-list" class="flex max-w-full items-center justify-center gap-1">
        {local.children}
      </ul>
    </nav>
  )
}
