import { vn, cn } from "@/lib/style"
import { mergeProps, splitProps, type JSX } from "solid-js"

const $size = vn({
  sm: "h-8 rounded-sm px-2.5 text-[0.8125rem] [&[type=file]]:leading-[1.875rem] file:text-[0.8125rem]",
  md: "h-10 rounded-md px-3 text-sm [&[type=file]]:leading-[2.375rem] file:text-sm",
  lg: "h-12 rounded-md px-3.5 text-base [&[type=file]]:leading-[2.875rem] file:text-base",
})
const $variant = vn({
  outline:
    "border border-border bg-surface shadow-xs hover:border-foreground/25 focus-visible:border-primary aria-invalid:border-danger aria-invalid:hover:border-danger",
  filled:
    "border border-transparent bg-foreground/[0.055] shadow-none hover:bg-foreground/[0.075] focus-visible:border-primary/55 focus-visible:bg-surface aria-invalid:border-danger/65 aria-invalid:bg-danger/[0.055]",
  underline:
    "rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none hover:border-foreground/35 focus-visible:border-primary aria-invalid:border-danger",
})

export type SelectTriggerProps = JSX.IntrinsicElements["button"] & {
  controlSize?: typeof $size.infer
  variant?: typeof $variant.infer
}

export function SelectTrigger(props: SelectTriggerProps) {
  const [local, rest] = splitProps(
    mergeProps({ controlSize: "md", type: "button", variant: "outline" } as const, props),
    ["children", "class", "controlSize", "type", "variant"]
  )

  return (
    <button
      {...rest}
      type={local.type}
      data-control=""
      data-slot="select-trigger"
      class={cn(
        "group/select-trigger flex w-full min-w-0 cursor-pointer items-center gap-2 text-left text-foreground antialiased transition-[background-color,border-color,box-shadow,color] duration-150 ease-out after:mr-0.5 after:size-2 after:shrink-0 after:-translate-y-0.5 after:rotate-45 after:border-r after:border-b after:border-current after:opacity-55 after:transition-transform after:duration-150 after:content-[''] data-[state=open]:after:translate-y-1 data-[state=open]:after:rotate-225 motion-reduce:transition-none motion-reduce:after:transition-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-55",
        $size(local.controlSize),
        $variant(local.variant),
        local.class
      )}
    >
      {local.children}
    </button>
  )
}
