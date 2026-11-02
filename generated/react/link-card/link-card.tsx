import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type LinkCardProps = ComponentPropsWithRef<"a">

export function LinkCard({ children, className, ...props }: LinkCardProps) {
  return (
    <a
      {...props}
      data-slot="link-card"
      className={cn(
        "group/link-card flex min-w-0 items-start gap-3 rounded-md px-3 py-3 text-left text-foreground no-underline transition-[background-color,color,transform] duration-150 hover:bg-hover-surface focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus-ring active:translate-y-px aria-[current=page]:bg-selected-surface aria-[current=page]:hover:bg-selected-hover-surface aria-[current=page]:text-primary-text motion-reduce:transition-none",
        className
      )}
    >
      {children}
    </a>
  )
}
