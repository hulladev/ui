import { skeletonVariants } from "@/+css/skeleton.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"
import type { ComponentPropsWithRef } from "react"

const $variant = resolve(skeletonVariants)

export type SkeletonProps = ComponentPropsWithRef<"div"> & {
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
