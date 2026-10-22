import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type StepperContentProps = ComponentPropsWithRef<"span">

export function StepperContent({ children, className, ...props }: StepperContentProps) {
  return (
    <span
      {...props}
      data-slot="stepper-content"
      className={cn(
        "grid min-w-0 gap-1 group-data-[variant=ordered]/stepper:self-center group-data-[variant=ordered]/stepper:text-base group-data-[variant=ordered]/stepper:leading-6 group-data-[variant=ordered]/stepper:font-semibold",
        className
      )}
    >
      {children}
    </span>
  )
}
