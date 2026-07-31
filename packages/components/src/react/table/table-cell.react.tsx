import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type TableCellProps = ComponentPropsWithRef<"td">

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
