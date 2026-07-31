import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type CardTitleProps = ComponentPropsWithRef<"h3">

export function CardTitle({ children, className, ...props }: CardTitleProps) {
  return (
    <h3
      {...props}
      data-slot="card-title"
      className={cn("text-lg font-semibold leading-6 tracking-[-0.025em]", className)}
    >
      {children}
    </h3>
  )
}
