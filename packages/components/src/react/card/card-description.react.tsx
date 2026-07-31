import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type CardDescriptionProps = ComponentPropsWithRef<"p">

export function CardDescription({ children, className, ...props }: CardDescriptionProps) {
  return (
    <p
      {...props}
      data-slot="card-description"
      className={cn("text-sm leading-6 text-muted-foreground", className)}
    >
      {children}
    </p>
  )
}
