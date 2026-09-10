import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type FieldHeaderProps = ComponentPropsWithRef<"div">

export function FieldHeader({ children, className, ...props }: FieldHeaderProps) {
  return (
    <div
      {...props}
      data-slot="field-header"
      className={cn("flex min-w-0 items-baseline justify-between gap-3", className)}
    >
      {children}
    </div>
  )
}
