import { mergeProps, splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type SelectGroupProps = JSX.IntrinsicElements["div"]

export function SelectGroup(props: SelectGroupProps) {
  const [local, rest] = splitProps(mergeProps({ role: "group" } as const, props), [
    "children",
    "class",
    "role",
  ])

  return (
    <div
      {...rest}
      role={local.role}
      data-slot="select-group"
      class={cn("py-0 not-first:border-t not-first:border-border", local.class)}
    >
      {local.children}
    </div>
  )
}
