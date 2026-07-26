import { cn } from "@/lib/style"
import type { ComponentPropsWithoutRef } from "react"

export type TableFooterProps = ComponentPropsWithoutRef<"tfoot">

export function TableFooter({ children, className, ...props }: TableFooterProps) {
  return (
    <tfoot
      {...props}
      data-slot="table-footer"
      className={cn(
        "font-medium [&_td]:border-t [&_td]:border-border [&_th]:border-t [&_th]:border-border [&_tr]:bg-foreground/[0.035]",
        className
      )}
    >
      {children}
    </tfoot>
  )
}
