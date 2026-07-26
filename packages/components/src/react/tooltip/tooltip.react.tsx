import { floatingLayer } from "@/+css/floating-layer.css"
import { connectFloatingLayer } from "@/lib/floating-layer"
import { cn } from "@/lib/style"
import type { Placement } from "@floating-ui/dom"
import { resolve } from "@hulla/ui"
import { useEffect, useRef, type ComponentPropsWithoutRef } from "react"

const $layer = resolve(floatingLayer)

export type TooltipProps = Omit<ComponentPropsWithoutRef<"div">, "popover"> & {
  closeDelay?: number
  openDelay?: number
  placement?: Placement
  popover?: "" | "auto" | "hint" | "manual"
  triggerId: string
}

export function Tooltip({
  children,
  className,
  closeDelay = 100,
  openDelay = 180,
  placement = "top",
  popover = "hint",
  role = "tooltip",
  triggerId,
  ...props
}: TooltipProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const controller = connectFloatingLayer(element, {
      closeDelay,
      offset: 7,
      openDelay,
      placement,
      triggerId,
    })
    return () => controller.destroy()
  }, [closeDelay, openDelay, placement, triggerId])

  return (
    <div
      {...props}
      ref={elementRef}
      popover={popover as ComponentPropsWithoutRef<"div">["popover"]}
      role={role}
      data-placement={placement}
      data-slot="tooltip"
      className={cn(
        $layer,
        "max-w-72 rounded-sm border border-foreground/10 bg-foreground px-2 py-1 font-sans text-xs leading-5 font-medium text-background shadow-lg",
        className
      )}
    >
      {children}
    </div>
  )
}
