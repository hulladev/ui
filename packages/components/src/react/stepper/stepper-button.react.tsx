import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type StepperButtonProps = ComponentPropsWithRef<"button">

export function StepperButton({
  children,
  className,
  type = "button",
  ...props
}: StepperButtonProps) {
  return (
    <button
      {...props}
      type={type}
      data-slot="stepper-button"
      className={cn(
        "relative flex w-full min-w-0 flex-col items-start gap-3 rounded-none pb-1 text-left text-sm leading-5 font-medium transition-colors enabled:hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring disabled:cursor-not-allowed group-data-[state=current]/step:font-semibold group-data-[orientation=vertical]/stepper:flex-row group-data-[orientation=vertical]/stepper:items-start group-data-[orientation=vertical]/stepper:gap-4 motion-reduce:transition-none",
        className
      )}
    >
      {children}
    </button>
  )
}
