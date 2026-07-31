import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type TableHeadProps = ComponentPropsWithRef<"th">

export function TableHead({ children, className, scope = "col", ...props }: TableHeadProps) {
  return (
    <th
      {...props}
      scope={scope}
      data-slot="table-head"
      className={cn(
        "px-4 py-3 align-bottom text-xs font-medium tracking-wide text-muted-foreground",
        className
      )}
    >
      {children}
    </th>
  )
}
