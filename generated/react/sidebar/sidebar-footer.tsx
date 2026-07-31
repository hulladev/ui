import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type SidebarFooterProps = ComponentPropsWithRef<"footer">

export function SidebarFooter({ children, className, ...props }: SidebarFooterProps) {
  return (
    <footer
      {...props}
      data-slot="sidebar-footer"
      className={cn("shrink-0 border-t border-border p-3", className)}
    >
      {children}
    </footer>
  )
}
