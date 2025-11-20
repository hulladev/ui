import { buttonCss } from "@/+css/button.css"
import { cn } from "@/lib/style"
import { VariantProps } from "@hulla/style"
import { resolve } from "@hulla/ui"
import type { ButtonHTMLAttributes, DetailedHTMLProps, PropsWithChildren } from "react"

const buttonVariant = resolve(buttonCss)

export type ButtonProps = PropsWithChildren<
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
> &
  VariantProps<typeof buttonVariant>

export function Button({ children, className, variant, ...props }: ButtonProps) {
  return (
    <button {...props} className={cn(buttonVariant.css(variant), className)}>
      {children}
    </button>
  )
}
