import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type SelectGroupProps = ComponentPropsWithRef<"div">

export function SelectGroup({ children, className, role = "group", ...props }: SelectGroupProps) {
  return (
    <div
      {...props}
      role={role}
      data-slot="select-group"
      className={cn("py-0 not-first:border-t not-first:border-border", className)}
    >
      {children}
    </div>
  )
}
