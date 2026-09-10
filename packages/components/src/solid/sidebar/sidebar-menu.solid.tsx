import { splitProps, type JSX } from "solid-js"
import { sidebarMenuLayout } from "@/+css/sidebar.css"
import { resolve } from "@hulla/ui"
import { cn } from "@/lib/style"

const $menu = resolve(sidebarMenuLayout)

export type SidebarMenuProps = JSX.IntrinsicElements["ul"] & {
  /** Hierarchy lines for this branch. Defaults to nested; descendants may override. */
  lines?: "none" | "nested" | "all"
}

export function SidebarMenu(props: SidebarMenuProps) {
  const [local, rest] = splitProps(props, ["children", "class", "lines"])

  return (
    <ul
      {...rest}
      data-slot="sidebar-menu"
      data-lines={local.lines}
      class={cn($menu("default"), local.class)}
    >
      {local.children}
    </ul>
  )
}
