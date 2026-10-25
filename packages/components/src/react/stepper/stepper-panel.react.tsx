import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type StepperPanelProps = ComponentPropsWithRef<"div">

export function StepperPanel({ children, className, ...props }: StepperPanelProps) {
  return (
    <div
      {...props}
      data-slot="stepper-panel"
      className={cn(
        "col-start-2 grid min-w-0 gap-4 pb-8 pt-4 text-base leading-7 text-foreground group-last/step:pb-0 [&>*]:m-0",
        className
      )}
    >
      {children}
    </div>
  )
}
