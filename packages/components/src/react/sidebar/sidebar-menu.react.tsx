import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type SidebarMenuProps = ComponentPropsWithRef<"ul">

export function SidebarMenu({ children, className, ...props }: SidebarMenuProps) {
  return (
    <ul
      {...props}
      data-slot="sidebar-menu"
      className={cn(
        "m-0 grid min-w-0 list-none gap-0.5 p-0 [&_[data-slot=sidebar-menu]]:ml-4 [&_[data-slot=sidebar-menu]]:mt-0.5 [&_[data-slot=sidebar-menu]]:border-l [&_[data-slot=sidebar-menu]]:border-border [&_[data-slot=sidebar-menu]]:pl-2",
        className
      )}
    >
      {children}
    </ul>
  )
}
