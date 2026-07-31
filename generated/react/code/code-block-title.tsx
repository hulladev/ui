import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type CodeBlockTitleProps = ComponentPropsWithRef<"div">

export function CodeBlockTitle({ children, className, ...props }: CodeBlockTitleProps) {
  return (
    <div
      {...props}
      data-slot="code-block-title"
      className={cn(
        "min-w-0 truncate font-mono text-xs font-medium tracking-[-0.01em] text-foreground",
        className
      )}
    >
      {children}
    </div>
  )
}
