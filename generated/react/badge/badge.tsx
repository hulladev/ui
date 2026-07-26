import { vn, cn } from "@/lib/style"
import type { ComponentPropsWithoutRef } from "react"

const $size = vn({
  sm: "h-5 gap-1 rounded-sm px-1.5 text-[0.6875rem] [&>svg]:size-3",
  md: "h-6 gap-1.5 rounded-sm px-2 text-xs [&>svg]:size-3.5",
  lg: "h-7 gap-1.5 rounded-sm px-2.5 text-[0.8125rem] [&>svg]:size-4",
})
const $variant = vn({
  neutral: "border-border bg-foreground/5 text-muted-foreground",
  primary:
    "border-primary/25 bg-primary/10 text-[color-mix(in_oklab,var(--color-primary)_68%,var(--color-foreground))]",
  success: "border-success/25 bg-success/10 text-success",
  warning: "border-warning/25 bg-warning/10 text-warning",
  danger: "border-danger/25 bg-danger/10 text-danger",
})

export type BadgeProps = ComponentPropsWithoutRef<"span"> & {
  size?: typeof $size.infer
  variant?: typeof $variant.infer
}

export function Badge({
  children,
  className,
  size = "md",
  variant = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      data-slot="badge"
      className={cn(
        "inline-flex shrink-0 items-center justify-center whitespace-nowrap border font-medium leading-none tracking-[0.01em] antialiased [&>svg]:shrink-0",
        $variant(variant),
        $size(size),
        className
      )}
    >
      {children}
    </span>
  )
}
