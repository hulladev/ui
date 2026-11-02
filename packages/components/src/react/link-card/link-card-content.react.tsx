import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type LinkCardContentProps = ComponentPropsWithRef<"span">

export function LinkCardContent({ children, className, ...props }: LinkCardContentProps) {
  return (
    <span
      {...props}
      data-slot="link-card-content"
      className={cn("grid min-w-0 gap-0.5", className)}
    >
      {children}
    </span>
  )
}
