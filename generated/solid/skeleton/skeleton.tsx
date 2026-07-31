import { vn, cn } from "@/lib/style"
import { mergeProps, splitProps, type JSX } from "solid-js"

const $variant = vn({
  pulse: "animate-skeleton-pulse",
  shimmer:
    "before:absolute before:inset-0 before:animate-skeleton-shimmer before:bg-[linear-gradient(105deg,transparent_20%,color-mix(in_oklab,var(--color-surface-raised)_82%,transparent)_50%,transparent_80%)] before:content-['']",
})

export type SkeletonProps = JSX.IntrinsicElements["div"] & {
  variant?: typeof $variant.infer
}

export function Skeleton(props: SkeletonProps) {
  const [local, rest] = splitProps(
    mergeProps({ "aria-hidden": true, variant: "pulse" } as const, props),
    ["aria-hidden", "children", "class", "variant"]
  )

  return (
    <div
      {...rest}
      aria-hidden={local["aria-hidden"]}
      data-slot="skeleton"
      data-variant={local.variant}
      class={cn(
        "relative isolate overflow-hidden rounded-md bg-foreground/[0.08] [animation-iteration-count:var(--skeleton-iteration-count,infinite)] before:[animation-iteration-count:var(--skeleton-iteration-count,infinite)] motion-reduce:animate-none motion-reduce:before:animate-none motion-reduce:before:hidden dark:bg-foreground/[0.1]",
        $variant(local.variant),
        local.class
      )}
    >
      {local.children}
    </div>
  )
}
