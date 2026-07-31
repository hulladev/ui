import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type NavigationMenuItemProps = ComponentPropsWithRef<"li"> & {
  value?: string
}

export function NavigationMenuItem({
  children,
  className,
  value,
  ...props
}: NavigationMenuItemProps) {
  return (
    <li
      {...props}
      data-slot="navigation-menu-item"
      data-state="closed"
      data-value={value}
      className={cn("contents", className)}
    >
      {children}
    </li>
  )
}
