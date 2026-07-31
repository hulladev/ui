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
        "overflow-hidden p-1 text-foreground [&+&]:mt-1 [&+&]:border-t [&+&]:border-border [&+&]:pt-2",
        className
      )}
    >
      {children}
    </div>
  )
}
