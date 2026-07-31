import { vn, cn } from "@/lib/style"
import { mergeProps, splitProps, type JSX } from "solid-js"

const $size = vn({
  sm: "gap-1.5 rounded-sm px-2 py-1.5 text-[0.8125rem]",
  md: "gap-1.5 rounded-sm px-3 py-2 text-sm",
  lg: "gap-2 rounded-md px-3.5 py-2 text-base",
})
const $variant = vn({
  primary:
    "border-primary bg-primary text-primary-foreground hover:border-primary/90 hover:bg-primary/90",
  secondary:
    "border-foreground bg-foreground text-background hover:border-foreground/85 hover:bg-foreground/85",
  outline:
    "border-border bg-transparent text-foreground hover:border-foreground/25 hover:bg-foreground/5 active:bg-foreground/10",
})

export type ButtonProps = JSX.IntrinsicElements["button"] & {
  size?: typeof $size.infer
  variant?: typeof $variant.infer
}

export function Button(props: ButtonProps) {
  const [local, rest] = splitProps(
    mergeProps({ size: "md", type: "button", variant: "primary" } as const, props),
    ["children", "class", "size", "type", "variant"]
  )

  return (
    <button
      {...rest}
      type={local.type}
      class={cn(
        "relative inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap border font-medium leading-none tracking-[-0.01em] antialiased shadow-xs transition-[background-color,border-color,color,transform] duration-150 ease-out active:scale-[0.98] motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:border-border disabled:bg-foreground/5 disabled:text-muted-foreground disabled:shadow-none disabled:transform-none",
        $variant(local.variant),
        $size(local.size),
        local.class
      )}
    >
      {local.children}
    </button>
  )
}
