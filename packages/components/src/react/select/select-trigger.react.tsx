import { formControlSizes, formControlVariants } from "@/+css/form-control.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"
import type { ComponentPropsWithRef } from "react"

const $size = resolve(formControlSizes)
const $variant = resolve(formControlVariants)

export type SelectTriggerProps = ComponentPropsWithRef<"button"> & {
  controlSize?: typeof $size.infer
  variant?: typeof $variant.infer
}

export function SelectTrigger({
  children,
  className,
  controlSize = "md",
  type = "button",
  variant = "outline",
  ...props
}: SelectTriggerProps) {
  return (
    <button
      {...props}
      type={type}
      data-control=""
      data-slot="select-trigger"
      className={cn(
        "group/select-trigger flex w-full min-w-0 cursor-pointer items-center gap-2 text-left text-foreground antialiased transition-[background-color,border-color,box-shadow,color] duration-150 ease-out after:mr-0.5 after:size-2 after:shrink-0 after:-translate-y-0.5 after:rotate-45 after:border-r after:border-b after:border-current after:opacity-55 after:transition-transform after:duration-150 after:content-[''] data-[state=open]:after:translate-y-1 data-[state=open]:after:rotate-225 motion-reduce:transition-none motion-reduce:after:transition-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-55",
        $size(controlSize),
        $variant(variant),
        className
      )}
    >
      {children}
    </button>
  )
}
