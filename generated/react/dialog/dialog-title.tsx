import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type DialogTitleProps = ComponentPropsWithRef<"h2">

export function DialogTitle({ children, className, ...props }: DialogTitleProps) {
  return (
    <h2
      {...props}
      data-slot="dialog-title"
      className={cn(
        "font-semibold tracking-[-0.025em] group-data-[variant=compact]/dialog:text-lg group-data-[variant=compact]/dialog:leading-6 group-data-[variant=workspace]/dialog:text-base group-data-[variant=workspace]/dialog:leading-6 group-data-[variant=fullscreen]/dialog:text-xl group-data-[variant=fullscreen]/dialog:leading-7",
        className
      )}
    >
      {children}
    </h2>
  )
}
