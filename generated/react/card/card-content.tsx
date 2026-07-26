import { cn } from "@/lib/style"
import type { ComponentPropsWithoutRef } from "react"

export type CardContentProps = ComponentPropsWithoutRef<"div">

export function CardContent({ children, className, ...props }: CardContentProps) {
  return (
    <div {...props} data-slot="card-content" className={cn("min-w-0", className)}>
      {children}
    </div>
  )
}
