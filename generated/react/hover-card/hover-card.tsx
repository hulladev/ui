import { connectFloatingLayer } from "@/lib/floating-layer"
import { cn } from "@/lib/style"
import type { Placement } from "@floating-ui/dom"
import { useEffect, useImperativeHandle, useRef, type ComponentPropsWithRef } from "react"

const $layer =
  "fixed top-0 left-0 m-0 invisible pointer-events-none scale-[0.98] opacity-0 transition-[display,opacity,overlay,transform,visibility] duration-150 ease-out [transition-behavior:allow-discrete] [&[data-positioned=true]:popover-open]:visible [&[data-positioned=true]:popover-open]:pointer-events-auto [&[data-positioned=true]:popover-open]:scale-100 [&[data-positioned=true]:popover-open]:opacity-100 motion-reduce:transition-none"

export type HoverCardProps = Omit<ComponentPropsWithRef<"div">, "popover"> & {
  closeDelay?: number
  openDelay?: number
  placement?: Placement
  popover?: "" | "auto" | "hint" | "manual"
  triggerId: string
}

export function HoverCard({
  children,
  className,
  closeDelay = 300,
  openDelay = 200,
  placement = "bottom-start",
  popover = "hint",
  triggerId,
  ...props
}: HoverCardProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(props.ref, () => elementRef.current as HTMLDivElement, [])

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const controller = connectFloatingLayer(element, {
      closeDelay,
      offset: 10,
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
      data-placement={placement}
      data-slot="hover-card"
      className={cn(
        $layer,
        "max-h-[calc(100vh-1rem)] w-80 max-w-[calc(100vw-1rem)] overflow-auto rounded-md border border-border/85 bg-surface-raised p-4 text-sm text-foreground shadow-xl ring-1 ring-foreground/5",
        className
      )}
    >
      {children}
    </div>
  )
}
