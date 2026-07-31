import { formControlVariants } from "@/+css/form-control.css"
import { textareaControlSizes } from "@/+css/textarea.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"
import type { ComponentPropsWithRef } from "react"

const $size = resolve(textareaControlSizes)
const $variant = resolve(formControlVariants)

export type TextareaProps = ComponentPropsWithRef<"textarea"> & {
  controlSize?: typeof $size.infer
  variant?: typeof $variant.infer
}

export function Textarea({
  children,
  className,
  controlSize = "md",
  variant = "outline",
  ...props
}: TextareaProps) {
  return (
    <textarea
      {...props}
      data-control=""
      data-slot="textarea"
      className={cn(
        "block w-full min-w-0 resize-y appearance-none text-foreground antialiased placeholder:text-muted-foreground/65 transition-[background-color,border-color,box-shadow,color] duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-55 read-only:cursor-default aria-invalid:placeholder:text-danger/60",
        $size(controlSize),
        $variant(variant),
        className
      )}
    >
      {children}
    </textarea>
  )
}
