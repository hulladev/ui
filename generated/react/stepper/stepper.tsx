import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type StepperProps = ComponentPropsWithRef<"ol"> & { orientation?: "horizontal" | "vertical" }

export function Stepper({
  children,
  className,
  orientation = "horizontal",
  ...props
}: StepperProps) {
  return (
    <ol
      {...props}
      data-orientation={orientation}
      role="list"
      data-slot="stepper"
      className={cn(
        "group/stepper m-0 flex w-full min-w-0 list-none gap-5 p-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:gap-4",
        className
      )}
    >
      {children}
    </ol>
  )
}
