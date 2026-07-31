import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type PaginationProps = ComponentPropsWithRef<"nav">

export function Pagination({
  "aria-label": ariaLabel = "Pagination",
  children,
  className,
  ...props
}: PaginationProps) {
  return (
    <nav
      {...props}
      aria-label={ariaLabel}
      data-slot="pagination"
      className={cn("min-w-0", className)}
    >
      <ul data-slot="pagination-list" className="flex max-w-full items-center justify-center gap-1">
        {children}
      </ul>
    </nav>
  )
}
