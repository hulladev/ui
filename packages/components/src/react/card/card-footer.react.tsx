import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type CardFooterProps = ComponentPropsWithRef<"footer">

export function CardFooter({ children, className, ...props }: CardFooterProps) {
  return (
    <footer
      {...props}
      data-slot="card-footer"
      className={cn("mt-auto flex flex-wrap items-center gap-2", className)}
    >
      {children}
    </footer>
  )
}
