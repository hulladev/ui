import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type FieldErrorProps = ComponentPropsWithRef<"p">

export function FieldError({ children, className, ...props }: FieldErrorProps) {
  return (
    <p
      {...props}
      data-slot="error"
      className={cn(
        "flex items-start gap-1.5 text-[0.8125rem] font-medium leading-5 text-danger before:mt-[0.45rem] before:block before:size-1 before:shrink-0 before:rounded-full before:bg-current empty:hidden",
        className
      )}
    >
      {children}
    </p>
  )
}
