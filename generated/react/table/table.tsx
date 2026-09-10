import { vn, cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

const $variant = vn({
  plain: "",
  divided:
    "bg-surface [&_thead]:bg-foreground/[0.045] [&_tbody_td]:border-b [&_tbody_td]:border-border [&_tbody_th]:border-b [&_tbody_th]:border-border [&_tbody_tr:last-child_td]:border-b-0 [&_tbody_tr:last-child_th]:border-b-0",
  striped:
    "overflow-hidden rounded-md border border-border bg-surface shadow-xs [&_thead]:bg-foreground/[0.065] [&_tbody_tr:nth-child(odd)]:bg-foreground/[0.035] dark:[&_thead]:bg-foreground/[0.085] dark:[&_tbody_tr:nth-child(odd)]:bg-foreground/[0.055]",
})

export type TableProps = ComponentPropsWithRef<"table"> & {
  variant?: typeof $variant.infer
}

export function Table({ children, className, variant = "divided", ...props }: TableProps) {
  return (
    <table
      {...props}
      data-slot="table"
      data-variant={variant}
      className={cn(
        "w-full border-separate border-spacing-0 text-left text-sm text-foreground",
        $variant(variant),
        className
      )}
    >
      {children}
    </table>
  )
}
