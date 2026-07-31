import { vn, cn } from "@/lib/style"
import { mergeProps, splitProps, type JSX } from "solid-js"

const $size = vn({
  sm: "h-8 rounded-sm text-[0.8125rem] [&>[data-slot=input-adornment]]:px-2.5 [&>[data-control]]:px-2.5",
  md: "h-10 rounded-md text-sm [&>[data-slot=input-adornment]]:px-3 [&>[data-control]]:px-3",
  lg: "h-12 rounded-md text-base [&>[data-slot=input-adornment]]:px-3.5 [&>[data-control]]:px-3.5",
})
const $variant = vn({
  outline:
    "border border-border bg-surface shadow-xs hover:border-foreground/25 focus-within:border-primary has-[[data-control][aria-invalid=true]]:border-danger",
  filled:
    "border border-transparent bg-foreground/[0.055] shadow-none hover:bg-foreground/[0.075] focus-within:border-primary/55 focus-within:bg-surface has-[[data-control][aria-invalid=true]]:border-danger/65 has-[[data-control][aria-invalid=true]]:bg-danger/[0.055]",
  underline:
    "rounded-none border-0 border-b border-border bg-transparent shadow-none hover:border-foreground/35 focus-within:border-primary has-[[data-control][aria-invalid=true]]:border-danger",
})

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
        "group/input-group flex w-full min-w-0 items-center overflow-hidden text-foreground antialiased transition-[background-color,border-color,box-shadow,color] duration-150 ease-out motion-reduce:transition-none has-[[data-control]:disabled]:cursor-not-allowed has-[[data-control]:disabled]:opacity-55 [&>[data-control]]:h-full [&>[data-control]]:flex-1 [&>[data-control]]:rounded-none [&>[data-control]]:border-0 [&>[data-control]]:bg-transparent [&>[data-control]]:shadow-none [&>[data-control]:disabled]:opacity-100 [&>[data-control]]:hover:border-0 [&>[data-control]]:hover:bg-transparent [&>[data-control]]:focus-visible:border-0 [&>[data-control]]:focus-visible:bg-transparent [&>[data-slot=input-adornment]+[data-control]]:pl-0 [&>[data-control]:has(+[data-slot=input-adornment])]:pr-0",
        $size(local.controlSize),
        $variant(local.variant),
        local.class
      )}
    >
      {local.children}
    </div>
  )
}
