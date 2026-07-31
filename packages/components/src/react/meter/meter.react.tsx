import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type MeterProps = ComponentPropsWithRef<"meter">

export function Meter({ children, className, ...props }: MeterProps) {
  return (
    <meter
      {...props}
      data-slot="meter"
      className={cn(
        "block h-2 w-full appearance-none overflow-hidden rounded-full border-0 bg-foreground/10 align-middle text-primary [&::-moz-meter-bar]:rounded-full [&::-moz-meter-bar]:[background:currentColor] [&::-webkit-meter-bar]:h-2 [&::-webkit-meter-bar]:rounded-full [&::-webkit-meter-bar]:border-0 [&::-webkit-meter-bar]:shadow-none [&::-webkit-meter-bar]:[background:color-mix(in_oklab,var(--color-foreground)_10%,transparent)] [&::-webkit-meter-even-less-good-value]:rounded-full [&::-webkit-meter-even-less-good-value]:[background:var(--color-danger)] [&::-webkit-meter-optimum-value]:rounded-full [&::-webkit-meter-optimum-value]:[background:var(--color-success)] [&::-webkit-meter-suboptimum-value]:rounded-full [&::-webkit-meter-suboptimum-value]:[background:var(--color-warning)]",
        className
      )}
    >
      {children}
    </meter>
  )
}
