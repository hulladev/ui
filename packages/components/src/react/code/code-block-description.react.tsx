import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type CodeBlockDescriptionProps = ComponentPropsWithRef<"div">

export function CodeBlockDescription({ children, className, ...props }: CodeBlockDescriptionProps) {
  return (
    <div
      {...props}
      data-slot="code-block-description"
      className={cn("min-w-0 text-xs leading-5 text-muted-foreground", className)}
    >
      {children}
    </div>
  )
}
