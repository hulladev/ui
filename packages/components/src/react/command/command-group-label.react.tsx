import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type CommandGroupLabelProps = ComponentPropsWithRef<"div">

export function CommandGroupLabel({ children, className, ...props }: CommandGroupLabelProps) {
  return (
    <div
      {...props}
      data-slot="command-group-label"
      className={cn(
        "px-2 pt-1 pb-1.5 font-mono text-[0.625rem] font-medium tracking-[0.08em] text-muted-foreground uppercase",
        className
      )}
    >
      {children}
    </div>
  )
}
