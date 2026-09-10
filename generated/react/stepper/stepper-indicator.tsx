import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type StepperIndicatorProps = ComponentPropsWithRef<"span">

export function StepperIndicator({ children, className, ...props }: StepperIndicatorProps) {
  return (
    <span
      {...props}
      data-slot="stepper-indicator"
      className={cn(
        "relative inline-flex h-4 min-w-4 shrink-0 items-center justify-start font-mono text-[0.6875rem] leading-4 font-medium tabular-nums text-muted-foreground group-data-[state=current]/step:text-foreground",
        className
      )}
    >
      <span className="group-data-[state=complete]/step:opacity-0">{children}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        className="absolute size-4 opacity-0 group-data-[state=complete]/step:opacity-100"
      >
        <path
          d="m4.5 10 3.5 3.5 7.5-7.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}
