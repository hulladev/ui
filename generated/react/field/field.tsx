import { cn } from "@/lib/style"
import type { ComponentPropsWithRef, ReactNode } from "react"

export type FieldProps = Omit<ComponentPropsWithRef<"div">, "children"> & {
  children: ReactNode
}

export function Field({ children, className, ...props }: FieldProps) {
  return (
    <div
      {...props}
      data-slot="field"
      className={cn("group/field grid min-w-0 content-start gap-1.5 text-left", className)}
    >
      {children}
    </div>
  )
}
