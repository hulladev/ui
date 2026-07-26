import { cn } from "@/lib/style"
import type { ComponentPropsWithoutRef } from "react"

export type AccordionItemProps = ComponentPropsWithoutRef<"details">

export function AccordionItem({ children, className, ...props }: AccordionItemProps) {
  return (
    <details
      {...props}
      data-slot="accordion-item"
      className={cn(
        "group/accordion-item border-t border-border first:border-t-0 [interpolate-size:allow-keywords] [&::details-content]:overflow-hidden [&::details-content]:[block-size:0] [&::details-content]:transition-[block-size,content-visibility] [&::details-content]:duration-[240ms] [&::details-content]:ease-[cubic-bezier(0.22,1,0.36,1)] [&::details-content]:[transition-behavior:allow-discrete] open:[&::details-content]:[block-size:auto] motion-reduce:[&::details-content]:transition-none",
        className
      )}
    >
      {children}
    </details>
  )
}
