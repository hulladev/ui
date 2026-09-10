import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type BreadcrumbEllipsisProps = ComponentPropsWithRef<"span">

export function BreadcrumbEllipsis({ children, className, ...props }: BreadcrumbEllipsisProps) {
  return (
    <span
      {...props}
      data-slot="breadcrumb-ellipsis"
      className={cn("inline-flex font-mono tracking-[0.12em]", className)}
    >
      {children ?? (
        <>
          <span aria-hidden="true">···</span>
          <span className="sr-only">More pages</span>
        </>
      )}
    </span>
  )
}
