import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type MeterProps = JSX.IntrinsicElements["meter"]

export function Meter(props: MeterProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <meter
      {...rest}
      data-slot="meter"
      class={cn(
        "block h-2 w-full appearance-none overflow-hidden rounded-full border-0 bg-foreground/10 align-middle text-primary [&::-moz-meter-bar]:rounded-full [&:-moz-meter-optimum::-moz-meter-bar]:[background:var(--color-success)] [&:-moz-meter-sub-optimum::-moz-meter-bar]:[background:var(--color-warning)] [&:-moz-meter-sub-sub-optimum::-moz-meter-bar]:[background:var(--color-danger)] [&::-webkit-meter-bar]:h-2 [&::-webkit-meter-bar]:rounded-full [&::-webkit-meter-bar]:border-0 [&::-webkit-meter-bar]:shadow-none [&::-webkit-meter-bar]:[background:transparent] [&::-webkit-meter-even-less-good-value]:rounded-full [&::-webkit-meter-even-less-good-value]:[background:var(--color-danger)] [&::-webkit-meter-optimum-value]:rounded-full [&::-webkit-meter-optimum-value]:[background:var(--color-success)] [&::-webkit-meter-suboptimum-value]:rounded-full [&::-webkit-meter-suboptimum-value]:[background:var(--color-warning)]",
        local.class
      )}
    >
      {local.children}
    </meter>
  )
}
