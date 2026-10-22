import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type StepperDescriptionProps = ComponentPropsWithRef<"span">

export function StepperDescription({ children, className, ...props }: StepperDescriptionProps) {
  return (
    <span
      {...props}
      data-slot="stepper-description"
      className={cn(
        "text-xs font-normal leading-4 text-muted-foreground group-data-[variant=ordered]/stepper:text-sm group-data-[variant=ordered]/stepper:leading-5",
        className
      )}
    >
      {children}
    </span>
  )
}
