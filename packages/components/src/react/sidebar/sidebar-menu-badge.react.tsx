import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type SidebarMenuBadgeProps = ComponentPropsWithRef<"span">

export function SidebarMenuBadge({ children, className, ...props }: SidebarMenuBadgeProps) {
  return (
    <span
      {...props}
      data-slot="sidebar-menu-badge"
      className={cn(
        "pointer-events-none absolute top-1/2 right-2 inline-flex min-w-5 -translate-y-1/2 items-center justify-center rounded-sm bg-foreground/[0.065] px-1 font-mono text-[0.625rem] leading-5 font-medium tabular-nums text-muted-foreground",
        className
      )}
    >
      {children}
    </span>
  )
}
