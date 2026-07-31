import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type SidebarProps = ComponentPropsWithRef<"aside">

export function Sidebar({ children, className, ...props }: SidebarProps) {
  return (
    <aside
      {...props}
      data-slot="sidebar"
      className={cn(
        "flex h-full min-h-0 w-64 shrink-0 flex-col overflow-hidden border-r border-border bg-surface text-foreground",
        className
      )}
    >
      {children}
    </aside>
  )
}
