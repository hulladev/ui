import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type SidebarMenuItemProps = JSX.IntrinsicElements["li"]

export function SidebarMenuItem(props: SidebarMenuItemProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <li {...rest} data-slot="sidebar-menu-item" class={cn("relative min-w-0", local.class)}>
      {local.children}
    </li>
  )
}
