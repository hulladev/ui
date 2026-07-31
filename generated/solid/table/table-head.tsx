import { mergeProps, splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type TableHeadProps = JSX.IntrinsicElements["th"]

export function TableHead(props: TableHeadProps) {
  const [local, rest] = splitProps(mergeProps({ scope: "col" } as const, props), [
    "children",
    "class",
    "scope",
  ])

  return (
    <th
      {...rest}
      scope={local.scope}
      data-slot="table-head"
      class={cn(
        "px-4 py-3 align-bottom text-xs font-medium tracking-wide text-muted-foreground",
        local.class
      )}
    >
      {local.children}
    </th>
  )
}
