import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type CodeBlockFooterProps = ComponentPropsWithRef<"div">

export function CodeBlockFooter({ children, className, ...props }: CodeBlockFooterProps) {
  return (
    <div
      {...props}
      data-slot="code-block-footer"
      className={cn(
        "flex min-h-10 min-w-0 items-center gap-3 border-t border-border bg-surface px-4 py-2 text-xs text-muted-foreground",
        className
      )}
    >
      {children}
    </div>
  )
}
