import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type TableOfContentsSectionProps = ComponentPropsWithRef<"div"> & {
  id: string
  label: string
}

export function TableOfContentsSection({
  children,
  className,
  id,
  label,
  ...props
}: TableOfContentsSectionProps) {
  return (
    <div
      tabIndex={-1}
      {...props}
      id={id}
      data-slot="table-of-contents-section"
      data-toc-label={label}
      className={cn("scroll-mt-24", className)}
    >
      {children}
    </div>
  )
}
