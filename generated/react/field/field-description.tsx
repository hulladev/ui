import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type FieldDescriptionProps = ComponentPropsWithRef<"p">

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
