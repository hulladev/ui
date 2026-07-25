import { cn } from "@/lib/style"
import type { ComponentPropsWithoutRef } from "react"

export type FieldDescriptionProps = ComponentPropsWithoutRef<"p">

export function FieldDescription({ children, className, ...props }: FieldDescriptionProps) {
  return (
    <p
      {...props}
      data-slot="description"
      className={cn("text-[0.8125rem] leading-5 text-muted-foreground", className)}
    >
      {children}
    </p>
  )
}
