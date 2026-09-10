import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type HoverCardDescriptionProps = ComponentPropsWithRef<"p">

export function HoverCardDescription({ children, className, ...props }: HoverCardDescriptionProps) {
  return (
    <p
      {...props}
      data-slot="hover-card-description"
      className={cn("m-0 text-xs leading-6 text-muted-foreground", className)}
    >
      {children}
    </p>
  )
}
