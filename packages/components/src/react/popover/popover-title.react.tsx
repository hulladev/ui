import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type PopoverTitleProps = ComponentPropsWithRef<"strong">

export function PopoverTitle({ children, className, ...props }: PopoverTitleProps) {
  return (
    <strong
      {...props}
      data-slot="popover-title"
      className={cn("block text-sm font-semibold", className)}
    >
      {children}
    </strong>
  )
}
