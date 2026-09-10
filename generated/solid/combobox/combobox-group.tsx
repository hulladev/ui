import { mergeProps, splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type ComboboxGroupProps = JSX.IntrinsicElements["div"]

export function ComboboxGroup(props: ComboboxGroupProps) {
  const [local, rest] = splitProps(mergeProps({ role: "group" } as const, props), [
    "children",
    "class",
    "role",
  ])

  return (
    <div
      {...rest}
      role={local.role}
      data-slot="combobox-group"
      class={cn("py-0 not-first:border-t not-first:border-border", local.class)}
    >
      {local.children}
    </div>
  )
}
