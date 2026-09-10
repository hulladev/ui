import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type NavigationMenuLinkContentProps = ComponentPropsWithRef<"span">

export function NavigationMenuLinkContent({
  children,
  className,
  ...props
}: NavigationMenuLinkContentProps) {
  return (
    <span
      {...props}
      data-slot="navigation-menu-link-content"
      className={cn("grid min-w-0 gap-0.5", className)}
    >
      {children}
    </span>
  )
}
