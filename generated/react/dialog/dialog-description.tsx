import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type DialogDescriptionProps = ComponentPropsWithRef<"p">

export function DialogDescription({ children, className, ...props }: DialogDescriptionProps) {
  return (
    <p
      {...props}
      data-slot="dialog-description"
      className={cn(
        "text-muted-foreground group-data-[variant=compact]/dialog:text-sm group-data-[variant=compact]/dialog:leading-6 group-data-[variant=workspace]/dialog:text-xs group-data-[variant=workspace]/dialog:leading-5 group-data-[variant=fullscreen]/dialog:text-sm group-data-[variant=fullscreen]/dialog:leading-6",
        className
      )}
    >
      {children}
    </p>
  )
}
