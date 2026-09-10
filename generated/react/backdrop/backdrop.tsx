import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type BackdropProps = ComponentPropsWithRef<"div">

export function Backdrop({ children, className, ...props }: BackdropProps) {
  return (
    <div
      {...props}
      aria-hidden="true"
      data-slot="backdrop"
      className={cn(
        "fixed inset-0 bg-foreground/40 backdrop-blur-[3px] transition-[display,opacity] duration-150 [transition-behavior:allow-discrete] motion-reduce:transition-none motion-reduce:backdrop-blur-none dark:bg-background/72 dark:backdrop-blur-[8px] [&[hidden]]:hidden [&[hidden]]:pointer-events-none [&[hidden]]:opacity-0 starting:opacity-0",
        className
      )}
    >
      {children}
    </div>
  )
}
