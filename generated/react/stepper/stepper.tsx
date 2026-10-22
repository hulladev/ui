import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type StepperProps = ComponentPropsWithRef<"ol"> & {
  orientation?: "horizontal" | "vertical"
  variant?: "progress" | "ordered"
}

export function Stepper({
  children,
  className,
  orientation = "horizontal",
  variant = "progress",
  ...props
}: StepperProps) {
  const resolvedOrientation = variant === "ordered" ? "vertical" : orientation
  return (
    <ol
      {...props}
      data-orientation={resolvedOrientation}
      data-variant={variant}
      role="list"
      data-slot="stepper"
      className={cn(
        "group/stepper m-0 flex w-full min-w-0 list-none gap-5 p-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:gap-4 data-[variant=ordered]:gap-0",
        className
      )}
    >
      {children}
    </ol>
  )
}
