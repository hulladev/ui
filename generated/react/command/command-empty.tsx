import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type CommandEmptyProps = ComponentPropsWithRef<"div">

export function CommandEmpty({
  children,
  className,
  hidden = true,
  role = "status",
  ...props
}: CommandEmptyProps) {
  return (
    <div
      {...props}
      hidden={hidden}
      role={role}
      data-slot="command-empty"
      className={cn("px-4 py-10 text-center text-sm text-muted-foreground", className)}
    >
      {children}
    </div>
  )
}
