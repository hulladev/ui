import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type NavigationMenuLinkDescriptionProps = ComponentPropsWithRef<"span">

export function NavigationMenuLinkDescription({
  children,
  className,
  ...props
}: NavigationMenuLinkDescriptionProps) {
  return (
    <span
      {...props}
      data-slot="navigation-menu-link-description"
      className={cn("text-xs leading-5 text-muted-foreground", className)}
    >
      {children}
    </span>
  )
}
