import { cn } from "@/lib/style"
import type { ComponentPropsWithoutRef } from "react"

export type BreadcrumbsProps = ComponentPropsWithoutRef<"nav">

export function Breadcrumbs({
  "aria-label": ariaLabel = "Breadcrumb",
  children,
  className,
  ...props
}: BreadcrumbsProps) {
  return (
    <nav
      {...props}
      aria-label={ariaLabel}
      data-slot="breadcrumbs"
      className={cn("min-w-0", className)}
    >
      <ol
        data-slot="breadcrumbs-list"
        className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm leading-5 text-muted-foreground"
      >
        {children}
      </ol>
    </nav>
  )
}
