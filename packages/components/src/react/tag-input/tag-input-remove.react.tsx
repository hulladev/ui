import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type TagInputRemoveProps = Omit<ComponentPropsWithRef<"button">, "aria-label"> & {
  "aria-label": string
}

export function TagInputRemove({
  children,
  className,
  type = "button",
  ...props
}: TagInputRemoveProps) {
  return (
    <button
      {...props}
      type={type}
      data-slot="tag-input-remove"
      className={cn(
        "inline-flex size-6 shrink-0 items-center justify-center rounded-[0.25rem] text-muted-foreground transition-colors enabled:hover:bg-hover-surface enabled:hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:text-disabled-foreground motion-reduce:transition-none [&>svg]:size-3",
        className
      )}
    >
      {children ?? (
        <svg aria-hidden="true" viewBox="0 0 16 16" fill="none">
          <path d="m4 4 8 8m0-8-8 8" stroke="currentColor" strokeLinecap="round" />
        </svg>
      )}
    </button>
  )
}
