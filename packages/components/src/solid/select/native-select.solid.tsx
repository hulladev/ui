import { mergeProps, splitProps, type JSX } from "solid-js"
import { formControlSizes, formControlVariants } from "@/+css/form-control.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"

const $size = resolve(formControlSizes)
const $variant = resolve(formControlVariants)

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
        "block w-full min-w-0 cursor-pointer text-foreground antialiased transition-[background-color,border-color,box-shadow,color] duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-55 [&[multiple]]:h-auto [&[multiple]]:cursor-default [&[multiple]]:py-2",
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
