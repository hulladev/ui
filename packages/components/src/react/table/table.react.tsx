import { tableVariants } from "@/+css/table.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"
import type { ComponentPropsWithoutRef } from "react"

const $variant = resolve(tableVariants)

export type TableProps = ComponentPropsWithoutRef<"table"> & {
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
