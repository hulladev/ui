import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type TagInputProps = ComponentPropsWithRef<"div">

export function TagInput({ children, className, ...props }: TagInputProps) {
  return (
    <div
      {...props}
      data-slot="tag-input"
      className={cn(
        "flex min-h-11 w-full min-w-0 flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface p-1.5 shadow-xs transition-[border-color,box-shadow] focus-within:border-focus-ring focus-within:ring-2 focus-within:ring-focus-ring/25 has-[[aria-invalid=true]]:border-danger motion-reduce:transition-none",
        className
      )}
    >
      {children}
    </div>
  )
}
