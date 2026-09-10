import { vn, cn } from "@/lib/style"
import { createMutableRef, exposeRef, onMountEffect } from "@/lib/solid"
import { mergeProps, splitProps, type JSX } from "solid-js"
import { Backdrop } from "../backdrop/backdrop"
import { connectDialog, onDialogDismiss, type DialogDismissReason } from "@/lib/dialog"

const $overlaySide = vn({
  right: "justify-items-end [&[hidden]>[data-slot=drawer]]:[transform:translateX(100%)]",
  left: "justify-items-start [&[hidden]>[data-slot=drawer]]:[transform:translateX(-100%)]",
  top: "items-start [&[hidden]>[data-slot=drawer]]:[transform:translateY(-100%)]",
  bottom: "items-end [&[hidden]>[data-slot=drawer]]:[transform:translateY(100%)]",
})
const $side = vn({
  right:
    "h-dvh w-[min(24rem,calc(100vw-2rem))] border-l border-border starting:[transform:translateX(100%)]",
  left: "h-dvh w-[min(24rem,calc(100vw-2rem))] border-r border-border starting:[transform:translateX(-100%)]",
  top: "max-h-[calc(100dvh-2rem)] w-full border-b border-border starting:[transform:translateY(-100%)]",
  bottom:
    "max-h-[calc(100dvh-2rem)] w-full border-t border-border starting:[transform:translateY(100%)]",
})

export type DrawerProps = Omit<JSX.IntrinsicElements["div"], "onDismiss"> & {
  contentClassName?: string
  contentStyle?: JSX.CSSProperties
  dismissible?: boolean
  onDismiss?: (reason: DialogDismissReason) => void
  side?: typeof $side.infer
}

export function Drawer(props: DrawerProps) {
  const [local, rest] = splitProps(
    mergeProps(
      {
        "aria-modal": true,
        dismissible: true,
        hidden: false,
        role: "dialog",
        tabIndex: -1,
        side: "right",
      } as const,
      props
    ),
    [
      "aria-modal",
      "children",
      "class",
      "contentClassName",
      "contentStyle",
      "dismissible",
      "hidden",
      "onDismiss",
      "role",
      "style",
      "tabIndex",
      "side",
    ]
  )

  const elementRef = createMutableRef<HTMLDivElement>(null)
  exposeRef(rest.ref, () => elementRef.current as HTMLDivElement, [])
  onMountEffect(() => {
    const element = elementRef.current
    if (!element) return

    const controller = connectDialog(element)
    const removeDismissListener = onDialogDismiss(element, (event) => {
      local.onDismiss?.(event.detail.reason)
    })

    return () => {
      removeDismissListener()
      controller.destroy()
    }
  })

  return (
    <div
      {...rest}
      ref={elementRef}
      aria-modal={local["aria-modal"]}
      data-dismissible={local.dismissible}
      data-slot="drawer-overlay"
      data-state={local.hidden ? "closed" : "open"}
      data-side={local.side}
      hidden={local.hidden}
      role={local.role}
      tabindex={local.tabIndex}
      style={
        typeof local.style === "string"
          ? `${local.style};z-index:calc(var(--hulla-layer-base, 1000) + var(--hulla-layer-order, 0))`
          : {
              "z-index": "calc(var(--hulla-layer-base, 1000) + var(--hulla-layer-order, 0))",
              ...local.style,
            }
      }
      class={cn(
        "fixed inset-0 grid max-h-dvh overflow-hidden overscroll-contain focus:outline-none transition-[display] duration-160 [transition-behavior:allow-discrete] motion-reduce:transition-none [&[hidden]]:hidden [&[hidden]]:pointer-events-none [&[hidden]>[data-slot=backdrop]]:opacity-0",
        $overlaySide(local.side),
        local.class
      )}
    >
      <Backdrop />
      <div
        data-slot="drawer"
        data-side={local.side}
        tabindex={-1}
        style={local.contentStyle}
        class={cn(
          "group/drawer relative flex min-h-0 flex-col gap-6 overflow-y-auto overscroll-contain bg-surface-raised p-6 text-foreground shadow-(--shadow-overlay) focus:outline-none transition-transform duration-160 ease-out motion-reduce:transition-none",
          $side(local.side),
          local.contentClassName
        )}
      >
        {local.children}
      </div>
    </div>
  )
}
