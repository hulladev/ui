import { cn } from "@/lib/style"
import type { ComponentPropsWithoutRef } from "react"

export type AccordionProps = ComponentPropsWithoutRef<"div">

export function Accordion({ children, className, ...props }: AccordionProps) {
  return (
    <div
      {...props}
      data-slot="accordion"
      className={cn("w-full border-y border-border", className)}
    >
      {children}
    </div>
  )
}
