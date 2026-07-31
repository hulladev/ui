import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type AlertIconProps = ComponentPropsWithRef<"span">

export function AlertIcon({ children, className, ...props }: AlertIconProps) {
  return (
    <span
      {...props}
      aria-hidden="true"
      data-slot="alert-icon"
      className={cn(
        "pointer-events-none absolute top-[0.9375rem] left-4 inline-flex size-[1.125rem] items-center justify-center text-[var(--alert-accent)] [&>svg]:size-full",
        className
      )}
    >
      {children}
    </span>
  )
}
