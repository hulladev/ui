import { vn, cn } from "@/lib/style"
import type { ComponentPropsWithoutRef } from "react"

const $size = vn({
  sm: "h-8 rounded-sm px-2.5 text-[0.8125rem] file:text-[0.8125rem]",
  md: "h-10 rounded-md px-3 text-sm file:text-sm",
  lg: "h-12 rounded-md px-3.5 text-base file:text-base",
})
const $variant = vn({
  outline:
    "border border-border bg-surface shadow-xs hover:border-foreground/25 focus-visible:border-primary aria-invalid:border-danger aria-invalid:hover:border-danger",
  filled:
    "border border-transparent bg-foreground/[0.055] shadow-none hover:bg-foreground/[0.075] focus-visible:border-primary/55 focus-visible:bg-surface aria-invalid:border-danger/65 aria-invalid:bg-danger/[0.055]",
  underline:
    "rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none hover:border-foreground/35 focus-visible:border-primary aria-invalid:border-danger",
})

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
