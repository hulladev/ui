import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type StepperContentProps = ComponentPropsWithRef<"span">

export function StepperContent({ children, className, ...props }: StepperContentProps) {
  return (
    <span {...props} data-slot="stepper-content" className={cn("grid min-w-0 gap-1", className)}>
      {children}
    </span>
  )
}
