import { connectFloatingLayer } from "@/lib/floating-layer"
import { cn } from "@/lib/style"
import type { Placement } from "@floating-ui/dom"
import { useEffect, useRef, type ComponentPropsWithoutRef } from "react"

const $layer =
  "fixed top-0 left-0 m-0 invisible pointer-events-none scale-[0.98] opacity-0 transition-[display,opacity,overlay,transform,visibility] duration-150 ease-out [transition-behavior:allow-discrete] [&[data-positioned=true]:popover-open]:visible [&[data-positioned=true]:popover-open]:pointer-events-auto [&[data-positioned=true]:popover-open]:scale-100 [&[data-positioned=true]:popover-open]:opacity-100 motion-reduce:transition-none"

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
