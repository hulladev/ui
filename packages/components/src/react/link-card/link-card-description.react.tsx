import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type LinkCardDescriptionProps = ComponentPropsWithRef<"span">

export function LinkCardDescription({ children, className, ...props }: LinkCardDescriptionProps) {
  return (
    <span
      {...props}
      data-slot="link-card-description"
      className={cn("text-xs leading-5 text-muted-foreground", className)}
    >
      {children}
    </span>
  )
}
