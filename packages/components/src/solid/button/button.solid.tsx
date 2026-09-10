import { mergeProps, splitProps, type JSX } from "solid-js"
import { buttonSizes, buttonVariants } from "@/+css/button.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"

const $size = resolve(buttonSizes)
const $variant = resolve(buttonVariants)

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
        "relative inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap border font-medium leading-none tracking-[-0.01em] antialiased [&>svg]:shrink-0 transition-[background-color,border-color,color,translate] duration-120 ease-out motion-safe:enabled:not-aria-disabled:active:translate-y-px motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:border-disabled-border disabled:bg-disabled-surface disabled:text-disabled-foreground disabled:shadow-none",
        $variant(local.variant),
        $size(local.size),
        local.class
      )}
    >
      {local.children}
    </button>
  )
}
