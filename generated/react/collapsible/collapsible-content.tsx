import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type CollapsibleContentProps = ComponentPropsWithRef<"div">

export function CollapsibleContent({ children, className, ...props }: CollapsibleContentProps) {
  return (
    <div
      {...props}
      data-slot="collapsible-content"
      className={cn(
        "min-w-0 -translate-y-0.5 opacity-0 transition-[opacity,transform] duration-150 ease-out group-open/collapsible:translate-y-0 group-open/collapsible:opacity-100 group-open/collapsible:delay-50 motion-reduce:translate-y-0 motion-reduce:transition-none",
        className
      )}
    >
      {children}
    </div>
  )
}
