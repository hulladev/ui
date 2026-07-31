import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type AccordionProps = ComponentPropsWithRef<"div">

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
