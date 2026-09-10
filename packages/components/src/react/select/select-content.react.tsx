import { popoverPlacements, popoverSurface } from "@/+css/popover.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"
import type { ComponentPropsWithRef } from "react"

const $placement = resolve(popoverPlacements)
const $surface = resolve(popoverSurface)

export type SelectContentProps = ComponentPropsWithRef<"div"> & {
  placement?: typeof $placement.infer
}

export function SelectContent({
  children,
  className,
  placement = "bottom-start",
  popover = "auto",
  role = "listbox",
  tabIndex = -1,
  ...props
}: SelectContentProps) {
  return (
    <div
      {...props}
      popover={popover}
      role={role}
      tabIndex={tabIndex}
      data-placement={placement}
      data-slot="select-content"
      className={cn(
        $surface,
        $placement(placement),
        "min-w-[anchor-size(width)] max-w-[min(28rem,calc(100vw-1rem))] overscroll-contain p-0",
        className
      )}
    >
      {children}
    </div>
  )
}
