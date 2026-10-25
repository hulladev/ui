import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type AlertDescriptionProps = ComponentPropsWithRef<"div">

export function AlertDescription({ children, className, ...props }: AlertDescriptionProps) {
  return (
    <div
      {...props}
      data-slot="alert-description"
      className={cn("mt-1 text-muted-foreground", className)}
    >
      {children}
    </div>
  )
}
