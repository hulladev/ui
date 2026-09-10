import { mergeProps, splitProps, type JSX } from "solid-js"
import { formControlVariants } from "@/+css/form-control.css"
import { textareaControlSizes } from "@/+css/textarea.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"

const $size = resolve(textareaControlSizes)
const $variant = resolve(formControlVariants)

export type TextareaProps = JSX.IntrinsicElements["textarea"] & {
  controlSize?: typeof $size.infer
  variant?: typeof $variant.infer
}

export function Textarea(props: TextareaProps) {
  const [local, rest] = splitProps(
    mergeProps({ controlSize: "md", variant: "outline" } as const, props),
    ["children", "class", "controlSize", "variant"]
  )

  return (
    <textarea
      {...rest}
      data-control=""
      data-slot="textarea"
      class={cn(
        "block w-full min-w-0 resize-y appearance-none text-foreground antialiased placeholder:text-muted-foreground transition-[background-color,border-color,box-shadow,color] duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none disabled:cursor-not-allowed disabled:text-disabled-foreground disabled:placeholder:text-disabled-foreground enabled:aria-invalid:placeholder:text-danger/60",
        $size(local.controlSize),
        $variant(local.variant),
        local.class
      )}
    >
      {local.children}
    </textarea>
  )
}
