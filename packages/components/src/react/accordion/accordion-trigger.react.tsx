import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type AccordionTriggerProps = ComponentPropsWithRef<"summary">

export function AccordionTrigger({ children, className, ...props }: AccordionTriggerProps) {
  return (
    <summary
      {...props}
      data-slot="accordion-trigger"
      className={cn(
        "relative flex min-h-12 list-none items-start gap-4 py-4 pr-10 text-left text-[0.9375rem] font-medium leading-5 tracking-[-0.01em] text-foreground transition-colors duration-150 after:absolute after:top-[1.3rem] after:right-1 after:size-2 after:-translate-y-0.5 after:rotate-45 after:border-r after:border-b after:border-current after:transition-transform after:duration-180 after:content-[''] hover:underline hover:decoration-primary hover:underline-offset-4 group-open/accordion-item:after:translate-y-1 group-open/accordion-item:after:rotate-[225deg] motion-reduce:transition-none motion-reduce:after:transition-none [&::-webkit-details-marker]:hidden",
        className
      )}
    >
      {children}
    </summary>
  )
}
