import { cn } from "@/lib/style"
import type { ComponentPropsWithRef, ReactNode } from "react"

export type FieldProps = Omit<ComponentPropsWithRef<"div">, "children"> & {
  children: ReactNode
  orientation?: "vertical" | "horizontal"
}

export function Field({ children, className, orientation = "vertical", ...props }: FieldProps) {
  return (
    <div
      {...props}
      data-slot="field"
      data-orientation={orientation}
      className={cn(
        "group/field grid min-w-0 content-start gap-1.5 text-left data-[orientation=horizontal]:grid-cols-[auto_minmax(0,1fr)] data-[orientation=horizontal]:items-start data-[orientation=horizontal]:gap-x-4",
        className
      )}
    >
      {children}
    </div>
  )
}
