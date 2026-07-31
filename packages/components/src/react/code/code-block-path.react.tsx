import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type CodeBlockPathProps = ComponentPropsWithRef<"div">

export function CodeBlockPath({ children, className, ...props }: CodeBlockPathProps) {
  return (
    <div
      {...props}
      data-slot="code-block-path"
      className={cn(
        "flex min-h-8 min-w-0 items-center gap-3 border-b border-border bg-surface px-4 py-1.5 font-mono text-[0.6875rem] text-muted-foreground",
        className
      )}
    >
      {children}
    </div>
  )
}
