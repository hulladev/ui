import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type CardHeaderProps = ComponentPropsWithRef<"header">

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <header {...props} data-slot="card-header" className={cn("grid gap-1.5", className)}>
      {children}
    </header>
  )
}
