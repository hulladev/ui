import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type CodeProps = ComponentPropsWithRef<"code">

export function Code({ children, className, ...props }: CodeProps) {
  return (
    <code
      {...props}
      data-slot="code"
      className={cn(
        "box-decoration-clone rounded-[0.25em] bg-foreground/5 px-[0.25em] py-[0.125em] font-mono text-[0.875em] leading-[inherit] font-normal text-foreground [overflow-wrap:anywhere]",
        className
      )}
    >
      {children}
    </code>
  )
}
