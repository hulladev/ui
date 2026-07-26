import { cn } from "@/lib/style"
import type { ComponentPropsWithoutRef } from "react"

export type AlertDescriptionProps = ComponentPropsWithoutRef<"p">

export function AlertDescription({ children, className, ...props }: AlertDescriptionProps) {
  return (
    <p
      {...props}
      data-slot="alert-description"
      className={cn("mt-1 text-muted-foreground", className)}
    >
      {children}
    </p>
  )
}
