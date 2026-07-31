import { cn } from "@/lib/style"
import type { ComponentPropsWithRef, ReactNode } from "react"

export type RadioGroupProps = Omit<ComponentPropsWithRef<"fieldset">, "children"> & {
  children: ReactNode
}

export function RadioGroup({ children, className, ...props }: RadioGroupProps) {
  return (
    <fieldset
      {...props}
      data-slot="radio-group"
      className={cn("m-0 grid min-w-0 gap-3 border-0 p-0 text-left", className)}
    >
      {children}
    </fieldset>
  )
}
