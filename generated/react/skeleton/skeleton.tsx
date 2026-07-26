import { vn, cn } from "@/lib/style"
import type { ComponentPropsWithoutRef } from "react"

const $variant = vn({
  pulse: "animate-skeleton-pulse",
  shimmer:
    "before:absolute before:inset-0 before:animate-skeleton-shimmer before:bg-[linear-gradient(105deg,transparent_20%,color-mix(in_oklab,var(--color-surface-raised)_82%,transparent)_50%,transparent_80%)] before:content-['']",
})

export type SkeletonProps = ComponentPropsWithoutRef<"div"> & {
  variant?: typeof $variant.infer
}

export function Skeleton({
  "aria-hidden": ariaHidden = true,
  children,
  className,
  variant = "pulse",
  ...props
}: SkeletonProps) {
  return (
    <div
      {...props}
      aria-hidden={ariaHidden}
      data-slot="skeleton"
      data-variant={variant}
      className={cn(
        "relative isolate overflow-hidden rounded-md bg-foreground/[0.08] [animation-iteration-count:var(--skeleton-iteration-count,infinite)] before:[animation-iteration-count:var(--skeleton-iteration-count,infinite)] motion-reduce:animate-none motion-reduce:before:animate-none motion-reduce:before:hidden dark:bg-foreground/[0.1]",
        $variant(variant),
        className
      )}
    >
      {children}
    </div>
  )
}
