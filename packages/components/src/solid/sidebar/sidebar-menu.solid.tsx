import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type SidebarMenuProps = JSX.IntrinsicElements["ul"]

export function SidebarMenu(props: SidebarMenuProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <ul
      {...rest}
      data-slot="sidebar-menu"
      class={cn(
        "m-0 grid min-w-0 list-none gap-0.5 p-0 [&_[data-slot=sidebar-menu]]:ml-4 [&_[data-slot=sidebar-menu]]:mt-0.5 [&_[data-slot=sidebar-menu]]:border-l [&_[data-slot=sidebar-menu]]:border-border [&_[data-slot=sidebar-menu]]:pl-2",
        local.class
      )}
    >
      {local.children}
    </ul>
  )
}
