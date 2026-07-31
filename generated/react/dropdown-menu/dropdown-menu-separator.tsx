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
      className={cn("mx-0 my-1 border-0 border-t border-border", className)}
    />
  )
}
