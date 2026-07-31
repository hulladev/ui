import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type SidebarContentProps = ComponentPropsWithRef<"nav">

export function SidebarContent({
  "aria-label": ariaLabel = "Sidebar navigation",
  children,
  className,
  ...props
}: SidebarContentProps) {
  return (
    <nav
      {...props}
      aria-label={ariaLabel}
      data-slot="sidebar-content"
      className={cn(
        "min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 [scrollbar-width:thin]",
        className
      )}
    >
      {children}
    </nav>
  )
}
