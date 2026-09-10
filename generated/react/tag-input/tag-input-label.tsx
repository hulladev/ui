import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type TagInputLabelProps = ComponentPropsWithRef<"span">

export function TagInputLabel({ children, className, ...props }: TagInputLabelProps) {
  return (
    <span {...props} data-slot="tag-input-label" className={cn("min-w-0 truncate", className)}>
      {children}
    </span>
  )
}
