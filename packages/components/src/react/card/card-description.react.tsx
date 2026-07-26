import { cn } from "@/lib/style"
import type { ComponentPropsWithoutRef } from "react"

export type CardDescriptionProps = ComponentPropsWithoutRef<"p">

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
