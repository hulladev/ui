import { badgeSizes, badgeVariants } from "@/+css/badge.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"
import type { ComponentPropsWithRef } from "react"

const $size = resolve(badgeSizes)
const $variant = resolve(badgeVariants)

export type BadgeProps = ComponentPropsWithRef<"span"> & {
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
