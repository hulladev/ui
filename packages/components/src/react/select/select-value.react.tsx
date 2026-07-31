import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type SelectValueProps = ComponentPropsWithRef<"span"> & {
  placeholder?: string
}

export function SelectValue({ children, className, placeholder = "", ...props }: SelectValueProps) {
  return (
    <span
      {...props}
      data-placeholder={placeholder}
      data-slot="select-value"
      className={cn(
        "min-w-0 flex-1 truncate data-[state=placeholder]:text-muted-foreground",
        className
      )}
    >
      {children ?? placeholder}
    </span>
  )
}
