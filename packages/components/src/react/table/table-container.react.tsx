import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type TableContainerProps = ComponentPropsWithRef<"div">

export function TableContainer({ children, className, ...props }: TableContainerProps) {
  return (
    <div
      {...props}
      data-slot="table-container"
      className={cn(
        "min-w-0 overflow-x-auto rounded-md border border-border bg-surface",
        className
      )}
    >
      {children}
    </div>
  )
}
