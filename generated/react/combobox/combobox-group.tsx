import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type ComboboxGroupProps = ComponentPropsWithRef<"div">

export function ComboboxGroup({
  children,
  className,
  role = "group",
  ...props
}: ComboboxGroupProps) {
  return (
    <div
      {...props}
      role={role}
      data-slot="combobox-group"
      className={cn(
        "py-0.5 not-first:border-t not-first:border-border not-first:pt-1.5",
        className
      )}
    >
      {children}
    </div>
  )
}
