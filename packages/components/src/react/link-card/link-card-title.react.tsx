import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type LinkCardTitleProps = ComponentPropsWithRef<"strong">

export function LinkCardTitle({ children, className, ...props }: LinkCardTitleProps) {
  return (
    <strong
      {...props}
      data-slot="link-card-title"
      className={cn("text-sm font-medium tracking-[-0.015em]", className)}
    >
      {children}
    </strong>
  )
}
