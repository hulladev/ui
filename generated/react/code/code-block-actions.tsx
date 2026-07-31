import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type CodeBlockActionsProps = ComponentPropsWithRef<"div">

export function CodeBlockActions({ children, className, ...props }: CodeBlockActionsProps) {
  return (
    <div
      {...props}
      data-slot="code-block-actions"
      className={cn("ml-auto flex shrink-0 items-center gap-1.5", className)}
    >
      {children}
    </div>
  )
}
