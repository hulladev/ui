import { vn, cn } from "@/lib/style"
import { mergeProps, splitProps, type JSX } from "solid-js"

const $size = vn({
  sm: "h-8 rounded-sm px-2.5 text-[0.8125rem] [&[type=file]]:leading-[1.875rem] file:text-[0.8125rem]",
  md: "h-10 rounded-md px-3 text-sm [&[type=file]]:leading-[2.375rem] file:text-sm",
  lg: "h-12 rounded-md px-3.5 text-base [&[type=file]]:leading-[2.875rem] file:text-base",
})
const $variant = vn({
  outline:
    "border border-foreground/25 bg-surface shadow-[inset_0_1px_2px_oklch(0_0_0/0.025)] enabled:not-focus-visible:not-aria-invalid:hover:border-foreground/40 focus-visible:ring-2 focus-visible:ring-focus-ring/25 focus-visible:border-focus-ring enabled:aria-invalid:border-danger enabled:aria-invalid:hover:border-danger disabled:border-disabled-border disabled:bg-disabled-surface disabled:shadow-none",
  filled:
    "border border-transparent bg-foreground/[0.075] shadow-none enabled:not-focus-visible:not-aria-invalid:hover:bg-foreground/[0.12] focus-visible:ring-2 focus-visible:ring-focus-ring/25 focus-visible:border-focus-ring focus-visible:bg-surface enabled:aria-invalid:border-danger/65 enabled:aria-invalid:bg-danger/[0.055] disabled:border-disabled-border disabled:bg-disabled-surface disabled:shadow-none",
  underline:
    "rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none enabled:not-focus-visible:not-aria-invalid:hover:border-foreground/40 focus-visible:border-focus-ring focus-visible:shadow-[0_1px_0_var(--color-focus-ring)] enabled:aria-invalid:border-danger disabled:border-disabled-border disabled:bg-transparent disabled:shadow-none",
})

export type NativeSelectProps = JSX.IntrinsicElements["select"] & {
  controlSize?: typeof $size.infer
  variant?: typeof $variant.infer
}

export function NativeSelect(props: NativeSelectProps) {
  const [local, rest] = splitProps(
    mergeProps({ controlSize: "md", variant: "outline" } as const, props),
    ["children", "class", "controlSize", "variant"]
  )

  return (
    <select
      {...rest}
      data-control=""
      data-slot="control"
      class={cn(
        "block w-full min-w-0 cursor-pointer text-foreground antialiased transition-[background-color,border-color,box-shadow,color] duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none disabled:cursor-not-allowed disabled:text-disabled-foreground disabled:placeholder:text-disabled-foreground [&[multiple]]:h-auto [&[multiple]]:cursor-default [&[multiple]]:py-2",
        $size(local.controlSize),
        $variant(local.variant),
        "pr-9 [&[multiple]]:pr-3",
        local.class
      )}
    >
      {local.children}
    </select>
  )
}
