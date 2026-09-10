import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type FieldContentProps = ComponentPropsWithRef<"div">

export function FieldContent({ children, className, ...props }: FieldContentProps) {
  return (
    <div {...props} data-slot="field-content" className={cn("grid min-w-0 gap-0.5", className)}>
      {children}
    </div>
  )
}
