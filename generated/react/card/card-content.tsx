import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type CardContentProps = ComponentPropsWithRef<"div">

export function CardContent({ children, className, ...props }: CardContentProps) {
  return (
    <div {...props} data-slot="card-content" className={cn("min-w-0", className)}>
      {children}
    </div>
  )
}
