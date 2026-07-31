import { sidebarMenuControls } from "@/+css/sidebar.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"
import type { ComponentPropsWithRef } from "react"

const $control = resolve(sidebarMenuControls)

export type SidebarMenuLinkProps = ComponentPropsWithRef<"a">

export function SidebarMenuLink({ children, className, ...props }: SidebarMenuLinkProps) {
  return (
    <a {...props} data-slot="sidebar-menu-link" className={cn($control("default"), className)}>
      {children}
    </a>
  )
}
