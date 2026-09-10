import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type DropdownMenuSeparatorProps = ComponentPropsWithRef<"hr">

export function DropdownMenuSeparator({
  className,
  role = "separator",
  ...props
}: DropdownMenuSeparatorProps) {
  return (
    <hr
      {...props}
      role={role}
      data-slot="dropdown-menu-separator"
      className={cn("m-0 border-0 border-t border-border", className)}
    />
  )
}
