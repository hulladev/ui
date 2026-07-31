import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type NavigationMenuListProps = ComponentPropsWithRef<"ul">

export function NavigationMenuList({ children, className, ...props }: NavigationMenuListProps) {
  return (
    <ul
      {...props}
      data-slot="navigation-menu-list"
      className={cn(
        "m-0 flex min-w-0 flex-wrap items-center gap-0.5 rounded-lg bg-surface/72 p-1 shadow-xs ring-1 ring-border/80",
        className
      )}
    >
      {children}
    </ul>
  )
}
