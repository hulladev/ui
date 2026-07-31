import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type SidebarGroupLabelProps = ComponentPropsWithRef<"div">

export function SidebarGroupLabel({ children, className, ...props }: SidebarGroupLabelProps) {
  return (
    <div
      {...props}
      data-slot="sidebar-group-label"
      className={cn(
        "flex min-h-8 min-w-0 items-center px-2.5 font-mono text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase",
        className
      )}
    >
      {children}
    </div>
  )
}
