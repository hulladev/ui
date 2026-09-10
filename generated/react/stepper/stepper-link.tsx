import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type StepperLinkProps = ComponentPropsWithRef<"a">

export function StepperLink({ children, className, ...props }: StepperLinkProps) {
  return (
    <a
      {...props}
      data-slot="stepper-link"
      className={cn(
        "relative flex min-w-0 flex-col items-start gap-3 rounded-none pb-1 text-sm leading-5 font-medium transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring group-data-[state=current]/step:font-semibold group-data-[orientation=vertical]/stepper:flex-row group-data-[orientation=vertical]/stepper:items-start group-data-[orientation=vertical]/stepper:gap-4 motion-reduce:transition-none",
        className
      )}
    >
      {children}
    </a>
  )
}
