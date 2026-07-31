import { mergeProps, splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type DropdownMenuLabelProps = JSX.IntrinsicElements["div"]

export function DropdownMenuLabel(props: DropdownMenuLabelProps) {
  const [local, rest] = splitProps(mergeProps({ role: "presentation" } as const, props), [
    "children",
    "class",
    "role",
  ])

  return (
    <div
      {...rest}
      role={local.role}
      data-slot="dropdown-menu-label"
      class={cn(
        "px-2 pt-1.5 pb-1 text-[0.6875rem] leading-4 font-medium tracking-[0.02em] text-muted-foreground",
        local.class
      )}
    >
      {local.children}
    </div>
  )
}
