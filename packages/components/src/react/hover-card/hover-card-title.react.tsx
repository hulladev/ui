import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type HoverCardTitleProps = ComponentPropsWithRef<"strong">

export function HoverCardTitle({ children, className, ...props }: HoverCardTitleProps) {
  return (
    <strong
      {...props}
      data-slot="hover-card-title"
      className={cn("block text-base font-semibold", className)}
    >
      {children}
    </strong>
  )
}
