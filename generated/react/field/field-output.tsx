import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type FieldOutputProps = ComponentPropsWithRef<"output">

export function FieldOutput({ children, className, ...props }: FieldOutputProps) {
  return (
    <output
      {...props}
      data-slot="field-output"
      className={cn("shrink-0 font-mono text-xs tabular-nums text-muted-foreground", className)}
    >
      {children}
    </output>
  )
}
