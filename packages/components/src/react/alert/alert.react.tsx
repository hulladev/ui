import { alertVariants } from "@/+css/alert.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"
import type { ComponentPropsWithoutRef } from "react"

const $variant = resolve(alertVariants)

export type AlertProps = ComponentPropsWithoutRef<"div"> & {
  variant?: typeof $variant.infer
}

export function Alert({
  children,
  className,
  role = "note",
  variant = "note",
  ...props
}: AlertProps) {
  return (
    <div
      {...props}
      role={role}
      data-slot="alert"
      data-variant={variant}
      className={cn(
        "relative min-w-0 rounded-md border border-[color-mix(in_oklab,var(--alert-accent)_16%,var(--color-border))] bg-[color-mix(in_oklab,var(--alert-accent)_3%,var(--color-surface))] px-4 py-3.5 text-sm leading-5 text-foreground [&:has(>[data-slot=alert-icon])]:pl-11 [&_a]:font-medium [&_a]:decoration-current/35 [&_a]:underline [&_a]:underline-offset-4 [&_code]:font-mono [&_code]:text-[0.8125em]",
        $variant(variant),
        className
      )}
    >
      {children}
    </div>
  )
}
