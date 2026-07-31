import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type TableCaptionProps = ComponentPropsWithRef<"caption">

export function TableCaption({ children, className, ...props }: TableCaptionProps) {
  return (
    <caption
      {...props}
      data-slot="table-caption"
      className={cn(
        "caption-bottom px-4 py-3 text-left text-xs leading-5 text-muted-foreground",
        className
      )}
    >
      {children}
    </caption>
  )
}
