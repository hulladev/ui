import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type SliderMarksProps = ComponentPropsWithRef<"div">

export function SliderMarks({ children, className, ...props }: SliderMarksProps) {
  return (
    <div
      {...props}
      data-slot="slider-marks"
      className={cn(
        "flex justify-between font-mono text-[0.625rem] tabular-nums text-muted-foreground",
        className
      )}
    >
      {children}
    </div>
  )
}
