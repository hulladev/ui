import { cn } from "@/lib/style"
import type { ComponentPropsWithoutRef, ReactNode } from "react"

export type FieldProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  children: ReactNode
}

export function Field({ children, className, ...props }: FieldProps) {
  return (
    <div
      {...props}
      data-slot="field"
      className={cn(
        "group/field grid min-w-0 gap-1.5 text-left has-[:disabled]:opacity-70",
        className
      )}
    >
      {children}
    </div>
  )
}
