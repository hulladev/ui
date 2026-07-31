import { popoverPlacements, popoverSurface } from "@/+css/popover.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"
import type { ComponentPropsWithRef } from "react"

const $placement = resolve(popoverPlacements)
const $surface = resolve(popoverSurface)

export type PopoverProps = ComponentPropsWithRef<"div"> & {
  placement?: typeof $placement.infer
}

export function Popover({
  children,
  className,
  placement = "bottom",
  popover = "auto",
  ...props
}: PopoverProps) {
  return (
    <div
      {...props}
      popover={popover}
      data-placement={placement}
      data-slot="popover"
      className={cn($surface, $placement(placement), className)}
    >
      {children}
    </div>
  )
}
