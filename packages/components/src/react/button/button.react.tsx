import { buttonSizes, buttonVariants } from "@/+css/button.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"
import type { ComponentPropsWithRef } from "react"

const $size = resolve(buttonSizes)
const $variant = resolve(buttonVariants)

export type ButtonProps = ComponentPropsWithRef<"button"> & {
  size?: typeof $size.infer
  variant?: typeof $variant.infer
}

export function Button({
  children,
  className,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={cn(
        "relative inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap border font-medium leading-none tracking-[-0.01em] antialiased shadow-xs transition-[background-color,border-color,color,transform] duration-150 ease-out active:scale-[0.98] motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:border-border disabled:bg-foreground/5 disabled:text-muted-foreground disabled:shadow-none disabled:transform-none",
        $variant(variant),
        $size(size),
        className
      )}
    >
      {children}
    </button>
  )
}
