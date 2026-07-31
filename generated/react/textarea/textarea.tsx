import { vn, cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

const $size = vn({
  sm: "min-h-20 rounded-sm px-2.5 py-2 text-[0.8125rem] leading-5",
  md: "min-h-24 rounded-md px-3 py-2.5 text-sm leading-5",
  lg: "min-h-28 rounded-md px-3.5 py-3 text-base leading-6",
})
const $variant = vn({
  outline:
    "border border-border bg-surface shadow-xs hover:border-foreground/25 focus-visible:border-primary aria-invalid:border-danger aria-invalid:hover:border-danger",
  filled:
    "border border-transparent bg-foreground/[0.055] shadow-none hover:bg-foreground/[0.075] focus-visible:border-primary/55 focus-visible:bg-surface aria-invalid:border-danger/65 aria-invalid:bg-danger/[0.055]",
  underline:
    "rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none hover:border-foreground/35 focus-visible:border-primary aria-invalid:border-danger",
})

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
