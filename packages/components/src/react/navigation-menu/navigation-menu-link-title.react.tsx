import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type NavigationMenuLinkTitleProps = ComponentPropsWithRef<"strong">

export function NavigationMenuLinkTitle({
  children,
  className,
  ...props
}: NavigationMenuLinkTitleProps) {
  return (
    <strong
      {...props}
      data-slot="navigation-menu-link-title"
      className={cn("text-sm font-medium tracking-[-0.015em]", className)}
    >
      {children}
    </strong>
  )
}
