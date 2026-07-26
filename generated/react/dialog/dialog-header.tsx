import { cn } from "@/lib/style"
import type { ComponentPropsWithoutRef } from "react"

export type DialogHeaderProps = ComponentPropsWithoutRef<"div">

export function DialogHeader({ children, className, ...props }: DialogHeaderProps) {
  return (
    <div
      {...props}
      data-slot="dialog-header"
      className={cn(
        "grid gap-1.5 text-left group-data-[variant=compact]/dialog:mb-5 group-data-[variant=workspace]/dialog:shrink-0 group-data-[variant=workspace]/dialog:border-b group-data-[variant=workspace]/dialog:border-border group-data-[variant=workspace]/dialog:px-6 group-data-[variant=workspace]/dialog:py-4 group-data-[variant=fullscreen]/dialog:shrink-0 group-data-[variant=fullscreen]/dialog:border-b group-data-[variant=fullscreen]/dialog:border-border group-data-[variant=fullscreen]/dialog:px-5 group-data-[variant=fullscreen]/dialog:py-5 sm:group-data-[variant=fullscreen]/dialog:px-8",
        className
      )}
    >
      {children}
    </div>
  )
}
