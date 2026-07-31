import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type SidebarGroupProps = ComponentPropsWithRef<"section">

export function SidebarGroup({ children, className, ...props }: SidebarGroupProps) {
  return (
    <section {...props} data-slot="sidebar-group" className={cn("min-w-0 py-1.5", className)}>
      {children}
    </section>
  )
}
