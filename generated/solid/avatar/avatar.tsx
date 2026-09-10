import { vn, cn } from "@/lib/style"
import { mergeProps, splitProps, type JSX } from "solid-js"

const $size = vn({
  sm: "size-6 text-[0.6875rem]",
  md: "size-8 text-sm",
  lg: "size-10 text-lg",
})

export type AvatarProps = JSX.IntrinsicElements["span"] & {
  size?: typeof $size.infer
}

export function Avatar(props: AvatarProps) {
  const [local, rest] = splitProps(mergeProps({ size: "md" } as const, props), [
    "children",
    "class",
    "size",
  ])

  return (
    <span
      {...rest}
      data-slot="avatar"
      data-size={local.size}
      class={cn(
        "relative inline-flex shrink-0 overflow-hidden rounded-full bg-foreground/5 text-muted-foreground ring-1 ring-border ring-inset",
        $size(local.size),
        local.class
      )}
    >
      {local.children}
    </span>
  )
}
