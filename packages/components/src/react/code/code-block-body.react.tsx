import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type CodeBlockBodyProps = ComponentPropsWithRef<"div">

export function CodeBlockBody({ children, className, ...props }: CodeBlockBodyProps) {
  return (
    <div
      {...props}
      data-slot="code-block-body"
      className={cn(
        "relative min-w-0 [&>[data-slot=code-block-actions]]:absolute [&>[data-slot=code-block-actions]]:top-2 [&>[data-slot=code-block-actions]]:right-2 [&>[data-slot=code-block-actions]]:z-10 [&>[data-slot=code-block-actions]]:ml-0",
        className
      )}
    >
      {children}
    </div>
  )
}
