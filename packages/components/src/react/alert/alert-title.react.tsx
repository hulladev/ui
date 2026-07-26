import { cn } from "@/lib/style"
import type { ComponentPropsWithoutRef } from "react"

export type AlertTitleProps = ComponentPropsWithoutRef<"strong">

export function AlertTitle({ children, className, ...props }: AlertTitleProps) {
  return (
    <strong
      {...props}
      data-slot="alert-title"
      className={cn("block font-semibold tracking-[-0.01em]", className)}
    >
      {children}
    </strong>
  )
}
