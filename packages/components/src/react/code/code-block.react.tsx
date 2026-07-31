import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type CodeBlockProps = ComponentPropsWithRef<"div">

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  return (
    <div
      {...props}
      data-slot="code-block"
      className={cn(
        "group/code-block min-w-0 overflow-hidden rounded-md border border-border bg-surface-raised text-foreground shadow-sm",
        className
      )}
    >
      {children}
    </div>
  )
}
