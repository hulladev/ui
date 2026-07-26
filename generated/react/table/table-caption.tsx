import { cn } from "@/lib/style"
import type { ComponentPropsWithoutRef } from "react"

export type TableCaptionProps = ComponentPropsWithoutRef<"caption">

export function TableCaption({ children, className, ...props }: TableCaptionProps) {
  return (
    <caption
      {...props}
      data-slot="table-caption"
      className={cn(
        "caption-bottom px-4 pt-3 text-left text-xs leading-5 text-muted-foreground",
        className
      )}
    >
      {children}
    </caption>
  )
}
