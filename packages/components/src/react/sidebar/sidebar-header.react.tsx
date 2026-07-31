import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type SidebarHeaderProps = ComponentPropsWithRef<"header">

export function SidebarHeader({ children, className, ...props }: SidebarHeaderProps) {
  return (
    <header
      {...props}
      data-slot="sidebar-header"
      className={cn("shrink-0 border-b border-border p-3", className)}
    >
      {children}
    </header>
  )
}
