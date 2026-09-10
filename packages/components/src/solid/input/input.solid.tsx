import { mergeProps, splitProps, type JSX } from "solid-js"
import { formControlSizes, formControlVariants } from "@/+css/form-control.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"

const $size = resolve(formControlSizes)
const $variant = resolve(formControlVariants)

export type InputProps = JSX.IntrinsicElements["input"] & {
  controlSize?: typeof $size.infer
  variant?: typeof $variant.infer
}

export function Input(props: InputProps) {
  const [local, rest] = splitProps(
    mergeProps({ controlSize: "md", variant: "outline" } as const, props),
    ["class", "controlSize", "variant"]
  )

  return (
    <input
      {...rest}
      data-control=""
      data-slot="control"
      class={cn(
        "block w-full min-w-0 appearance-none text-foreground antialiased placeholder:text-muted-foreground transition-[background-color,border-color,box-shadow,color] duration-150 ease-out motion-reduce:transition-none file:mr-3 file:border-0 file:bg-transparent file:p-0 file:font-medium file:leading-[inherit] file:text-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:text-disabled-foreground disabled:placeholder:text-disabled-foreground enabled:aria-invalid:placeholder:text-danger/60",
        $size(local.controlSize),
        $variant(local.variant),
        local.class
      )}
    />
  )
}
