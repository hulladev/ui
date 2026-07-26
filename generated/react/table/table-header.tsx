import { cn } from "@/lib/style"
import type { ComponentPropsWithoutRef } from "react"

export type TableHeaderProps = ComponentPropsWithoutRef<"thead">

export function TableHeader({ children, className, ...props }: TableHeaderProps) {
  return (
    <thead
      {...props}
      data-slot="table-header"
      className={cn("[&_th]:border-b [&_th]:border-border", className)}
    >
      {children}
    </thead>
  )
}
