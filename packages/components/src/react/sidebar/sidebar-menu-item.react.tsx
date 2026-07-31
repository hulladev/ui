import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type SidebarMenuItemProps = ComponentPropsWithRef<"li">

export function SidebarMenuItem({ children, className, ...props }: SidebarMenuItemProps) {
  return (
    <li {...props} data-slot="sidebar-menu-item" className={cn("relative min-w-0", className)}>
      {children}
    </li>
  )
}
