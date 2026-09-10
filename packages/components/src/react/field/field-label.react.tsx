import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type FieldLabelProps = ComponentPropsWithRef<"label">

export function FieldLabel({ children, className, ...props }: FieldLabelProps) {
  return (
    <label
      {...props}
      data-slot="label"
      className={cn(
        "w-fit text-sm font-medium leading-5 tracking-[-0.01em] text-foreground group-has-[:required]/field:after:ml-0.5 group-has-[:required]/field:after:text-danger group-has-[:required]/field:after:content-['*'] group-has-[:disabled:not([popover]_*)]/field:cursor-not-allowed group-has-[:disabled:not([popover]_*)]/field:text-disabled-foreground group-has-[:disabled:not([popover]_*)]/field:after:text-disabled-foreground",
        className
      )}
    >
      {children}
    </label>
  )
}
