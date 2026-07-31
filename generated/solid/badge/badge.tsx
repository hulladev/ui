import { vn, cn } from "@/lib/style"
import { mergeProps, splitProps, type JSX } from "solid-js"

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
      class={cn(
        "inline-flex shrink-0 items-center justify-center whitespace-nowrap border font-medium leading-none tracking-[0.01em] antialiased [&>svg]:shrink-0",
        $variant(local.variant),
        $size(local.size),
        local.class
      )}
    >
      {local.children}
    </span>
  )
}
