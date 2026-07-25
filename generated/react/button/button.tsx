import { vn, cn } from "@/lib/style"
import type { ComponentPropsWithoutRef } from "react"

const $size = vn({
  sm: "h-8 gap-1.5 rounded-sm px-2.5 text-[0.8125rem]",
  md: "h-9 gap-1.5 rounded-sm px-3.5 text-sm",
  lg: "h-12 gap-2 rounded-md px-5 text-base",
})
const $variant = vn({
  primary:
    "border-primary bg-primary text-primary-foreground hover:border-primary/90 hover:bg-primary/90",
  secondary:
    "border-foreground bg-foreground text-background hover:border-foreground/85 hover:bg-foreground/85",
  outline:
    "border-border bg-transparent text-foreground hover:border-foreground/25 hover:bg-foreground/5 active:bg-foreground/10",
})

export type ButtonProps = ComponentPropsWithoutRef<"button"> & {
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
