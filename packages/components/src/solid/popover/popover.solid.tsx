import { mergeProps, splitProps, type JSX } from "solid-js"
import { popoverPlacements, popoverSurface } from "@/+css/popover.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"

const $placement = resolve(popoverPlacements)
const $surface = resolve(popoverSurface)

export type PopoverProps = JSX.IntrinsicElements["div"] & {
  placement?: typeof $placement.infer
}

export function Popover(props: PopoverProps) {
  const [local, rest] = splitProps(
    mergeProps({ placement: "bottom", popover: "auto" } as const, props),
    ["children", "class", "placement", "popover"]
  )

  return (
    <div
      {...rest}
      popover={local.popover}
      data-placement={local.placement}
      data-slot="popover"
      class={cn($surface, $placement(local.placement), local.class)}
    >
      {local.children}
    </div>
  )
}
