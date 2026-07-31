import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type CodeProps = ComponentPropsWithRef<"code">

export function Code({ children, className, ...props }: CodeProps) {
  return (
    <code
      {...props}
      data-slot="code"
      className={cn(
        "rounded-sm border border-border bg-foreground/[0.045] px-1.5 py-0.5 font-mono text-[0.875em] font-medium text-foreground",
        className
      )}
    >
      {children}
    </code>
  )
}
