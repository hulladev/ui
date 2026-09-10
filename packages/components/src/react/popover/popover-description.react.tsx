import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type PopoverDescriptionProps = ComponentPropsWithRef<"p">

export function PopoverDescription({ children, className, ...props }: PopoverDescriptionProps) {
  return (
    <p
      {...props}
      data-slot="popover-description"
      className={cn("m-0 text-xs leading-5 text-muted-foreground", className)}
    >
      {children}
    </p>
  )
}
