import { cn } from "@/lib/style"
import type { ComponentPropsWithoutRef } from "react"

export type CardHeaderProps = ComponentPropsWithoutRef<"header">

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <header {...props} data-slot="card-header" className={cn("grid gap-1.5", className)}>
      {children}
    </header>
  )
}
