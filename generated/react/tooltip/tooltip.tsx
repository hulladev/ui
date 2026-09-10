import { connectFloatingLayer } from "@/lib/floating-layer"
import { cn } from "@/lib/style"
import type { Placement } from "@floating-ui/dom"
import { useEffect, useImperativeHandle, useRef, type ComponentPropsWithRef } from "react"

const $layer =
  "fixed top-0 left-0 m-0 invisible pointer-events-none opacity-0 transition-[display,opacity,overlay,translate,visibility] duration-120 ease-out [transition-behavior:allow-discrete] [&[data-placement^=top]]:translate-y-0.5 [&[data-placement^=bottom]]:-translate-y-0.5 [&[data-placement^=left]]:translate-x-0.5 [&[data-placement^=right]]:-translate-x-0.5 [&[data-positioned=true]:popover-open]:visible [&[data-positioned=true]:popover-open]:pointer-events-auto [&[data-positioned=true]:popover-open]:translate-none [&[data-positioned=true]:popover-open]:opacity-100 starting:[&[data-positioned=true]:popover-open]:opacity-0 starting:[&[data-positioned=true][data-placement^=top]:popover-open]:translate-y-0.5 starting:[&[data-positioned=true][data-placement^=bottom]:popover-open]:-translate-y-0.5 starting:[&[data-positioned=true][data-placement^=left]:popover-open]:translate-x-0.5 starting:[&[data-positioned=true][data-placement^=right]:popover-open]:-translate-x-0.5 motion-reduce:transition-none motion-reduce:translate-none"

export type TooltipProps = Omit<ComponentPropsWithRef<"div">, "popover"> & {
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
  openDelay = 100,
  placement = "top",
  popover = "hint",
  role = "tooltip",
  triggerId,
  ...props
}: TooltipProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(props.ref, () => elementRef.current as HTMLDivElement, [])

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
      popover={popover as ComponentPropsWithRef<"div">["popover"]}
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
