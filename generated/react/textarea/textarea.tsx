import { vn, cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

const $size = vn({
  sm: "min-h-20 rounded-sm px-2.5 py-2 text-[0.8125rem] leading-5",
  md: "min-h-24 rounded-md px-3 py-2.5 text-sm leading-5",
  lg: "min-h-28 rounded-md px-3.5 py-3 text-base leading-6",
})
const $variant = vn({
  outline:
    "border border-foreground/25 bg-surface shadow-[inset_0_1px_2px_oklch(0_0_0/0.025)] enabled:not-focus-visible:not-aria-invalid:hover:border-foreground/40 focus-visible:ring-2 focus-visible:ring-focus-ring/25 focus-visible:border-focus-ring enabled:aria-invalid:border-danger enabled:aria-invalid:hover:border-danger disabled:border-disabled-border disabled:bg-disabled-surface disabled:shadow-none",
  filled:
    "border border-transparent bg-foreground/[0.075] shadow-none enabled:not-focus-visible:not-aria-invalid:hover:bg-foreground/[0.12] focus-visible:ring-2 focus-visible:ring-focus-ring/25 focus-visible:border-focus-ring focus-visible:bg-surface enabled:aria-invalid:border-danger/65 enabled:aria-invalid:bg-danger/[0.055] disabled:border-disabled-border disabled:bg-disabled-surface disabled:shadow-none",
  underline:
    "rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none enabled:not-focus-visible:not-aria-invalid:hover:border-foreground/40 focus-visible:border-focus-ring focus-visible:shadow-[0_1px_0_var(--color-focus-ring)] enabled:aria-invalid:border-danger disabled:border-disabled-border disabled:bg-transparent disabled:shadow-none",
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
        "block w-full min-w-0 resize-y appearance-none text-foreground antialiased placeholder:text-muted-foreground transition-[background-color,border-color,box-shadow,color] duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none disabled:cursor-not-allowed disabled:text-disabled-foreground disabled:placeholder:text-disabled-foreground enabled:aria-invalid:placeholder:text-danger/60",
        $size(controlSize),
        $variant(variant),
        className
      )}
    >
      {children}
    </textarea>
  )
}
