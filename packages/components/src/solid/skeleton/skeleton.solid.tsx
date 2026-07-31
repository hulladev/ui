import { mergeProps, splitProps, type JSX } from "solid-js"
import { skeletonVariants } from "@/+css/skeleton.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"

const $variant = resolve(skeletonVariants)

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
