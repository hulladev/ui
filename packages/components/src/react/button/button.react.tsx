import { buttonCss } from "@/+css/button.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"
import type { ButtonHTMLAttributes, DetailedHTMLProps, PropsWithChildren } from "react"

const $variant = resolve(buttonCss)

export type ButtonProps = PropsWithChildren<
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
> & {
  variant: typeof $variant.infer
}

export function Button({ children, className, variant, ...props }: ButtonProps) {
  return (
    <button {...props} className={cn("p-4 rounded", $variant(variant), className)}>
      {children}
    </button>
  )
}
