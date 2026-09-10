import { sidebarMenuLayout } from "@/+css/sidebar.css"
import { resolve } from "@hulla/ui"
import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

const $menu = resolve(sidebarMenuLayout)

export type SidebarMenuProps = ComponentPropsWithRef<"ul"> & {
  /** Hierarchy lines for this branch. Defaults to nested; descendants may override. */
  lines?: "none" | "nested" | "all"
}

export function SidebarMenu({ children, className, lines, ...props }: SidebarMenuProps) {
  return (
    <ul
      {...props}
      data-slot="sidebar-menu"
      data-lines={lines}
      className={cn($menu("default"), className)}
    >
      {children}
    </ul>
  )
}
