import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type TreeGroupProps = ComponentPropsWithRef<"ul">

export function TreeGroup({ children, className, role = "group", ...props }: TreeGroupProps) {
  return (
    <ul
      {...props}
      role={role}
      data-slot="tree-group"
      className={cn(
        "mt-0.5 ml-[0.9375rem] grid min-w-0 list-none gap-0.5 border-l border-border/70 p-0 pl-2 [&[hidden]]:hidden",
        className
      )}
    >
      {children}
    </ul>
  )
}
