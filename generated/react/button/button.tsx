import { cn, vn } from "@/lib/style"
import type { ButtonHTMLAttributes, DetailedHTMLProps, PropsWithChildren } from "react"

const $variant = vn({
  primary: "bg-blue-500",
  outlined: "bg-transparent border border-gray-300",
})

export type ButtonProps = PropsWithChildren<
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
> & {
  variant: typeof $variant.infer
}

export function Button({ children, className, variant, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn("p-2 border-4 border-red-500 rounded", $variant(variant), className)}
    >
      {children}
    </button>
  )
}
