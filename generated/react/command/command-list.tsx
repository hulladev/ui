import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type CommandListProps = ComponentPropsWithRef<"div">

export function CommandList({ children, className, role = "listbox", ...props }: CommandListProps) {
  return (
    <div
      {...props}
      role={role}
      data-slot="command-list"
      className={cn(
        "max-h-72 overflow-x-hidden overflow-y-auto overscroll-contain p-1.5",
        className
      )}
    >
      {children}
    </div>
  )
}
