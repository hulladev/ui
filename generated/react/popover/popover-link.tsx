import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type PopoverLinkProps = ComponentPropsWithRef<"a">

export function PopoverLink({ children, className, ...props }: PopoverLinkProps) {
  return (
    <a
      {...props}
      data-slot="popover-link"
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-sm px-2.5 py-2 text-left text-xs text-foreground no-underline hover:bg-hover-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
        className
      )}
    >
      {children}
    </a>
  )
}
