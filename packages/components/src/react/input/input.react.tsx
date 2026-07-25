import { inputControlSizes, inputVariants } from "@/+css/input.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"
import type { ComponentPropsWithoutRef } from "react"

const $size = resolve(inputControlSizes)
const $variant = resolve(inputVariants)

export type InputProps = ComponentPropsWithoutRef<"input"> & {
  controlSize?: typeof $size.infer
  variant?: typeof $variant.infer
}

export function Input({
  className,
  controlSize = "md",
  variant = "outline",
  ...props
}: InputProps) {
  return (
    <input
      {...props}
      data-slot="control"
      className={cn(
        "block w-full min-w-0 appearance-none text-foreground antialiased placeholder:text-muted-foreground/65 transition-[background-color,border-color,box-shadow,color] duration-150 ease-out motion-reduce:transition-none file:mr-3 file:border-0 file:bg-transparent file:p-0 file:font-medium file:text-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-55 read-only:cursor-default aria-invalid:placeholder:text-danger/60",
        $variant(variant),
        $size(controlSize),
        className
      )}
    />
  )
}
