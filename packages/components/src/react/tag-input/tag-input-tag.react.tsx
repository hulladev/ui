import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type TagInputTagProps = ComponentPropsWithRef<"span">

export function TagInputTag({ children, className, ...props }: TagInputTagProps) {
  return (
    <span
      {...props}
      data-slot="tag-input-tag"
      className={cn(
        "inline-flex max-w-full items-center gap-1 rounded-sm border border-border bg-foreground/[0.035] py-1 pl-2.5 pr-1 text-[0.8125rem] font-medium text-foreground [&>[data-tag-label]]:min-w-0 [&>[data-tag-label]]:truncate",
        className
      )}
    >
      {children}
    </span>
  )
}
