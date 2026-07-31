import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type CommandSeparatorProps = ComponentPropsWithRef<"hr">

export function CommandSeparator({ className, ...props }: CommandSeparatorProps) {
  return (
    <hr
      {...props}
      data-slot="command-separator"
      className={cn("-mx-1 my-1 h-px border-0 bg-border", className)}
    />
  )
}
