import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type ComboboxEmptyProps = ComponentPropsWithRef<"div">

export function ComboboxEmpty({
  children,
  className,
  role = "status",
  ...props
}: ComboboxEmptyProps) {
  return (
    <div
      {...props}
      hidden
      role={role}
      data-slot="combobox-empty"
      className={cn(
        "px-3 py-6 text-center text-[0.8125rem] leading-5 text-muted-foreground",
        className
      )}
    >
      {children}
    </div>
  )
}
