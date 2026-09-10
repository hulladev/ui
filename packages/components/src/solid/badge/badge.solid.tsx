import { mergeProps, splitProps, type JSX } from "solid-js"
import { badgeSizes, badgeVariants } from "@/+css/badge.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"

const $size = resolve(badgeSizes)
const $variant = resolve(badgeVariants)

export type BadgeProps = JSX.IntrinsicElements["span"] & {
  size?: typeof $size.infer
  variant?: typeof $variant.infer
}

export function Badge(props: BadgeProps) {
  const [local, rest] = splitProps(mergeProps({ size: "md", variant: "neutral" } as const, props), [
    "children",
    "class",
    "size",
    "variant",
  ])

  return (
    <span
      {...rest}
      data-slot="badge"
      data-variant={local.variant ?? "neutral"}
      class={cn(
        "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-[6px] border font-medium leading-none antialiased [&>svg]:shrink-0",
        $variant(local.variant),
        $size(local.size),
        local.class
      )}
    >
      {local.children}
    </span>
  )
}
