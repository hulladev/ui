import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type ComboboxGroupLabelProps = ComponentPropsWithRef<"div">

export function ComboboxGroupLabel({ children, className, ...props }: ComboboxGroupLabelProps) {
  return (
    <div
      {...props}
      data-slot="combobox-group-label"
      className={cn(
        "px-3 pt-2 pb-1 font-mono text-[0.625rem] font-medium tracking-[0.08em] text-muted-foreground uppercase",
        className
      )}
    >
      {children}
    </div>
  )
}
