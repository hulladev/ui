import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type SelectGroupLabelProps = ComponentPropsWithRef<"div">

export function SelectGroupLabel({ children, className, ...props }: SelectGroupLabelProps) {
  return (
    <div
      {...props}
      data-slot="select-group-label"
      className={cn(
        "px-2 pt-1.5 pb-1 font-mono text-[0.625rem] font-medium tracking-[0.08em] text-muted-foreground uppercase",
        className
      )}
    >
      {children}
    </div>
  )
}
