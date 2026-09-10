import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type FieldStatusProps = ComponentPropsWithRef<"output">

export function FieldStatus({ children, className, ...props }: FieldStatusProps) {
  return (
    <output
      {...props}
      data-slot="field-status"
      className={cn(
        "flex min-h-5 items-center gap-2 text-xs text-muted-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        className
      )}
    >
      {children}
    </output>
  )
}
