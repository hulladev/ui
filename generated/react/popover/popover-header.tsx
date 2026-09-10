import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type PopoverHeaderProps = ComponentPropsWithRef<"div">

export function PopoverHeader({ children, className, ...props }: PopoverHeaderProps) {
  return (
    <div
      {...props}
      data-slot="popover-header"
      className={cn("flex items-center gap-2.5 p-2.5", className)}
    >
      {children}
    </div>
  )
}
