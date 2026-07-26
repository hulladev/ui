import { cn } from "@/lib/style"
import type { ComponentPropsWithoutRef } from "react"

export type TableRowProps = ComponentPropsWithoutRef<"tr">

export function TableRow({ children, className, ...props }: TableRowProps) {
  return (
    <tr
      {...props}
      data-slot="table-row"
      className={cn(
        "transition-colors hover:bg-foreground/[0.045] data-[state=selected]:bg-primary/10",
        className
      )}
    >
      {children}
    </tr>
  )
}
