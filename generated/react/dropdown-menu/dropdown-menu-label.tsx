import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type DropdownMenuLabelProps = ComponentPropsWithRef<"div">

export function DropdownMenuLabel({
  children,
  className,
  role = "presentation",
  ...props
}: DropdownMenuLabelProps) {
  return (
    <div
      {...props}
      role={role}
      data-slot="dropdown-menu-label"
      className={cn(
        "px-2 pt-1.5 pb-1 text-[0.6875rem] leading-4 font-medium tracking-[0.02em] text-muted-foreground",
        className
      )}
    >
      {children}
    </div>
  )
}
