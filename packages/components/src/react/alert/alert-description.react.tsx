import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type AlertDescriptionProps = ComponentPropsWithRef<"p">

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
