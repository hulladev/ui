import { createMutableRef, exposeRef, createLifecycleEffect } from "@/lib/solid"
import { mergeProps, splitProps, type JSX } from "solid-js"
import { connectFloatingLayer } from "@/lib/floating-layer"
import { cn } from "@/lib/style"
import type { Placement } from "@floating-ui/dom"

const $layer =
  "fixed top-0 left-0 m-0 invisible pointer-events-none opacity-0 transition-[display,opacity,overlay,translate,visibility] duration-120 ease-out [transition-behavior:allow-discrete] [&[data-placement^=top]]:translate-y-0.5 [&[data-placement^=bottom]]:-translate-y-0.5 [&[data-placement^=left]]:translate-x-0.5 [&[data-placement^=right]]:-translate-x-0.5 [&[data-positioned=true]:popover-open]:visible [&[data-positioned=true]:popover-open]:pointer-events-auto [&[data-positioned=true]:popover-open]:translate-none [&[data-positioned=true]:popover-open]:opacity-100 starting:[&[data-positioned=true]:popover-open]:opacity-0 starting:[&[data-positioned=true][data-placement^=top]:popover-open]:translate-y-0.5 starting:[&[data-positioned=true][data-placement^=bottom]:popover-open]:-translate-y-0.5 starting:[&[data-positioned=true][data-placement^=left]:popover-open]:translate-x-0.5 starting:[&[data-positioned=true][data-placement^=right]:popover-open]:-translate-x-0.5 motion-reduce:transition-none motion-reduce:translate-none"

export type TooltipProps = Omit<JSX.IntrinsicElements["div"], "popover"> & {
  closeDelay?: number
  openDelay?: number
  placement?: Placement
  popover?: "" | "auto" | "hint" | "manual"
  triggerId: string
}

export function Tooltip(props: TooltipProps) {
  const [local, rest] = splitProps(
    mergeProps(
      {
        closeDelay: 100,
        openDelay: 100,
        placement: "top",
        popover: "hint",
        role: "tooltip",
      } as const,
      props
    ),
    ["children", "class", "closeDelay", "openDelay", "placement", "popover", "role", "triggerId"]
  )

  const elementRef = createMutableRef<HTMLDivElement>(null)
  exposeRef(rest.ref, () => elementRef.current as HTMLDivElement, [])

  createLifecycleEffect(
    () => {
      const element = elementRef.current
      if (!element) return

      const controller = connectFloatingLayer(element, {
        closeDelay: local.closeDelay,
        offset: 7,
        openDelay: local.openDelay,
        placement: local.placement,
        triggerId: local.triggerId,
      })
      return () => controller.destroy()
    },
    () => [local.closeDelay, local.openDelay, local.placement, local.triggerId]
  )

  return (
    <div
      {...rest}
      ref={elementRef}
      popover={local.popover as JSX.IntrinsicElements["div"]["popover"]}
      role={local.role}
      data-placement={local.placement}
      data-slot="tooltip"
      class={cn(
        $layer,
        "max-w-72 rounded-sm border border-foreground/10 bg-foreground px-2 py-1 font-sans text-xs leading-5 font-medium text-background shadow-lg",
        local.class
      )}
    >
      {local.children}
    </div>
  )
}
