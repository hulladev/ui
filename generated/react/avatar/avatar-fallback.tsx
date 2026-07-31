import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type AvatarFallbackProps = ComponentPropsWithRef<"span">

export function AvatarFallback({ children, className, ...props }: AvatarFallbackProps) {
  return (
    <span
      {...props}
      aria-hidden="true"
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full select-none items-center justify-center bg-foreground/5 font-medium tracking-[-0.02em] uppercase",
        className
      )}
    >
      {children}
    </span>
  )
}
