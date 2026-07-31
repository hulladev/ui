import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type InputAdornmentProps = ComponentPropsWithRef<"span">

export function InputAdornment({ children, className, ...props }: InputAdornmentProps) {
  return (
    <span
      {...props}
      data-slot="input-adornment"
      className={cn(
        "inline-flex h-full shrink-0 items-center justify-center gap-1.5 whitespace-nowrap text-muted-foreground [&>svg]:size-[1em] [&>svg]:shrink-0",
        className
      )}
    >
      {children}
    </span>
  )
}
