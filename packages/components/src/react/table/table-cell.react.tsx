import { cn } from "@/lib/style"
import type { ComponentPropsWithoutRef } from "react"

export type TableCellProps = ComponentPropsWithoutRef<"td">

export function TableCell({ children, className, ...props }: TableCellProps) {
  return (
    <td
      {...props}
      data-slot="table-cell"
      className={cn("px-4 py-3 align-middle tabular-nums", className)}
    >
      {children}
    </td>
  )
}
