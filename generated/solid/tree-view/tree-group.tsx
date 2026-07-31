import { mergeProps, splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type TreeGroupProps = JSX.IntrinsicElements["ul"]

export function TreeGroup(props: TreeGroupProps) {
  const [local, rest] = splitProps(mergeProps({ role: "group" } as const, props), [
    "children",
    "class",
    "role",
  ])

  return (
    <ul
      {...rest}
      role={local.role}
      data-slot="tree-group"
      class={cn(
        "mt-0.5 ml-[0.9375rem] grid min-w-0 list-none gap-0.5 border-l border-border/70 p-0 pl-2 [&[hidden]]:hidden",
        local.class
      )}
    >
      {local.children}
    </ul>
  )
}
