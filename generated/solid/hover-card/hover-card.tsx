import { createMutableRef, exposeRef, createLifecycleEffect } from "@/lib/solid"
import { mergeProps, splitProps, type JSX } from "solid-js"
import { connectFloatingLayer } from "@/lib/floating-layer"
import { cn } from "@/lib/style"
import type { Placement } from "@floating-ui/dom"

const $layer =
  "fixed top-0 left-0 m-0 invisible pointer-events-none scale-[0.98] opacity-0 transition-[display,opacity,overlay,transform,visibility] duration-150 ease-out [transition-behavior:allow-discrete] [&[data-positioned=true]:popover-open]:visible [&[data-positioned=true]:popover-open]:pointer-events-auto [&[data-positioned=true]:popover-open]:scale-100 [&[data-positioned=true]:popover-open]:opacity-100 motion-reduce:transition-none"

export type HoverCardProps = Omit<JSX.IntrinsicElements["div"], "popover"> & {
  closeDelay?: number
  openDelay?: number
  placement?: Placement
  popover?: "" | "auto" | "hint" | "manual"
  triggerId: string
}

export function HoverCard(props: HoverCardProps) {
  const [local, rest] = splitProps(
    mergeProps(
      { closeDelay: 300, openDelay: 200, placement: "bottom-start", popover: "hint" } as const,
      props
    ),
    ["children", "class", "closeDelay", "openDelay", "placement", "popover", "triggerId"]
  )

  const elementRef = createMutableRef<HTMLDivElement>(null)
  exposeRef(rest.ref, () => elementRef.current as HTMLDivElement, [])

  createLifecycleEffect(
    () => {
      const element = elementRef.current
      if (!element) return

      const controller = connectFloatingLayer(element, {
        closeDelay: local.closeDelay,
        offset: 10,
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
      data-placement={local.placement}
      data-slot="hover-card"
      class={cn(
        $layer,
        "max-h-[calc(100vh-1rem)] w-80 max-w-[calc(100vw-1rem)] overflow-auto rounded-md border border-border/85 bg-surface-raised p-4 text-sm text-foreground shadow-xl ring-1 ring-foreground/5",
        local.class
      )}
    >
      {local.children}
    </div>
  )
}
