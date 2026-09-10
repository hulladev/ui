import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type RadioGroupLegendProps = ComponentPropsWithRef<"legend">

export function RadioGroupLegend({ children, className, ...props }: RadioGroupLegendProps) {
  return (
    <legend
      {...props}
      data-slot="radio-group-legend"
      className={cn("mb-1 text-sm font-medium text-foreground", className)}
    >
      {children}
    </legend>
  )
}
