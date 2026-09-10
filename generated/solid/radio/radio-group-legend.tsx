import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type RadioGroupLegendProps = JSX.IntrinsicElements["legend"]

export function RadioGroupLegend(props: RadioGroupLegendProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <legend
      {...rest}
      data-slot="radio-group-legend"
      class={cn("mb-1 text-sm font-medium text-foreground", local.class)}
    >
      {local.children}
    </legend>
  )
}
