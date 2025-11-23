import { cn, variant } from "@/lib/style"
import { VariantProps } from "@hulla/style"
import type { ButtonHTMLAttributes, DetailedHTMLProps, PropsWithChildren } from "react"

const buttonVariant = variant({
  name: "variant",
  classes: {
    primary: "bg-blue-500",
    outlined: "bg-transparent border border-gray-300",
  },
  base: "cursor-pointer rounded-sm",
  default: "primary",
})

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
