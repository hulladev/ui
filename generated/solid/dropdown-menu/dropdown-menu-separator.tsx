import { mergeProps, splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type DropdownMenuSeparatorProps = JSX.IntrinsicElements["hr"]

export function DropdownMenuSeparator(props: DropdownMenuSeparatorProps) {
  const [local, rest] = splitProps(mergeProps({ role: "separator" } as const, props), [
    "class",
    "role",
  ])

  return (
    <hr
      {...rest}
      role={local.role}
      data-slot="dropdown-menu-separator"
      class={cn("m-0 border-0 border-t border-border", local.class)}
    />
  )
}
