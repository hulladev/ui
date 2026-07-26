import { cn } from "@/lib/style"
import type { ComponentPropsWithoutRef } from "react"

export type KbdProps = ComponentPropsWithoutRef<"kbd">

export function Kbd({ children, className, ...props }: KbdProps) {
  return (
    <kbd
      {...props}
      data-slot="kbd"
      className={cn(
        "inline-flex min-h-5 min-w-5 shrink-0 select-none items-center justify-center whitespace-nowrap rounded-sm border border-border bg-surface-raised px-1.5 py-0.5 align-middle font-mono text-xs font-medium leading-none text-muted-foreground shadow-[0_1px_0_var(--color-border)]",
        className
      )}
    >
      {children}
    </kbd>
  )
}
