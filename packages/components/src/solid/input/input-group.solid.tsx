import { mergeProps, splitProps, type JSX } from "solid-js"
import { formControlGroupSizes, formControlGroupVariants } from "@/+css/form-control.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"

const $size = resolve(formControlGroupSizes)
const $variant = resolve(formControlGroupVariants)

export type InputGroupProps = Omit<JSX.IntrinsicElements["div"], "children"> & {
  children: JSX.Element
  controlSize?: typeof $size.infer
  variant?: typeof $variant.infer
}

export function InputGroup(props: InputGroupProps) {
  const [local, rest] = splitProps(
    mergeProps({ controlSize: "md", variant: "outline" } as const, props),
    ["children", "class", "controlSize", "variant"]
  )

  return (
    <div
      {...rest}
      data-slot="input-group"
      class={cn(
        "group/input-group flex w-full min-w-0 items-center overflow-hidden text-foreground antialiased transition-[background-color,border-color,box-shadow,color] duration-150 ease-out motion-reduce:transition-none has-[[data-control]:disabled]:cursor-not-allowed has-[[data-control]:disabled]:bg-disabled-surface has-[[data-control]:disabled]:border-disabled-border has-[[data-control]:disabled]:shadow-none has-[[data-control]:disabled]:[&>[data-slot=input-adornment]]:text-disabled-foreground [&>[data-control]]:h-full [&>[data-control]]:flex-1 [&>[data-control]]:rounded-none [&>[data-control]]:border-0 [&>[data-control]]:bg-transparent [&>[data-control]]:shadow-none [&>[data-control]:disabled]:opacity-100 [&>[data-control]:enabled:not(:focus-visible):not([aria-invalid=true])]:hover:border-0 [&>[data-control]:enabled:not(:focus-visible):not([aria-invalid=true])]:hover:bg-transparent [&>[data-control]]:focus-visible:ring-0 [&>[data-control]]:focus-visible:border-0 [&>[data-control]]:focus-visible:bg-transparent [&>[data-slot=input-adornment]+[data-control]]:pl-0 [&>[data-control]:has(+[data-slot=input-adornment])]:pr-0",
        $size(local.controlSize),
        $variant(local.variant),
        local.class
      )}
    >
      {local.children}
    </div>
  )
}
