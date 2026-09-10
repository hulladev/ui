import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type SliderMarksProps = JSX.IntrinsicElements["div"]

export function SliderMarks(props: SliderMarksProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <div
      {...rest}
      data-slot="slider-marks"
      class={cn(
        "flex justify-between font-mono text-[0.625rem] tabular-nums text-muted-foreground",
        local.class
      )}
    >
      {local.children}
    </div>
  )
}
