import { vn, cn } from "@/lib/style"
import { mergeProps, splitProps, type JSX } from "solid-js"

const $size = vn({
  sm: "h-5 gap-1.5 px-1.5 text-xs [&>svg]:size-3",
  md: "h-6 gap-1.5 px-2 text-[0.8125rem] [&>svg]:size-3.5",
  lg: "h-7 gap-2 px-2.5 text-sm [&>svg]:size-4",
})
const $variant = vn({
  neutral: "border-transparent bg-foreground/10 text-foreground dark:bg-foreground/15",
  primary:
    "border-transparent bg-primary text-primary-foreground dark:bg-primary/15 dark:text-primary-text",
  success: "border-transparent bg-success text-on-emphasis dark:bg-success/15 dark:text-success",
  warning: "border-transparent bg-warning text-foreground dark:bg-warning/15 dark:text-warning",
  danger: "border-transparent bg-danger text-on-emphasis dark:bg-danger/15 dark:text-danger",
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
