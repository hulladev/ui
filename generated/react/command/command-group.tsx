import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type CommandGroupProps = ComponentPropsWithRef<"div">

export function CommandGroup({ children, className, role = "group", ...props }: CommandGroupProps) {
  return (
    <div
      {...props}
      role={role}
      data-slot="command-group"
      className={cn(
        "overflow-hidden py-0 text-foreground [&+&]:mt-1.5 [&+&]:border-t [&+&]:border-border [&+&]:pt-1.5",
        className
      )}
    >
      {children}
    </div>
  )
}
