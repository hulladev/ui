import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type SliderProps = Omit<ComponentPropsWithRef<"input">, "type">

export function Slider({ className, ...props }: SliderProps) {
  return (
    <input
      {...props}
      type="range"
      data-slot="slider"
      className={cn(
        "block h-6 w-full min-w-0 appearance-none bg-transparent align-middle focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:[&::-moz-range-thumb]:transition-none motion-reduce:[&::-webkit-slider-thumb]:transition-none [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-foreground/[0.14] [&::-moz-range-track]:shadow-inner [&::-moz-range-thumb]:size-[1.125rem] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-surface-raised [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:transition-[box-shadow,transform] [&::-moz-range-thumb]:duration-150 [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-foreground/[0.14] [&::-webkit-slider-runnable-track]:shadow-inner [&::-webkit-slider-thumb]:-mt-1.5 [&::-webkit-slider-thumb]:size-[1.125rem] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-surface-raised [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:transition-[box-shadow,transform] [&::-webkit-slider-thumb]:duration-150 hover:[&::-moz-range-thumb]:scale-105 hover:[&::-webkit-slider-thumb]:scale-105 active:[&::-moz-range-thumb]:scale-110 active:[&::-webkit-slider-thumb]:scale-110 focus-visible:[&::-moz-range-thumb]:ring-2 focus-visible:[&::-moz-range-thumb]:ring-focus-ring focus-visible:[&::-moz-range-thumb]:ring-offset-2 focus-visible:[&::-moz-range-thumb]:ring-offset-surface focus-visible:[&::-webkit-slider-thumb]:ring-2 focus-visible:[&::-webkit-slider-thumb]:ring-focus-ring focus-visible:[&::-webkit-slider-thumb]:ring-offset-2 focus-visible:[&::-webkit-slider-thumb]:ring-offset-surface disabled:[&::-moz-range-thumb]:shadow-none disabled:[&::-webkit-slider-thumb]:shadow-none dark:[&::-moz-range-track]:bg-foreground/[0.22] dark:[&::-webkit-slider-runnable-track]:bg-foreground/[0.22] aria-invalid:[&::-moz-range-track]:bg-danger/20 aria-invalid:[&::-moz-range-thumb]:bg-danger aria-invalid:[&::-webkit-slider-runnable-track]:bg-danger/20 aria-invalid:[&::-webkit-slider-thumb]:bg-danger aria-invalid:focus-visible:[&::-moz-range-thumb]:ring-danger aria-invalid:focus-visible:[&::-webkit-slider-thumb]:ring-danger",
        className
      )}
    />
  )
}
